# ⚡ Storm Studio — Landing Page (v2)

Landing page do **Storm Studio**, estúdio de engenharia criativa de Anderson Rocha — sites, apps, ferramentas de IA e agents autônomos.

**Live:** https://andersonrrocha.github.io/storm-studio-lp/

## Conceito da v2 — *scroll cinematográfico*

A página é um único filme contínuo dirigido pela roda do mouse. A tempestade vive atrás de **toda** a página e reage à velocidade do scroll; as seções entram com pin/scrub; cada beat encadeia no próximo sem cortes.

## Stack

HTML + CSS + JavaScript, sem build step. O motion é potencializado por libs leves via CDN (sem bundler):

- [GSAP](https://gsap.com/) + **ScrollTrigger** — timeline, pin e scrub dirigidos pelo scroll
- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scroll sincronizado com o ticker do GSAP

> Progressive enhancement: sem JS, ou com `prefers-reduced-motion`, as libs não assumem o controle e todo o conteúdo aparece estático e legível.

## Destaques

- 🌩️ **Storm global reativo**: canvas fixo de partículas + raios procedurais atrás da página inteira. A *carga* da tempestade sobe com a velocidade do scroll — mais raios, partículas viram riscos, o brilho da UI pulsa. Clique no hero para invocar um raio.
- ⚡ **Intro com raio**: um bolt SVG rasga a tela no primeiro load.
- 🎬 **Hero camera-push**: ao rolar, o conteúdo do hero escala, desfoca e some — a câmera "entra" na tempestade.
- 📜 **Manifesto pinado**: a seção trava e as palavras acendem (de borradas a nítidas) conforme o scroll; no clímax, uma descarga corta o storm.
- 🧱 **Serviços sticky**: o título fica fixo enquanto a lista revela item a item, com uma *spine* elétrica que se desenha na lateral.
- 🃏 **Cards 3D**: entram da profundidade (rotateX + scale) e respondem ao cursor com tilt + glare.
- 🔌 **Processo pinado**: o circuito SVG é desenhado pelo scroll, um pulso luminoso percorre o traçado e cada etapa acende em sequência.
- 🌀 **Marquee por velocidade**: duas faixas opostas cuja velocidade/direção é modulada pela inércia do scroll.
- 🌒 **Dark storm-tech**: paleta near-black com acentos elétricos (ciano + violeta), grain de ruído, glow seguindo o cursor.
- ♿ Respeita `prefers-reduced-motion` — animações desligam, conteúdo permanece.

## Rodar localmente

```bash
npx serve .
# ou: python3 -m http.server 4555  →  http://localhost:4555
```

## Estrutura

```
index.html   — markup + CDNs (GSAP/ScrollTrigger/Lenis) + progressive enhancement
styles.css   — identidade visual, estados de motion (gated por html.motion), responsivo, reduced-motion
script.js    — StormField (canvas), integração Lenis+GSAP, coreografia de scroll, fallbacks
```
