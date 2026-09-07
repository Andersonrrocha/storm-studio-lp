"""Captura telas reais dos sites no ar para as peças do Instagram (material real, não mock)."""
import sys, pathlib
from playwright.sync_api import sync_playwright
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "social/out/shots"); OUT.mkdir(parents=True, exist_ok=True)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

def shot(page, name, **kw):
    page.screenshot(path=str(OUT / f"{name}.png"), **kw); print("ok", name)

def el_shot(page, name, selector_or_text):
    try:
        loc = page.locator(selector_or_text).first
        loc.wait_for(timeout=4000); loc.scroll_into_view_if_needed(); page.wait_for_timeout(700)
        loc.screenshot(path=str(OUT / f"{name}.png")); print("ok", name)
    except Exception as e:
        print("skip", name, str(e).splitlines()[0][:80])

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME)
    # --- Beto Chaves, mobile ---
    m = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True,
                      user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
    pg = m.new_page(); pg.goto("https://betochaves.com.br", wait_until="networkidle"); pg.wait_for_timeout(1500)
    shot(pg, "bc-mobile-hero")
    shot(pg, "bc-mobile-full", full_page=True)
    el_shot(pg, "bc-mobile-services", "section:has-text('Chave automotiva')")
    el_shot(pg, "bc-mobile-cities", "*:has-text('Sapucaia do Sul') >> nth=-1")
    pg.evaluate("window.scrollTo(0, document.body.scrollHeight*0.55)"); pg.wait_for_timeout(1200)
    shot(pg, "bc-mobile-wa")
    el_shot(pg, "bc-mobile-reviews", "section:has-text('Google')")
    m.close()
    # --- Beto Chaves, desktop ---
    d = b.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
    pg = d.new_page(); pg.goto("https://betochaves.com.br", wait_until="networkidle"); pg.wait_for_timeout(1500)
    shot(pg, "bc-desktop-hero")
    el_shot(pg, "bc-desktop-services", "section:has-text('Chave automotiva')")
    el_shot(pg, "bc-desktop-cities", "*:has-text('Sapucaia do Sul') >> nth=-1")
    shot(pg, "bc-desktop-full", full_page=True)
    d.close()
    # --- Storm Studio ---
    d = b.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
    pg = d.new_page(); pg.goto("https://stormstudio.dev", wait_until="networkidle"); pg.wait_for_timeout(3500)
    shot(pg, "ss-desktop-hero")
    pg.mouse.wheel(0, 900); pg.wait_for_timeout(1500); shot(pg, "ss-desktop-scroll1")
    d.close()
    m = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True)
    pg = m.new_page(); pg.goto("https://stormstudio.dev", wait_until="networkidle"); pg.wait_for_timeout(3500)
    shot(pg, "ss-mobile-hero"); m.close()
    b.close()
