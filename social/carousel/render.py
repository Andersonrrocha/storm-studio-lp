#!/usr/bin/env python3
"""
Storm Studio — carrossel v2: JSON -> JPG/PNG 1080x1350 prontos pro Instagram.

  social/.venv/bin/python social/carousel/render.py social/carousel/<deck>.json social/out/<pasta>

- Layout em 540x675, exportado com device_scale_factor=2.
- Os slides são renderizados lado a lado numa faixa contínua: uma linha elétrica
  atravessa os cortes (truque do carrossel *seamless* — força o swipe).
- Material real entra por `img` (caminho relativo à raiz do repo) em moldura
  `phone` ou `browser`. `crop: [l,t,r,b]` recorta a fonte antes de usar.
- Gera também `_sheet.jpg` com cada slide a 270px de largura: é o teste de
  legibilidade do primeiro frame no feed.
- Publicação pelo navegador aceita até 20 slides (a API trava em 10).
"""
import json, os, re, sys, glob, pathlib, base64, random
from playwright.sync_api import sync_playwright
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent
REPO = ROOT.parent.parent
CSS = re.search(r"<style>(.*?)</style>", (ROOT / "template.html").read_text(), re.S).group(1)
HEAD = re.search(r"<head>(.*?)<style>", (ROOT / "template.html").read_text(), re.S).group(1)
MARK = (REPO / "assets" / "storm-mark-2a-cobre.svg").read_text()
W, H = 540, 675


def _chrome():
    for pat in (os.environ.get("CHROME_PATH"),
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                "/opt/pw-browsers/chromium-*/chrome-linux/chrome",
                "/usr/bin/chromium", "/usr/bin/google-chrome"):
        if pat and sorted(glob.glob(pat)):
            return sorted(glob.glob(pat))[-1]
    return None


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def rich(t):
    """**negrito** -> <strong>, [cobre] -> <em>, //comentário -> .c"""
    t = esc(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\[(.+?)\]", r"<em>\1</em>", t)
    t = re.sub(r"(//.*)$", r'<span class="c">\1</span>', t)
    # tags mínimas permitidas no deck (conteúdo é nosso)
    t = t.replace("&lt;br&gt;", "<br>").replace("&lt;b&gt;", "<b>").replace("&lt;/b&gt;", "</b>")
    return t


def seam_svg(n, seed=7):
    """Linha elétrica contínua ao longo de toda a faixa + um raio grande cruzando o 1º corte."""
    rnd = random.Random(seed)
    total = n * W
    pts = []
    x = -20
    y = 300
    while x < total + 40:
        step = rnd.randint(70, 160)
        x += step
        y = max(120, min(H - 120, y + rnd.randint(-110, 110)))
        pts.append((x, y))
        if rnd.random() < .3:            # dente do raio
            pts.append((x + rnd.randint(8, 22), y + rnd.choice((-1, 1)) * rnd.randint(18, 46)))
    d = "M-20,300 " + " ".join(f"L{x},{y}" for x, y in pts)
    bolt = f"M{W*0.86},-40 L{W*0.66},{H*0.42} L{W*0.80},{H*0.42} L{W*0.58},{H+60} L{W*1.18},{H*0.30} L{W*0.98},{H*0.30} Z"
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{total}" height="{H}">'
           f'<defs><filter id="g"><feGaussianBlur stdDeviation="5"/></filter></defs>'
           f'<path d="{d}" fill="none" stroke="#fb923c" stroke-width="7" opacity=".10" filter="url(#g)"/>'
           f'<path d="{d}" fill="none" stroke="#fb923c" stroke-width="1.3" opacity=".42"/>'
           f'</svg>')
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode()).decode()


def img_uri(path, crop, outdir, i):
    src = (REPO / path)
    if not src.exists():
        print("AVISO: imagem não encontrada:", path); return None
    if crop:
        im = Image.open(src); im = im.crop(tuple(crop))
        p = outdir / f"_src_{i:02d}.png"; im.save(p); src = p
    return src.resolve().as_uri()


def media(s, uri):
    if not uri:
        return ""
    frame = s.get("frame", "phone")
    stamp = f'<div class="stamp {s.get("stampcls","")}">{esc(s["stamp"])}</div>' if s.get("stamp") else ""
    if frame == "browser":
        st = f' style="height:{s["imgh"]}"' if s.get("imgh") else ""
        return (f'<div class="browser media"><div class="bar"><i></i><i></i><i></i><span>{esc(s.get("url",""))}</span></div>'
                f'<img src="{uri}"{st}>{stamp}</div>')
    cls = "phone media " + s.get("pos", "")
    return f'<div class="{cls}"><img src="{uri}">{stamp}</div>'


def foot(i, n):
    return (f'<div class="foot"><span class="brand">{MARK}stormstudio.dev</span>'
            f'<span class="idx">{i+1:02d} / {n:02d}</span></div>')


def slide_html(s, i, n, outdir):
    t = s.get("type", "shot")
    kicker = f'<div class="kicker">{rich(s.get("kicker", "storm studio"))}</div>'
    uri = img_uri(s["img"], s.get("crop"), outdir, i) if s.get("img") else None
    body = ""
    if t == "cover":
        body = media(s, uri) + kicker + f'<h1>{rich(s["title"])}</h1><div class="swipe">{rich(s.get("swipe", "arrasta →"))}</div>'
    elif t == "shot":
        text = f'<div class="text {s.get("textcls","")}"><h2>{rich(s["title"])}</h2>' + (f'<p>{rich(s["text"])}</p>' if s.get("text") else "") + "</div>"
        code = ('<div class="code">' + "<br>".join(rich(l) for l in s["code"]) + "</div>") if s.get("code") else ""
        if s.get("pos") == "phone-r":
            body = media(s, uri) + kicker + text + code
        else:
            body = kicker + text + media(s, uri) + code
    elif t == "big":
        body = kicker + f'<div class="numrow"><div class="num">{esc(s["big"])}</div><span class="unit">{esc(s.get("unit",""))}</span></div><h2>{rich(s["title"])}</h2>' + (f'<p>{rich(s["text"])}</p>' if s.get("text") else "") + f'<div class="num-sub">{rich(s.get("sub",""))}</div>'
    elif t == "turn":
        bolt = '<svg class="bolt" viewBox="0 0 100 200"><path d="M62 0 18 108h30L34 200 88 78H56z" fill="#fb923c"/></svg>'
        body = bolt + kicker + f'<h2>{rich(s["title"])}</h2>' + (f'<p>{rich(s["text"])}</p>' if s.get("text") else "")
    elif t == "quote":
        body = media(s, uri) + kicker + f'<blockquote>{rich(s["quote"])}</blockquote><div class="who">{rich(s["who"])}</div>'
    elif t == "list":
        items = "".join(f'<li><div><b>{rich(it[0])}</b> <span>{rich(it[1])}</span></div></li>' for it in s["items"])
        body = kicker + f'<h2>{rich(s["title"])}</h2><ol>{items}</ol>'
    elif t == "cta":
        arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 5l7 7-7 7"/></svg>'
        body = kicker + f'<h2>{rich(s["title"])}</h2>' + (f'<p>{rich(s["text"])}</p>' if s.get("text") else "") + f'<div class="pill">{rich(s["cta"])}{arrow}</div>'
    cls = t + (" flip" if s.get("flip") else "")
    bg = ""
    if s.get("bg"):
        bguri = img_uri(s["bg"], None, outdir, 100 + i)
        if bguri:
            bg = f'<img class="bgimg" src="{bguri}"><div class="gen">imagem de fundo gerada</div>'
    style = f"--seam-x:{-i*W}px" + (f';--bg-op:{s["bgop"]}' if s.get("bgop") else "")
    return f'<div class="slide {cls}" style="{style}">{bg}{body}{foot(i, n)}</div>'


def main(deck_path, outdir):
    deck = json.loads(pathlib.Path(deck_path).read_text())
    slides = deck["slides"][:20]
    out = pathlib.Path(outdir).resolve(); out.mkdir(parents=True, exist_ok=True)
    n = len(slides)
    html = (f"<!doctype html><html lang='pt-BR'><head>{HEAD}<style>{CSS}\n:root{{--seam:url('{seam_svg(n)}')}}</style></head>"
            "<body><div class='strip'>" + "".join(slide_html(s, i, n, out) for i, s in enumerate(slides)) + "</div></body></html>")
    (out / "_preview.html").write_text(html)
    if deck.get("caption"):
        (out / "legenda.txt").write_text(deck["caption"])
    paths = []
    with sync_playwright() as p:
        ch = _chrome()
        b = p.chromium.launch(executable_path=ch) if ch else p.chromium.launch()
        page = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        page.goto((out / "_preview.html").as_uri(), wait_until="networkidle")
        page.wait_for_timeout(1500)
        for i, el in enumerate(page.query_selector_all(".slide")):
            f = out / f"slide_{i+1:02d}.jpg"
            el.screenshot(path=str(f), type="jpeg", quality=94)
            el.screenshot(path=str(out / f"slide_{i+1:02d}.png"))
            paths.append(f)
        b.close()
    # folha de contato a 270px: teste de legibilidade do feed
    cols = 4; tw, th = 270, 338
    sheet = Image.new("RGB", (cols * (tw + 12) + 12, ((n + cols - 1) // cols) * (th + 12) + 12), (10, 10, 12))
    for i, f in enumerate(paths):
        im = Image.open(f).resize((tw, th), Image.LANCZOS)
        sheet.paste(im, (12 + (i % cols) * (tw + 12), 12 + (i // cols) * (th + 12)))
    sheet.save(out / "_sheet.jpg", quality=88)
    for f in paths:
        print(f)
    print(out / "_sheet.jpg")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "social/out/carrossel")
