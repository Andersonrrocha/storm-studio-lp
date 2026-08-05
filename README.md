# ⚡ Storm Studio — Landing Page (v2)

<!-- atlas:início -->
<!-- gerado a partir de storm-atlas/projects/storm-studio-lp.md — não editar à mão -->

> A landing do estúdio como um filme contínuo dirigido pela roda do rato, com uma tempestade que reage à velocidade do scroll.

## O que é

A landing page do **Storm Studio**, o estúdio de engenharia criativa do Anderson. A v2 abandona a
página que se lê por secções e passa a um único filme contínuo: uma tempestade em canvas vive atrás
de toda a página e a sua carga sobe com a velocidade do scroll — mais raios, as partículas esticam-se
em riscos, o brilho da interface pulsa. Cada momento encadeia no seguinte sem cortes.

## Por que existe

Um estúdio que vende "engenharia criativa" não pode provar isso com um template. A landing é ela
própria a amostra do produto: quem chega tem de sentir a competência técnica antes de ler uma única
alegação sobre ela. Por isso o motion não é decoração — é o argumento de venda.

## O que faz

- **Tempestade global reativa** — canvas fixo de partículas e raios procedurais atrás da página
  inteira; a carga responde à velocidade do scroll; clicar no hero invoca um raio
- **Intro com raio** — um bolt em SVG rasga o ecrã no primeiro carregamento
- **Hero com camera-push** — ao rolar, o conteúdo escala, desfoca e desaparece: a câmara entra na tempestade
- **Manifesto pinado** — a secção trava e as palavras acendem de borradas a nítidas conforme o scroll;
  no clímax uma descarga corta a tempestade
- **Serviços sticky** — o título fica fixo enquanto a lista se revela item a item, com uma espinha
  elétrica a desenhar-se na lateral
- **Cards 3D** — entram da profundidade com `rotateX` e escala, e respondem ao cursor com tilt e glare
- **Processo pinado** — o circuito em SVG é desenhado pelo scroll, um pulso luminoso percorre o traçado
  e cada etapa acende em sequência
- **Marquee por velocidade** — duas faixas opostas cuja direção e velocidade seguem a inércia do scroll
- **Prova de produto** e depoimento real (Beto Chaves), com WhatsApp de mensagem pré-preenchida
- **Formulário de contacto** e navegação mobile

## Como funciona

- HTML, CSS e JavaScript sem build step e sem bundler; as libs de motion entram por CDN
- GSAP com ScrollTrigger para timeline, pin e scrub dirigidos pelo scroll; Lenis para smooth scroll,
  sincronizado com o ticker do GSAP para os dois não competirem pelo mesmo frame
- **Progressive enhancement a sério:** sem JavaScript, ou com `prefers-reduced-motion`, as libs não
  assumem o controlo e todo o conteúdo aparece estático e legível. Os estados de motion estão todos
  por trás de `html.motion`
- Três ficheiros: `index.html` (markup e CDNs), `styles.css` (identidade e estados de motion),
  `script.js` (o campo de tempestade em canvas, a integração Lenis+GSAP e a coreografia)
- Deploy por GitHub Actions para Pages — o build legacy do Jekyll estava partido e foi contornado
  com `.nojekyll` e upload direto do artefacto

## Estado atual

No ar em `stormstudio.dev`, concluída. Passou por uma crítica de acessibilidade e UX (`/impeccable`)
cujas correções estão aplicadas: formulário, contraste, motion e navegação mobile. O último commit
(2026-07-20) corrige a âncora do scrub da secção de processo. Não há trabalho pendente conhecido.

<!-- atlas:fim -->

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
