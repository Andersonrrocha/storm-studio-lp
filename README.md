# ⚡ Storm Studio — Landing Page

Landing page da **Storm Studio**, estúdio de engenharia criativa de Anderson Rocha — sites, pequenos sistemas, ferramentas de IA e agentes, sob medida.

**Live:** https://stormstudio.dev/ · (origem: https://andersonrrocha.github.io/storm-studio-lp/)

## Stack

HTML + CSS + JavaScript puros — zero dependências, zero build step. Feito para o GitHub Pages.

## Destaques

- ⚡ **Tempestade procedural em canvas**: partículas com deriva, raios gerados proceduralmente com ramificações e flash — clique no fundo do hero para invocar um raio.
- 🖥️ **Hero em 2 colunas**: copy à esquerda + terminal de build animado à direita.
- 🔌 **Timeline de processo scroll-driven**: trilho em gradiente com faísca que persegue o scroll (horizontal no desktop, vertical no mobile).
- 🌀 **Coreografia de scroll**: headings com clip-reveal, serviços deslizando da esquerda, cards com zoom, orbs com parallax e hero com fade-out.
- 📝 **Formulário de briefing** que monta um `mailto:` (sem backend).
- 🌒 **Dark storm-tech**: near-black com acentos ciano + violeta, grain de ruído, glow seguindo o cursor.
- ♿ Respeita `prefers-reduced-motion` — animações desligam, conteúdo permanece.

## Rodar localmente

```bash
npx serve .
# ou simplesmente abrir index.html no navegador
```

## Domínio (stormstudio.dev)

O arquivo `CNAME` aponta o GitHub Pages para `stormstudio.dev`. Para o domínio funcionar, configure no registrador:

**Apex (`stormstudio.dev`) — 4 registros A:**

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**`www` — 1 registro CNAME:** `andersonrrocha.github.io.`

`.dev` exige HTTPS (HSTS): o GitHub provisiona o certificado automaticamente após a propagação do DNS. Depois disso, ative "Enforce HTTPS" nas configurações de Pages.

## Conteúdo pendente

- **Depoimento** (seção Prova): texto/autor são placeholder — trocar pelo caso real.
- **WhatsApp**: links usam `https://wa.me/5500000000000` (placeholder) — trocar pelo número real.
