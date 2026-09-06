#!/usr/bin/env python3
"""
Storm Studio — carrossel: JSON -> PNGs 1080x1350 prontos pro Instagram.

  python3 social/carousel/render.py social/carousel/deck-exemplo.json social/out/carrossel

Layout desenhado em 540x675 e exportado com device_scale_factor=2 (retina),
então o CSS fica legível e o PNG sai em 1080x1350 (4:5 — o formato que ocupa
mais tela no feed).
"""
import json, os, re, sys, pathlib, glob
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent
def _chrome():
    """Usa o Chromium já instalado na máquina/container, se houver."""
    for pat in (os.environ.get("CHROME_PATH"),
                "/opt/pw-browsers/chromium-*/chrome-linux/chrome",
                "/usr/bin/chromium", "/usr/bin/google-chrome"):
        if not pat:
            continue
        hit = sorted(glob.glob(pat))
        if hit:
            return hit[-1]
    return None


CHROME = _chrome()
CSS = re.search(r"<style>(.*?)</style>", (ROOT / "template.html").read_text(), re.S).group(1)


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def rich(t):
    """**negrito** -> <strong>, [cobre] -> <em>"""
    t = esc(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\[(.+?)\]", r"<em>\1</em>", t)
    return t


def slide_html(s, i, n):
    kicker = rich(s.get("kicker", "storm studio"))
    idx = f"{i+1:02d}/{n:02d}"
    bolt = ('<svg class="bolt" viewBox="0 0 100 200">'
            '<path d="M62 0 18 108h30L34 200 88 78H56z" fill="#fb923c"/></svg>')
    body = []
    t = s.get("type", "point")
    if t == "cover":
        body.append(f'<h1>{rich(s["title"])}</h1>')
        body.append('<div class="swipe">arrasta &rarr;</div>')
    elif t == "cta":
        body.append(f'<div class="body"><h2>{rich(s["title"])}</h2>')
        if s.get("text"):
            body.append(f'<p>{rich(s["text"])}</p>')
        body.append(f'<div class="cta">{rich(s.get("cta", "chama no direct"))}</div></div>')
    else:
        body.append('<div class="body">')
        body.append(f'<h2>{rich(s["title"])}</h2>')
        if s.get("text"):
            body.append(f'<p>{rich(s["text"])}</p>')
        if s.get("code"):
            code = "<br>".join(rich(l) for l in s["code"])
            body.append(f'<div class="code">{code}</div>')
        body.append("</div>")
    return (f'<div class="slide">{bolt}<div class="kicker">{kicker}</div>'
            + "".join(body)
            + f'<div class="foot"><span>@stormstudio</span><span class="idx">{idx}</span></div></div>')


def main(deck_path, outdir):
    deck = json.loads(pathlib.Path(deck_path).read_text())
    slides = deck["slides"][:10]          # limite da API do Instagram: 10 mídias
    out = pathlib.Path(outdir).resolve(); out.mkdir(parents=True, exist_ok=True)
    html = (f"<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'>"
            "<link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>"
            "<link href='https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700"
            "&family=JetBrains+Mono:wght@400;500;600&display=swap' rel='stylesheet'>"
            f"<style>{CSS}</style></head><body>"
            + "".join(slide_html(s, i, len(slides)) for i, s in enumerate(slides))
            + "</body></html>")
    (out / "_preview.html").write_text(html)
    paths = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME) if CHROME else p.chromium.launch()
        page = b.new_page(viewport={"width": 540, "height": 675}, device_scale_factor=2)
        page.goto((out / "_preview.html").as_uri())
        page.wait_for_timeout(1200)       # webfonts
        for i, el in enumerate(page.query_selector_all(".slide")):
            # JPEG porque a API do Instagram só aceita JPEG; o PNG fica pra conferência
            f = out / f"slide_{i+1:02d}.jpg"
            el.screenshot(path=str(f), type="jpeg", quality=94)
            el.screenshot(path=str(out / f"slide_{i+1:02d}.png"))
            paths.append(f)
        b.close()
    for f in paths:
        print(f)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "social/out/carrossel")
