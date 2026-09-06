#!/usr/bin/env python3
"""
Storm Studio — reel de "site reveal": grava o scroll de um site em 1080x1920.

  python3 social/reel/capture_site.py http://localhost:4173 social/out/site.mp4 --seg 8

Em vez de gravar vídeo (que sai borrado no tamanho do viewport), captura N
screenshots em retina (device_scale_factor=2) rolando a página com easing e
monta o MP4 no ffmpeg. Saída crocante em 1080x1920, H.264, faststart.
"""
import argparse, glob, math, os, pathlib, shutil, subprocess, sys, tempfile

W, H, FPS = 1080, 1920, 30


def ffmpeg_bin():
    for c in (os.environ.get("FFMPEG_PATH"), shutil.which("ffmpeg")):
        if c:
            return c
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def chrome():
    for pat in (os.environ.get("CHROME_PATH"),
                "/opt/pw-browsers/chromium-*/chrome-linux/chrome",
                "/usr/bin/chromium", "/usr/bin/google-chrome"):
        if pat and (hit := sorted(glob.glob(pat))):
            return hit[-1]
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url"); ap.add_argument("dest", nargs="?", default="social/out/site.mp4")
    ap.add_argument("--seg", type=float, default=8.0, help="duração em segundos")
    ap.add_argument("--espera", type=float, default=2.5, help="segundos parados no topo antes de rolar")
    a = ap.parse_args()

    from playwright.sync_api import sync_playwright
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="capture-"))
    n = int(a.seg * FPS)
    hold = int(a.espera * FPS)
    exe = chrome()
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
        pg = b.new_page(viewport={"width": W // 2, "height": H // 2}, device_scale_factor=2)
        pg.goto(a.url, wait_until="networkidle")
        pg.wait_for_timeout(1500)
        total = pg.evaluate("document.body.scrollHeight - window.innerHeight")
        for i in range(n):
            if i >= hold:
                t = (i - hold) / max(1, n - hold - 1)
                eased = 0.5 - 0.5 * math.cos(math.pi * t)      # ease-in-out
                pg.evaluate(f"window.scrollTo(0, {total} * {eased})")
                pg.wait_for_timeout(16)
            pg.screenshot(path=str(tmp / f"f_{i:05d}.png"))
        b.close()

    dest = pathlib.Path(a.dest).resolve(); dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([ffmpeg_bin(), "-y", "-framerate", str(FPS), "-i", str(tmp / "f_%05d.png"),
                    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
                    "-profile:v", "high", "-level", "4.1", "-movflags", "+faststart", str(dest)],
                   check=True, capture_output=True)
    shutil.rmtree(tmp, ignore_errors=True)
    print(dest)


if __name__ == "__main__":
    main()
