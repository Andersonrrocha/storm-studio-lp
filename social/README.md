# social/ — sistema de conteúdo do Storm Studio

Estratégia, padrão de qualidade e ferramentas: **[PESQUISA-INSTAGRAM.md](./PESQUISA-INSTAGRAM.md)**.
Quem faz conteúdo bom no nicho e o que os números reais mostram: **[BENCHMARK.md](./BENCHMARK.md)**.
Como a conta é publicada (browser control, warm-up, fila): **[browser/PUBLICACAO.md](./browser/PUBLICACAO.md)**.

```
social/
├── PESQUISA-INSTAGRAM.md   pesquisa v2 — diagnóstico, stack premium, plano de 30 dias
├── browser/
│   ├── PUBLICACAO.md       protocolo de publicação por navegador + warm-up da conta
│   ├── fila.json           o que está pronto para publicar
│   ├── teardown.json       fila de reels para dissecar (v2, com views reais)
│   └── raw/                views por reel e ganchos de 16 contas, lidos no Instagram logado
├── carousel/               camada base: sistema de slides na marca (JSON → 1080x1350)
├── reel/                   captura de tela e montagem de apoio (não é a peça principal)
├── publish_api.py          plano B via Graph API — fora do caminho escolhido
└── out/                    saídas (fora do git)
```

## Onde cada camada entra

| Camada | Ferramenta | Papel |
|---|---|---|
| **Peça principal de vídeo** | **Figma Motion** (+ shaders, `export_video` via MCP), Cavalry | Tipografia cinética e identidade em movimento. É o que tira o conteúdo do patamar de template |
| **Produto em movimento** | Screen Studio / FocuSee | Captura tratada do site do cliente — o formato que mais converte |
| **B-roll de abertura** | Higgsfield (Kling 3.0 / Veo 3.1 / Seedance 2.0), fal.ai | 3-5s cinematográficos antes do produto real entrar |
| **Carrossel** | `carousel/render.py` deste repo | Grid e tokens da marca, exatos e versionados, em escala. **Sempre com tela/foto real dentro** |
| **Apoio** | `reel/capture_site.py`, `reel/build.py` | Captura determinística e montagens de serviço |
| **Legenda/finalização** | Submagic, ffmpeg | Legenda queimada obrigatória |
| **Publicação** | browser do Claude Code / Claude in Chrome | Ver `browser/PUBLICACAO.md` |

> `reel/build.py` gera cartela animada com zoom e fade. Serve para peça de serviço e
> teste de copy — **não** é o padrão de qualidade da conta. Peça principal se monta em
> Figma Motion ou Cavalry, com material real dentro.

## Rodar a camada base

```bash
pip install playwright imageio-ffmpeg      # o Chromium do sistema é reaproveitado

python3 social/carousel/render.py social/carousel/deck-exemplo.json social/out/carrossel
python3 social/reel/capture_site.py https://site-do-cliente.com social/out/reveal.mp4 --seg 8
python3 social/reel/build.py social/reel/roteiro-exemplo.json social/out/reel.mp4 -a trilha.mp3
```

Saída: slides `1080x1350` em `.jpg` + `.png`, vídeo `1080x1920 H.264 yuv420p +faststart`.

**Deck de carrossel** — `type`: `cover` | `point` | `code` | `cta`; `**negrito**` destaca,
`[texto]` aplica o gradiente cobre. **Roteiro de reel** — `cenas[]` com `seg` por cena.

## Checklist antes de qualquer publicação

1. Tem material real (tela, código, mão, lugar) — não só texto sobre fundo.
2. A afirmação é do Storm, não genérica.
3. Movimento com easing próprio, stagger, overshoot.
4. Primeiro frame legível a 270px de largura.
5. Existe motivo para ser enviado no direct.
6. Passou em `brand-voice` e `design-critique`.
7. Trilha licenciada (Artlist/Epidemic) e pelo menos um efeito no corte-chave.
8. Tem imperfeição humana.
