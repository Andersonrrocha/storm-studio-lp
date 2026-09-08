"""Telas reais dos produtos e páginas do Storm (para os carrosséis 'sobre nós / o que fazemos')."""
import pathlib
from playwright.sync_api import sync_playwright
OUT=pathlib.Path("social/out/shots"); OUT.mkdir(parents=True,exist_ok=True)
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
def hide_fixed(pg):
    pg.evaluate("""()=>{for(const e of document.querySelectorAll('body *')){const cs=getComputedStyle(e);if(cs.position==='fixed'||cs.position==='sticky')e.style.setProperty('display','none','important')}}""")
def sect(pg,name,text,full=False):
    try:
        loc=pg.locator(f"section:has-text('{text}')").first; loc.wait_for(timeout=5000); loc.scroll_into_view_if_needed(); pg.wait_for_timeout(900)
        loc.screenshot(path=str(OUT/f"{name}.png")); print("ok",name)
    except Exception as e: print("skip",name,str(e).splitlines()[0][:70])
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME)
    # stormstudio.dev — seções (desktop), motion desligado para captura estável
    c=b.new_context(viewport={"width":1440,"height":900},device_scale_factor=2,reduced_motion="reduce")
    pg=c.new_page(); pg.goto("https://stormstudio.dev",wait_until="networkidle"); pg.wait_for_timeout(2500)
    for name,text in (("ss-servicos","O que sai do laboratório"),("ss-sinais","O que já ganhou vida real"),("ss-lab","laboratório independente"),("ss-processo","Do esboço ao deploy"),("ss-contato","Vamos construir algo grande")):
        sect(pg,name,text)
    pg.screenshot(path=str(OUT/"ss-desktop-full.png"),full_page=True); c.close()
    # stormstudio.dev mobile — full
    c=b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,is_mobile=True,reduced_motion="reduce")
    pg=c.new_page(); pg.goto("https://stormstudio.dev",wait_until="networkidle"); pg.wait_for_timeout(2500)
    hide_fixed(pg); pg.screenshot(path=str(OUT/"ss-mobile-full.png"),full_page=True); print("ok ss-mobile-full"); c.close()
    # Horine — página pública + login (o que der sem credencial)
    for name,vp,mob in (("horine-desktop",{"width":1440,"height":900},False),("horine-mobile",{"width":390,"height":844},True)):
        c=b.new_context(viewport=vp,device_scale_factor=2,is_mobile=mob)
        pg=c.new_page()
        try:
            pg.goto("https://horine.stormstudio.dev",wait_until="networkidle",timeout=45000); pg.wait_for_timeout(2500)
            pg.screenshot(path=str(OUT/f"{name}.png")); pg.screenshot(path=str(OUT/f"{name}-full.png"),full_page=True); print("ok",name,pg.url,pg.title()[:60])
        except Exception as e: print("fail",name,str(e)[:80])
        c.close()
    # portfólio andersonrocha.dev
    c=b.new_context(viewport={"width":1440,"height":900},device_scale_factor=2,reduced_motion="reduce")
    pg=c.new_page(); pg.goto("https://andersonrocha.dev/pt",wait_until="networkidle"); pg.wait_for_timeout(3000)
    pg.screenshot(path=str(OUT/"portfolio-desktop.png")); pg.screenshot(path=str(OUT/"portfolio-desktop-full.png"),full_page=True); print("ok portfolio",pg.url); c.close()
    b.close()
