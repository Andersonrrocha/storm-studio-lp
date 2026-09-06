# social/ — motor de conteúdo do Instagram

Pipeline para gerar **carrosséis** e **reels** na identidade do Storm Studio e publicar
pela Graph API. A pesquisa completa (algoritmo, limites da API, ferramentas comparadas,
plano editorial) está em **[PESQUISA-INSTAGRAM.md](./PESQUISA-INSTAGRAM.md)**.

```
social/
├── PESQUISA-INSTAGRAM.md   pesquisa + estratégia + fontes
├── carousel/
│   ├── template.html       CSS dos slides (mesmos tokens da landing)
│   ├── render.py           deck JSON  → slides 1080x1350 (.jpg + .png)
│   └── deck-exemplo.json
├── reel/
│   ├── build.py            roteiro JSON → MP4 1080x1920 H.264
│   ├── capture_site.py     scroll de um site → MP4 1080x1920 ("site reveal")
│   └── roteiro-exemplo.json
├── publish.py              Graph API: carrossel / reel / foto / cota
└── out/                    saídas (fora do git)
```

## Instalar

```bash
pip install playwright imageio-ffmpeg
# se não houver Chromium no sistema: playwright install chromium
```

`render.py`, `build.py` e `capture_site.py` procuram o Chromium em `CHROME_PATH`,
`/opt/pw-browsers/chromium-*`, `/usr/bin/chromium`. O ffmpeg vem de `FFMPEG_PATH`, do
PATH ou do `imageio-ffmpeg` (build estático com libx264/aac).

## Usar

```bash
# carrossel (máx. 10 slides — limite da API)
python3 social/carousel/render.py social/carousel/deck-exemplo.json social/out/carrossel

# reel de texto
python3 social/reel/build.py social/reel/roteiro-exemplo.json social/out/reel.mp4
python3 social/reel/build.py roteiro.json out.mp4 -a trilha.mp3   # com áudio próprio

# reel de "site reveal"
python3 social/reel/capture_site.py https://site-do-cliente.com social/out/reveal.mp4 --seg 8

# publicar (mídia precisa estar numa URL pública)
export IG_USER_ID=... IG_ACCESS_TOKEN=...
python3 social/publish.py carrossel https://cdn/.../slide_01.jpg ... --legenda-de deck.json
python3 social/publish.py reel https://cdn/.../reel.mp4 --legenda "..." 
python3 social/publish.py cota            # quanto resta da janela de 24h
```

`--seco` mostra o payload sem publicar.

## Formato dos arquivos de entrada

**Deck de carrossel** — `type`: `cover` | `point` | `code` | `cta`.
`**negrito**` vira destaque; `[texto]` vira gradiente cobre.

```json
{ "legenda": "vai como caption do post",
  "slides": [
    {"type": "cover", "kicker": "checklist", "title": "5 coisas que [travam] o site"},
    {"type": "point", "kicker": "01 · performance", "title": "...", "text": "..."},
    {"type": "code",  "title": "...", "code": ["antes → ...", "depois → **...**"]},
    {"type": "cta",   "title": "...", "cta": "manda \"SITE\" no direct"}]}
```

**Roteiro de reel** — `seg` é a duração da cena. Total útil: 15-30s.

```json
{ "legenda": "...",
  "cenas": [{"kicker": "3 segundos", "title": "gancho aqui", "text": "...", "seg": 2.6}]}
```

## Limites da API que o pipeline já respeita

- carrossel: **máximo 10** mídias; imagem em **JPEG**; todas cortadas pelo aspecto da primeira;
- reel: 9:16, H.264, `yuv420p`, `+faststart` (moov no início), 5-90s pela API;
- mídia servida em **URL pública** (GitHub Pages, Cloudflare R2, Cloudinary);
- **não dá** para usar áudio da biblioteca do Instagram por API — a trilha vem no arquivo;
- a API **não agenda**: o agendamento é seu (cron / GitHub Actions) ou de terceiros.
