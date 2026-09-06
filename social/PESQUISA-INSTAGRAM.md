# Motor de conteúdo do Instagram — Storm Studio

Pesquisa + protótipo funcional. Objetivo: descobrir **o que dá pra plugar hoje** para
que o Claude gere reels e carrosséis na identidade do Storm Studio, publique sozinho e
meça o resultado — sem virar conteúdo genérico de IA.

Data da pesquisa: **setembro de 2026**. Tudo que é regra de plataforma tem fonte no fim.

---

## 0. Resposta curta

**Dá pra automatizar 80% do ciclo com custo ~zero.** O gargalo não é ferramenta, é
matéria-prima: só você tem os bastidores (Beto Chaves, Clínica da Fé, os projetos do Lab).

Stack recomendada, em ordem de implantação:

| Fase | O que | Custo | Bloqueio |
|---|---|---|---|
| **0. Agora** | Conta profissional + bio com SEO + pipeline de arte deste repo | R$ 0 | nenhum |
| **1. Semana 1** | Conectar **Metricool MCP** no Claude (agenda + analytics + melhor horário) | R$ 0 (plano free) | nenhum |
| **2. Semana 2-3** | App Meta em **modo desenvolvimento** publicando na sua própria conta via API + cron no GitHub Actions | R$ 0 | conta profissional + token |
| **3. Quando virar serviço** | App Review da Meta (2-4 semanas) **ou** Blotato/Ayrshare para postar na conta dos clientes | US$ 29-149/mês | App Review |

O achado que muda o jogo: **para publicar só na sua própria conta você NÃO precisa de
App Review.** Basta o app da Meta em *Development mode* com sua conta no papel de
*Instagram Tester*. O review só existe quando contas de terceiros conectam no seu app —
ou seja, só quando isso virar produto para a Clínica da Fé e outros clientes.

---

## 1. Como o Instagram distribui conteúdo hoje (2026)

### Os sinais que realmente pesam
Mosseri repete três: **watch time**, **sends per reach** (compartilhamento no direct por
alcance) e **likes per reach**. Um *send* pesa de 3 a 5 vezes mais que um like.
Desde a atualização de março/2026, **responder comentário e DM rápido também é sinal
rankeado** — conversa de mão dupla entra na conta.

Consequência prática para o Storm: escreva para ser **enviado no direct** ("manda isso
pro teu sócio"), não para ser curtido. Todo post precisa de um motivo pra ser repassado.

### Reels vs carrossel — não é escolha, é função
- **Reels = alcance frio.** ~4,7x mais alcance por post; é o único formato que entrega
  para quem não te segue de forma consistente.
- **Carrossel = profundidade e save.** ~2,3x mais saves; melhor engajamento por seguidor
  (0,50% vs 0,48% no Q2/2026). Em contas de 10k-50k o Reels ainda ganha em alcance
  mediano; de 50k pra cima o carrossel vira o formato mais forte.
- Regra do estúdio: **Reels puxa gente nova, carrossel converte quem chegou.**

### Números que definem a cadência
- **3 a 5 reels/semana** de qualidade batem postar todo dia coisa fraca — o algoritmo
  premia watch time, não frequência.
- **Conteúdo original recebe 40-60% mais distribuição.** 10+ reposts em 30 dias tiram a
  conta das recomendações. (Isso mata a ideia de "encher a página com IA genérica".)
- **Reels acima de 3 minutos param de ser empurrados para não-seguidores.** Faixa útil:
  **15-30s** para alcance; até 60-90s quando o assunto justifica.

### Hashtag morreu, busca nasceu
Posts que dependem de hashtag veem ~32% menos views. O que rankeia agora é **texto
pesquisável**: nome de exibição, bio, **primeiras linhas da legenda**, alt-text e o que
está falado/escrito dentro do vídeo. 3-5 hashtags relevantes, mais nada.
Para o Storm isso significa nome de exibição do tipo `Storm Studio · sites e apps sob medida`
e legendas que comecem com os termos que um dono de PME digita ("site para clínica",
"site que abre rápido", "sistema sob medida").

### Duas alavancas grátis que quase ninguém usa
1. **Trial Reels** — publica só para **não-seguidores**, dá insight em 24h e não suja o
   feed. Disponível para contas públicas com 1.000+ seguidores; desde fev/2026 dá pra
   agendar. É o ambiente perfeito para testar ganchos em lote antes de queimar audiência.
2. **Comment-to-DM** (ManyChat e similares) — "comenta SITE que eu te mando o checklist".
   Regras de 2026: o disparo tem que vir de uma ação do usuário, resposta em até 30s,
   janela de 24h e **um DM automático por usuário a cada 24h**.

---

## 2. O caminho técnico da publicação (Instagram Graph API)

### Qual API
Duas portas de entrada:
- **Instagram API com Instagram Login** — autentica direto no Instagram, **não exige
  página do Facebook vinculada**. É a mais simples para conta única. ✅ recomendada aqui.
- **Instagram API com Facebook Login** — exige Página do Facebook; é o caminho de quem
  gerencia várias contas de clientes dentro do ecossistema Meta.

Requisitos comuns: conta **Professional** (Business ou Creator), app na Meta e a permissão
`instagram_business_content_publish` (substituiu `instagram_content_publish`, depreciada
em 27/01/2025).

### O atalho: modo desenvolvimento
Enquanto o app publica **só na sua conta**, ele fica em *Development mode* e sua conta
entra como **Instagram Tester**. Nesse arranjo **não há App Review**. O review (2-4
semanas por submissão, com screencast do fluxo completo — a maioria das recusas de 2026 é
screencast incompleto) só é obrigatório quando terceiros conectam a conta deles.

### O fluxo (idêntico para foto, carrossel e reels)
```
POST /{ig-user-id}/media           → cria o container (image_url | video_url, caption…)
GET  /{container-id}?fields=status_code → repete até FINISHED
POST /{ig-user-id}/media_publish   → creation_id  →  post no ar
```
Carrossel: um container **por slide** com `is_carousel_item=true`, depois um container
pai `media_type=CAROUSEL` com a lista de `children`, depois publica.

### As pegadinhas que custam tempo (todas confirmadas)
| Pegadinha | O que significa na prática |
|---|---|
| A mídia precisa estar em **URL pública** | O Instagram faz cURL no arquivo na hora de publicar. Precisa de hospedagem: GitHub Pages deste repo, Cloudflare R2 (10 GB grátis, egress zero) ou Cloudinary. |
| **JPEG apenas** para imagem | PNG e HEIC são rejeitados — converter antes. URL só com ASCII. |
| **Carrossel = máximo 10 mídias pela API** | Os 20 slides de 2024 valem só dentro do app. Nenhuma ferramenta contorna isso. |
| Todas as imagens são cortadas pelo **aspecto da primeira** | Renderize o deck inteiro em 4:5 (1080x1350). |
| **Áudio da biblioteca do Instagram é impossível por API** | Nada de trending audio programático. Ou a trilha vem embutida no MP4 (licenciada), ou você publica manual/rascunho e adiciona o som no app. |
| Reels por API: 9:16, H.264/HEVC, **5-90s** | No app dá pra ir a 15 min (e 20 em alguns perfis), mas a API é conservadora — e reels >3 min não vão pra não-seguidores mesmo. |
| **A API não agenda** | Publicação é imediata. O agendador é seu (cron/GitHub Actions) ou de terceiros (Metricool/Buffer). |
| Limite de publicação | ~100 posts por janela de 24h (carrossel conta como 1). Dá pra consultar em `GET /{ig-user-id}/content_publishing_limit`. |
| Insights | `views`, `reach`, `saves`, `shares`, `total_interactions`, `follows_and_unfollows`, `profile_links_taps`. Depreciados na v21: `impressions`, `profile_views`, `website_clicks`, `video_views`. Parte das métricas agregadas/demográficas só aparece com 1.000+ seguidores. |

---

## 3. As camadas do motor e o que plugar em cada uma

```
 ideia ─▶ roteiro ─▶ arte ─▶ render ─▶ publicação ─▶ métrica ─▶ (volta pra ideia)
```

### Camada 1 — Backlog e calendário → **Notion** (já conectado)
Um banco `Conteúdo` com: pilar, formato, gancho, status, data, link do post, métricas.
O Claude lê e escreve nisso direto pelo MCP do Notion. É a memória do que já foi dito —
é o que evita repetir gancho e permite "faz o carrossel da ideia #14".

### Camada 2 — Roteiro e copy → **Claude + skills**
- `content-engine` (já disponível nesta sessão): sistemas de conteúdo por plataforma.
- Skills abertas que valem instalar: [`sergebulaev/instagram-skills`](https://github.com/sergebulaev/instagram-skills)
  (legendas, ganchos, plano semanal), [`moboutrig/instagram-claude-skill`](https://github.com/moboutrig/instagram-claude-skill)
  (publicação via Graph API), gerador de legenda de [`rediumvex`](https://github.com/rediumvex/social-media-caption-generator-claude).
- O diferencial não está na skill: está em alimentar o Claude com **transcrição das suas
  conversas com cliente, os commits reais e os antes/depois**. Skill boa + input genérico = slop.

### Camada 3 — Arte (carrossel) → **HTML → PNG, aqui no repo** ✅ implementado
Renderizador próprio: o deck é JSON, o layout usa as mesmas variáveis da landing
(near-black + cobre `#fb923c`/`#b45309`, Space Grotesk + JetBrains Mono), Chromium
fotografa cada slide em `device_scale_factor=2` → PNG **1080x1350** exato.
Custo zero, 100% na marca, versionado em git, e o Claude edita o JSON.

Complementos possíveis:
- **Figma MCP** (já conectado) — manter o design system dos slides e gerar variações.
- **Canva MCP** (no diretório, não instalado) — autofill de template, útil se você quiser
  editar no celular depois.
- **Nano Banana Pro / Gemini 3 Pro Image** — imagem de fundo e composição com texto
  legível, ~US$ 0,134 por imagem 2K. Bom para fundo abstrato de tempestade sob medida.

### Camada 4 — Vídeo (reels)
Três receitas, da mais barata à mais cara:

1. **Reel de texto** (implementado) — cenas em HTML → frames 1080x1920 → ffmpeg com zoom
   lento, fade e barra de progresso cobre. Serve para gancho + argumento + CTA. R$ 0.
2. **Site reveal** (implementado) — o Chromium abre o site do cliente, rola com easing e
   cada frame é capturado em retina; vira um MP4 crocante do scroll. **É o formato mais
   forte que o Storm tem**: mostra o produto se movendo, é 100% original e ninguém copia.
3. **Motion pesado / IA** — [Remotion](https://www.remotion.dev) (React → MP4, escala em
   Lambda) quando quiser animação com timeline de verdade; **Veo 3.1** (US$ 0,15/s no
   Fast, US$ 0,75/s no Standard com áudio) para B-roll gerado. ⚠️ **Sora 2 sai do ar em
   24/09/2026** — não construa em cima dele.
4. **Voz e legenda** — ElevenLabs em PT-BR (US$ 0,05-0,10 por 1.000 caracteres; 10k
   grátis/mês) + Whisper para gerar SRT e ffmpeg para queimar a legenda no vídeo.
   Legenda queimada é obrigatória: quase todo mundo assiste sem som.

### Camada 5 — Publicação
| Caminho | Custo | Quando usar |
|---|---|---|
| **API própria em dev mode + GitHub Actions** | R$ 0 | Sua conta. Controle total, sem intermediário. ✅ meta da Fase 2 |
| **Metricool MCP** | free | Agendar e ler analytics direto do Claude sem app review; tem "melhor horário para postar". ✅ ponte imediata |
| **Buffer MCP** | free em todos os planos (lançado 27/05/2026) | Alternativa ao Metricool, API GraphQL pública |
| **Postiz** | open source, self-host | Se quiser tudo dentro da sua infra, 30+ plataformas |
| **Blotato** | US$ 29/mês flat | MCP hospedado, várias contas sem cobrar por perfil |
| **Upload-Post** | US$ 16-24/mês (free: 10 uploads/mês) | Skill pronta de Claude Code, barato pra começar |
| **Ayrshare** | US$ 149/mês (1 perfil) | Só faz sentido em escala com muitos clientes |

Regra: **enquanto for só a sua conta, não pague nada.** Terceirizar só quando publicar na
conta dos clientes virar parte do serviço — aí a conta fecha porque você cobra por isso.

### Camada 6 — Métrica → Insights API → Notion
Puxar `views/reach/saves/shares` de cada post e gravar na linha do Notion. Depois de ~20
posts dá pra perguntar ao Claude "quais ganchos ficaram no topo do quartil de sends?" e
deixar o próximo lote ser escrito a partir do que funcionou. É aqui que o motor deixa de
ser publicador e vira sistema que aprende.

---

## 4. O que já está funcionando neste repo

```bash
pip install playwright imageio-ffmpeg     # o Chromium do container já serve

# carrossel: JSON -> 6 PNGs 1080x1350
python3 social/carousel/render.py social/carousel/deck-exemplo.json social/out/carrossel

# reel de texto: roteiro -> MP4 1080x1920 H.264 faststart
python3 social/reel/build.py social/reel/roteiro-exemplo.json social/out/reel.mp4

# reel de "site reveal": grava o scroll de um site
python3 -m http.server 4173 &
python3 social/reel/capture_site.py http://localhost:4173 social/out/site-reveal.mp4 --seg 8
```

Saídas validadas: PNGs em 1080x1350 e MP4 `h264 High / yuv420p / 1080x1920 / 30fps` com
`+faststart` — exatamente o que a Graph API aceita. A arte sai na paleta da landing
porque o CSS lê os mesmos tokens (`--cobre`, `--bg`, Space Grotesk/JetBrains Mono).

---

## 5. Plano editorial — 4 pilares

| Pilar | O que é | Formato natural | Por que existe |
|---|---|---|---|
| **Prova** | Bastidor real: o site do Beto Chaves rodando, o build da Clínica da Fé, commit, antes/depois | Reel *site reveal*, carrossel antes/depois | Credibilidade. É o pilar que fecha contrato |
| **Dor** | O problema do dono de PME: site lento, sem mobile, formulário de 6 campos, "parece amador" | Carrossel checklist, reel de texto | É o que é **enviado no direct** — sinal de maior peso |
| **Craft** | Opinião técnica: por que template não serve, o que é performance de verdade, storm em canvas | Reel de tela + fala, carrossel técnico | Diferencia de agência genérica; atrai também recrutador/cliente técnico |
| **Oferta** | Como trabalho, prazo, o que entrego, chamada pro direct | Carrossel CTA, story | 1 a cada 5 posts. Mais que isso, o alcance cai |

**Cadência semanal:** 3 reels (2 de Prova/Craft + 1 de Dor) + 2 carrosséis (1 Dor + 1
Prova ou Oferta) + stories nos dias de build. Sempre com **CTA de direct**, não de link.

**Primeiros 9 posts** (fila para as duas primeiras semanas):
1. Reel site reveal — Beto Chaves, do topo ao rodapé, texto "isso não é template".
2. Carrossel — "5 coisas que travam o site da sua empresa" (deck de exemplo já está no repo).
3. Reel de texto — "seu site demora 4,8s. o meu abre em 0,9s" (roteiro já no repo).
4. Carrossel — anatomia da landing do Storm: por que cada seção existe.
5. Reel — bastidor da Clínica da Fé: da primeira conversa ao wireframe.
6. Carrossel — "template x sob medida": o que muda em 12 meses de manutenção.
7. Reel — o storm em canvas rodando + 3 linhas de código: "isso é 40 linhas, não um plugin".
8. Carrossel — checklist de briefing que eu mando pro cliente (lead magnet → comment-to-DM).
9. Reel — "site no ar em 3 semanas: como eu trabalho" (Oferta).

---

## 6. Armadilhas que a pesquisa deixou claras

- **Encher a página com IA genérica derruba a conta.** Original ganha 40-60% mais
  distribuição; repost em série exclui das recomendações. Automatize a *produção*, nunca
  a *origem* da ideia.
- **Trending audio por API não existe.** Se a trilha importa, publique manualmente ou
  aceite som próprio/licenciado embutido.
- **Carrossel de 20 slides por API: não.** Máximo 10.
- **PNG direto na API: não.** Converta para JPEG (o renderizador entrega PNG — o passo de
  conversão entra junto do upload).
- **DM automático fora da regra limita o envio da conta.** Um por usuário a cada 24h,
  resposta em 30s, dentro da janela de 24h.
- **Não construa em cima do Sora 2** (desligado em 24/09/2026).
- **App Review não é obrigatório para você** — só quando virar produto para clientes.

---

## 7. Custo mensal

| Cenário | Custo |
|---|---|
| Pipeline deste repo + Metricool free + publicação manual/API própria | **R$ 0** |
| \+ Nano Banana Pro para fundos (≈20 imagens/mês) | ~US$ 3 |
| \+ ElevenLabs para narração (≈30k caracteres) | ~US$ 3 |
| \+ Veo 3.1 Fast para B-roll (≈60s/mês) | ~US$ 9 |
| Terceirizar publicação (Blotato) quando atender clientes | US$ 29 |

---

## 8. Decisões que dependem de você

1. **Voz na câmera ou não?** Rosto multiplica confiança para serviço 1-a-1 (e o PRODUCT.md
   já vende "você fala direto com quem constrói"). Sem rosto, o motor fica 100% automático;
   com rosto, ganha conversão e perde escala. Recomendo híbrido: 1 reel com você por semana.
2. **A Clínica da Fé entra como case público?** Precisa de autorização do cliente — mas
   "build em público" de um projeto real é o conteúdo mais forte disponível agora.
3. **Publicar na conta dos clientes vira serviço?** Se sim, começa o App Review desde já
   (2-4 semanas) ou entra num Blotato/Ayrshare.
4. **Instagram sozinho ou Instagram + Threads?** A API do Threads é **grátis** e desde
   25/03/2026 tem `threads_share_to_instagram` para cross-post. Custo marginal ~zero.

---

## Fontes

Algoritmo e formatos: [Buffer](https://buffer.com/resources/instagram-algorithms/) ·
[Dataslayer](https://www.dataslayer.ai/blog/instagram-algorithm-2025-complete-guide-for-marketers) ·
[TrueFuture Media](https://www.truefuturemedia.com/articles/instagram-reach-2026-algorithm-reels-carousels-caption-seo) ·
[Contentdrips](https://contentdrips.com/blog/2026/06/instagram-reels-vs-carousels-2026-guide/) ·
[CreatorFlow](https://creatorflow.so/blog/instagram-algorithm-2026/)
· SEO/hashtags: [Metricool](https://metricool.com/instagram-seo/) · [Toptal Creator](https://www.toptal.com/creator/post/instagram-seo)
· Trial Reels: [Metricool](https://metricool.com/instagram-trial-reels/) · [Social Champ](https://www.socialchamp.com/blog/instagram-trial-reels/)
· DM automation: [Manychat](https://manychat.com/blog/instagram-dm-automation-rules/) · [CreatorFlow](https://creatorflow.so/blog/instagram-dm-compliance-meta-rules/)

API e limites: [Meta — Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) ·
[Meta — Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/) ·
[Meta — Insights](https://developers.facebook.com/docs/instagram-platform/insights/) ·
[Postproxy — publicar reels](https://postproxy.dev/blog/instagram-reels-api-publishing-guide/) ·
[Postproxy — publicar no Instagram](https://postproxy.dev/blog/post-to-instagram-via-api/) ·
[Phyllo — Reels API](https://www.getphyllo.com/post/a-complete-guide-to-the-instagram-reels-api) ·
[Netrows](https://www.netrows.com/blog/instagram-graph-api-guide-2026) ·
[Blotato — dev mode sem app review](https://www.blotato.com/blog/instagram-posting-api) ·
[Post-bridge — limite de 10 no carrossel](https://support.post-bridge.com/media-limits-and-processing/instagram-carousel-post-photo-limit-10-photos-maximum) ·
[Storrito — 20 slides só no app](https://storrito.com/resources/how-instagrams-20-slide-carousels-work-and-what-the-new-limits-are/) ·
[Threads API](https://www.blotato.com/blog/threads-api-pricing)

Ferramentas: [Metricool + Claude](https://metricool.com/social-media-management-with-claude/) ·
[Buffer MCP](https://mcpmarket.com/server/buffer) · [Postiz MCP](https://postiz.com/mcp) ·
[Socialync — MCPs de social](https://www.socialync.io/blog/best-social-media-mcp-servers-2026) ·
[Upload-Post — preços](https://www.upload-post.com/pricing-comparison/) ·
[Blotato vs Ayrshare](https://www.blotato.com/blog/blotato-vs-ayrshare) ·
[Remotion](https://www.pkgpulse.com/guides/remotion-vs-motion-canvas-vs-revideo-programmatic-video-2026) ·
[Sora 2 — preço e desligamento](https://costgoat.com/pricing/sora) ·
[Veo 3.1 — preço](https://www.buildmvpfast.com/api-costs/ai-video) ·
[Nano Banana Pro — preço](https://www.aifreeapi.com/en/posts/nano-banana-pro-price) ·
[ElevenLabs — preço](https://elevenlabs.io/pricing/api) ·
[Cloudflare R2 — free tier](https://developers.cloudflare.com/r2/pricing/) ·
[n8n — templates de Instagram](https://n8n.io/workflows/4498-schedule-and-publish-all-instagram-content-types-with-facebook-graph-api/) ·
[HTML→carrossel em Playwright](https://github.com/DJ-vekariya/html-to-Instagram-carousel)
