#!/usr/bin/env python3
"""
Storm Studio — reel: roteiro JSON -> MP4 1080x1920 (H.264 + AAC) pronto pra API.

  python3 social/reel/build.py social/reel/roteiro-exemplo.json social/out/reel.mp4

Cada cena vira um frame HTML (mesma identidade da landing) renderizado em
1080x1920 pelo Chromium; o ffmpeg junta tudo com zoom lento (Ken Burns),
corte cruzado e barra de progresso. Sem áudio por padrão: a trilha entra
depois, no app, ou via -a trilha.mp3 (áudio da biblioteca do Instagram NÃO
pode ser adicionado por API).
"""
import json, os, re, shutil, subprocess, sys, tempfile, pathlib, glob

ROOT = pathlib.Path(__file__).resolve().parents[1]
W, H, FPS = 1080, 1920, 30


def ffmpeg_bin():
    for c in (os.environ.get("FFMPEG_PATH"), shutil.which("ffmpeg")):
        if c:
            return c
    try:                                   # fallback: build estático do pip
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg não encontrado — `pip install imageio-ffmpeg` ou instale o ffmpeg.")


def chrome():
    for pat in (os.environ.get("CHROME_PATH"),
                "/opt/pw-browsers/chromium-*/chrome-linux/chrome",
                "/usr/bin/chromium", "/usr/bin/google-chrome"):
        if pat and (hit := sorted(glob.glob(pat))):
            return hit[-1]
    return None


CSS = """
:root{--bg:#05060a;--text:#e8eaf2;--dim:#9aa0b4;--cobre:#fb923c;--flash:#fff4e6;
  --fd:'Space Grotesk',system-ui,sans-serif;--fm:'JetBrains Mono',ui-monospace,monospace}
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;font-family:var(--fd)}
.frame{position:relative;width:1080px;height:1920px;overflow:hidden;color:var(--text);
  background:radial-gradient(ellipse 90% 50% at 25% 8%,rgba(180,83,9,.30),transparent 60%),
             radial-gradient(ellipse 80% 50% at 85% 95%,rgba(251,146,60,.16),transparent 60%),var(--bg);
  display:flex;flex-direction:column;justify-content:center;padding:150px 96px 260px}
.frame::after{content:"";position:absolute;inset:0;opacity:.5;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/><feColorMatrix type='saturate' values='0'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='.06'/></svg>")}
.kicker{position:absolute;top:150px;left:96px;font-family:var(--fm);font-size:26px;letter-spacing:.24em;
  text-transform:uppercase;color:var(--cobre);display:flex;align-items:center;gap:18px;z-index:2}
.kicker::before{content:"";width:52px;height:2px;background:var(--cobre)}
h1{font-size:104px;line-height:1.02;letter-spacing:-.035em;font-weight:700;z-index:2}
h1 em{font-style:normal;background:linear-gradient(100deg,#fff4e6,#fb923c 45%,#b45309 95%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
p{font-size:44px;line-height:1.42;color:var(--dim);margin-top:44px;max-width:20ch;z-index:2}
p strong{color:var(--text);font-weight:600}
.mark{position:absolute;bottom:150px;left:96px;font-family:var(--fm);font-size:26px;color:#868ea3;
  letter-spacing:.08em;z-index:2}
.bolt{position:absolute;top:-120px;right:-120px;width:560px;opacity:.10}
"""


def rich(t):
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    return re.sub(r"\[(.+?)\]", r"<em>\1</em>", t)


def render_frames(scenes, tmp):
    from playwright.sync_api import sync_playwright
    bolt = ('<svg class="bolt" viewBox="0 0 100 200">'
            '<path d="M62 0 18 108h30L34 200 88 78H56z" fill="#fb923c"/></svg>')
    frames = "".join(
        f'<div class="frame">{bolt}<div class="kicker">{rich(s.get("kicker","storm studio"))}</div>'
        f'<h1>{rich(s["title"])}</h1>'
        + (f'<p>{rich(s["text"])}</p>' if s.get("text") else "")
        + '<div class="mark">@stormstudio</div></div>' for s in scenes)
    html = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'>"
            "<link href='https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700"
            "&family=JetBrains+Mono:wght@400;500&display=swap' rel='stylesheet'>"
            f"<style>{CSS}</style></head><body>{frames}</body></html>")
    page_file = tmp / "frames.html"; page_file.write_text(html)
    out = []
    exe = chrome()
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
        pg = b.new_page(viewport={"width": W, "height": H})
        pg.goto(page_file.as_uri()); pg.wait_for_timeout(1200)
        for i, el in enumerate(pg.query_selector_all(".frame")):
            f = tmp / f"frame_{i:02d}.png"; el.screenshot(path=str(f)); out.append(f)
        b.close()
    return out


def build(roteiro, dest, audio=None):
    r = json.loads(pathlib.Path(roteiro).read_text())
    scenes = r["cenas"]
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="reel-"))
    frames = render_frames(scenes, tmp)
    ff = ffmpeg_bin()

    # 1 clipe por cena, com zoom lento (Ken Burns) e fade de entrada
    clips = []
    for i, (f, s) in enumerate(zip(frames, scenes)):
        dur = float(s.get("seg", 3))
        n = int(dur * FPS)
        c = tmp / f"clip_{i:02d}.mp4"
        zoom = "zoompan=z='min(zoom+0.0009,1.12)':d=%d:s=%dx%d:fps=%d" % (n, W, H, FPS)
        subprocess.run([ff, "-y", "-loop", "1", "-i", str(f), "-t", f"{dur}",
                        "-vf", f"{zoom},fade=t=in:st=0:d=0.35,format=yuv420p",
                        "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                        "-r", str(FPS), str(c)], check=True, capture_output=True)
        clips.append(c)

    lst = tmp / "list.txt"
    lst.write_text("".join(f"file '{c}'\n" for c in clips))
    total = sum(float(s.get("seg", 3)) for s in scenes)
    # barra de progresso cobre no rodapé — sinaliza "falta pouco" e segura o watch time
    bar = (f"drawbox=x=0:y={H-14}:w=iw:h=14:color=0x14161f@1:t=fill,"
           f"drawbox=x=0:y={H-14}:w='iw*t/{total}':h=14:color=0xfb923c@1:t=fill")
    cmd = [ff, "-y", "-f", "concat", "-safe", "0", "-i", str(lst)]
    if audio:
        cmd += ["-i", audio, "-shortest", "-c:a", "aac", "-b:a", "128k"]
    cmd += ["-vf", bar, "-c:v", "libx264", "-preset", "medium", "-crf", "20",
            "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.1",
            "-movflags", "+faststart", str(dest)]          # faststart: moov no início
    subprocess.run(cmd, check=True, capture_output=True)
    shutil.rmtree(tmp, ignore_errors=True)
    return dest


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    aud = sys.argv[sys.argv.index("-a") + 1] if "-a" in sys.argv else None
    dest = pathlib.Path(args[1] if len(args) > 1 else "social/out/reel.mp4").resolve()
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(build(args[0], dest, aud))
