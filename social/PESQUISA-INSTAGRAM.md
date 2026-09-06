# Storm Studio — sistema de conteúdo premium para Instagram

Segunda rodada da pesquisa, refeita depois da crítica: **sem API** (publicação por
browser control), patamar **premium** e não MVP, com as ferramentas que existem hoje no
mercado e os plugins/conectores que já estão ao alcance desta conta.

Setembro de 2026. Fontes no fim.

---

## 1. Por que a primeira entrega ficou slop — diagnóstico honesto

O problema não foi a ferramenta. Foi **direção e matéria-prima**. O que eu produzi tinha
três defeitos estruturais, e todos os três são os mesmos que fazem qualquer conteúdo de
IA ser reconhecido como IA em meio segundo:

1. **Zero material real.** Nenhum frame do produto, nenhuma tela do site do Beto Chaves,
   nenhuma mão, nenhuma imperfeição. Texto sobre gradiente é o fundo que sobra quando não
   se tem nada para mostrar.
2. **Movimento sem física.** `zoompan` linear é o Ken Burns de apresentação de PowerPoint.
   O que separa um reel de estúdio é *timing*: overshoot, stagger entre elementos, easing
   com curva própria, massa. Isso é motion design — não é um filtro de ffmpeg.
3. **Tipografia parada.** Studio Dumbar, FEVR, ManvsMachine não usam fonte melhor: usam
   **tipografia cinética** com hierarquia que se constrói no tempo. Texto que aparece com
   fade não é motion, é slide.

O contexto de mercado torna isso pior, não melhor: em 2026 **64% de todo o conteúdo novo
publicado é gerado por IA**, numa proporção de 17 para 1 sobre conteúdo humano. A
consequência medida é que conteúdo humano ou híbrido com imperfeição deliberada rende
**40-60% mais dwell time e shares**, e a preferência do público por conteúdo gerado caiu
de 60% (2023) para **26%**. O padrão que as marcas premium seguem é explícito:
**IA como infraestrutura — análise, variação, teste, versionamento, publicação — nunca
como voz.** Apple não gera copy, Nike não gera campanha no Midjourney.

Para o Storm Studio isso é ainda mais crítico, porque a sua venda é *craft*. Um post que
parece gerado destrói exatamente o argumento que a landing faz ("sob medida, feito à mão,
sem templates"). **Conteúdo genérico aqui não é neutro: é contraprova.**

---

## 2. A decisão de publicação: browser control

Aceito a decisão de não usar API. Mas a pesquisa mudou o mapa — o que muda ao publicar
pelo navegador não é o que se imagina:

| | App do celular | **Web / browser control** | API |
|---|---|---|---|
| Carrossel | até 20 slides | **até 20 slides** | 10 (teto duro) |
| Áudio da biblioteca do Instagram | ✅ | ❌ | ❌ |
| Stickers, efeitos, texto nativo | ✅ | ❌ | ❌ |
| Capa customizada do reel | ✅ | ❌ (só frame do vídeo) | ✅ (`cover_url`) |
| Trial Reels / colaboração / rascunho | ✅ | ❌ | ❌ |
| Agendamento nativo | ✅ | ❌ | ❌ |
| App Review da Meta | — | **não precisa** | precisa (só p/ terceiros) |
| Risco de restrição da conta | baixo | **mais alto** | mais baixo |

Três consequências práticas:

**a) Browser control não dá trending audio.** Essa é a razão mais comum para fugir da API,
e ela não se resolve pelo navegador — a biblioteca de áudio só existe no app. O caminho
real é híbrido: o **carrossel e o reel com som próprio saem pelo navegador**; o reel que
precisa de áudio de tendência sai do celular (ou vai como rascunho e recebe o som no app).

**b) Browser control ganha os 20 slides.** A API trava em 10. Para um estúdio que vive de
carrossel técnico e antes/depois, dobrar o teto é vantagem real.

**c) O risco é gerenciável, mas conta nova é o pior momento.** O número que circula —
suspensão de **15-30% ao ano** para automação por navegador contra **<0,5%** por API —
vem de bots de engajamento em volume (DM em massa, follow/unfollow, múltiplas contas).
O que dispara a detecção é **volume, cadência não-humana, inconsistência de IP/dispositivo
e mensagem em massa** — nada disso é o seu caso a 5 posts por semana. Mas os primeiros
7-14 dias definem o *trust score* da conta: perfil novo publicando vídeo no dia 1 é
rotulado como spam-like, e link de oferta na primeira semana é shadowban quase garantido.
O protocolo de warm-up está em [`browser/PUBLICACAO.md`](./browser/PUBLICACAO.md).

**Ferramenta para operar:** o Claude Code de desktop tem **browser embutido desde julho de
2026** (`Cmd/Ctrl+Shift+B`) — sandboxed, sessão persistente opcional, e o agente lê a
*estrutura* da página e age no campo certo em vez de clicar em coordenada. É o caminho
nativo. Alternativas: **Claude in Chrome** (extensão, disponível em todo plano pago) ou
**Playwright MCP** com perfil de usuário persistente, se você quiser a mesma sessão sempre.

---

## 3. O que é "premium" neste nicho — e o stack que produz isso

Ordem de força para um estúdio de engenharia, do formato que mais converte para o que
menos:

### A. Produto em movimento — captura de tela tratada  ★ o formato #1
É o conteúdo que só você tem. Site do Beto Chaves rolando, o storm em canvas reagindo ao
cursor, o terminal de build, o Lab. Nada gerado compete com isso.

| Ferramenta | Preço | Por quê |
|---|---|---|
| **Screen Studio** (macOS) | US$ 149 vitalício (+US$ 109/ano updates) | Zoom automático no cursor, cursor suavizado e ampliado, motion "produzido" por padrão. É o padrão de mercado das demos que parecem caras |
| **FocuSee** (Win/Mac) | ~US$ 60/ano | Mesma ideia, multiplataforma, remove silêncio e gera legenda |
| **Cursorful** | freemium | Só navegador, leve |
| captura headless deste repo | R$ 0 | Determinística e versionável — boa para *b-roll* de apoio, não para a peça principal |

### B. Tipografia cinética e identidade em movimento  ★ o que tira o cheiro de template
Aqui está a virada de patamar, e ela já está conectada nesta conta:

- **Figma Motion** (Config 2026): a timeline entrou no canvas. Anima qualquer propriedade,
  **exporta MP4/WebM**, e é **compatível com MCP** — o conector Figma desta sessão já
  expõe `export_video`, `get_motion_context`, `create_shader`. Ou seja: dá para eu montar
  a peça no seu arquivo, animar e exportar o MP4 sem sair daqui. ⚠️ exporta em alta
  resolução só com **Full seat em plano pago**.
- **Shaders no Figma**: shader WebGPU como *fill* ou *effect*, com **cada parâmetro
  keyframável** na timeline. Isso é literalmente a tempestade da landing virando material
  de marca em vídeo — sem After Effects, e sem parecer template.
- **Cavalry** — node-based, *procedural*: sistemas generativos de marca, aquilo que levaria
  horas no After Effects. Comprado pela Canva em fev/2026 e **gratuito para individuais**
  desde a 2.7 (abr/2026). É o upgrade natural quando você quiser 30 variações da mesma peça.
- **Jitter** — o mais rápido: importa do Figma, anima, exporta vídeo/Lottie.
- **Rive** — para o que é interativo (não é o caso aqui, mas é o que anima a UI do produto).

### C. B-roll cinematográfico gerado — onde entra o Higgsfield
O que o **Higgsfield** é de fato: um *agregador* com 15+ motores (Veo 3.1, Kling 3.0,
Seedance 2.0, Nano Banana Pro, Flux 2) mais a camada própria — **70+ presets de câmera**
(dolly, crane, orbit, FPV), **Soul ID** para consistência de personagem com 100+
parâmetros, lipsync e clonagem de voz via ElevenLabs. Fundado pelo ex-chefe de IA do
Snap. Preços de ago/2026: **Basic US$ 5 (70 créditos), Pro US$ 29 (600), Max US$ 79
(1.800)**; na prática ~US$ 1,00 por clipe Kling 3.0 e ~US$ 2,90 por 8s de Veo 3.1.
**Não tem editor** — sai clipe, a montagem é fora.

Julgamento honesto para o seu caso: a força do Higgsfield é **humano/personagem
cinematográfico e controle de câmera**. Você não vende avatar; vende engenharia. Ele vale
como **fábrica de aberturas e b-roll atmosférico** (tempestade, texturas, macro de
hardware, transições dirigidas) — 3 a 5 segundos que abrem o reel antes do produto real
entrar. Para isso, US$ 29/mês é barato e o controle de câmera é o diferencial contra
prompt cru.

Alternativas conforme o uso:
- **fal.ai** — 44% do mercado de APIs de vídeo; paga por segundo, sem assinatura, com
  Kling 3.0, Veo 3.1, Seedance 2.0, Wan 2.6, LTX 2.0 no mesmo lugar. É o caminho para
  automatizar geração dentro do pipeline (~US$ 0,10-0,20/s em Kling; Veo ~US$ 0,40/s).
- **Google AI Pro US$ 19,99/mês** (1.000 créditos, Veo 3.1 Fast) se você quiser mexer na
  mão pelo Flow. Ultra reestruturado: entrada em US$ 99,99.
- **LTX Studio** (US$ 0-125) — se a peça exigir *narrativa* com storyboard, consistência
  entre planos e nós reutilizáveis. É o único da lista que pensa em produção, não em clipe.
- Ranking de qualidade hoje: **Veo 3.1** melhor física/luz geral, **Seedance 2.0** melhor
  aderência a prompt e imagem→vídeo, **Kling 3.0** o mais estilizado e com 4K nativo.
- ⚠️ **Sora 2 está sendo desligado** (app em abr/2026, API em **24/09/2026**). Não entra.

### D. Áudio
- **Trilha:** Epidemic Sound / Artlist têm **indenização contratual real** (Artlist Max
  Business, Epidemic Pro Plus) — é o que uma empresa com clientes deve usar. **Suno** dá
  direitos comerciais nos planos pagos, inclusive para Reels monetizado, **mas não gera
  copyright registrável** e a própria ToS não garante que direito autoral se constitua.
  Para peça de marca: Artlist/Epidemic. Para experimento: Suno.
- **Voz:** ElevenLabs PT-BR (US$ 0,05-0,10 por 1.000 caracteres). Regra: narração de IA só
  quando o texto é **seu**, gravado com a sua estrutura. IA lendo texto de IA é o som do slop.
- **Sound design** é o item mais subestimado: 3 efeitos bem colocados (whoosh no corte,
  click no CTA, hum grave de fundo) fazem mais pela percepção de qualidade que 10s de vídeo gerado.

### E. Finalização
- **Submagic** — legendas animadas palavra a palavra, consideradas as melhores da
  categoria; b-roll automático. **OpusClip** para achar cortes dentro de gravação longa.
- Legenda queimada não é opcional: a maioria assiste sem som.

---

## 4. Skills, plugins e conectores — o que dá pra ligar hoje nesta conta

**Já conectados e subaproveitados:**

| Conector | O que ele resolve aqui |
|---|---|
| **Figma** | Motion + shaders + `export_video` — a fábrica de peça premium. **É a peça central da virada de qualidade** |
| **NexLev** | `watch_instagram_video_and_ask` e `watch_tiktok_video_and_ask` dissecam reels que performaram; outliers, transcrição em lote, swipe file com pastas. Isso é **pesquisa criativa de verdade** — entender por que um reel funcionou, não copiar |
| **Notion** | Backlog, calendário, biblioteca de ganchos, registro de métrica por peça |
| **LunarCrush** | Tendência social por tópico/keyword — pauta com timing |

**No catálogo de plugins, prontos para instalar:**

| Plugin | Para quê |
|---|---|
| `brand-voice` | Extrai a voz de marca dos seus documentos e **valida cada peça** contra ela. É o antídoto direto para slop: nada publica sem passar |
| `marketing` | `content-creation`, `campaign-plan`, `brand-review`, `performance-report` |
| `design` | `design-critique` — crítica estruturada da peça antes de publicar |
| `adobe-for-creativity` | Variações sociais, corte rápido, retoque, redimensionamento em lote |
| `canva` | Bulk create e brand check, se quiser editar do celular |
| `brightdata` | Extração estruturada de Instagram/TikTok — swipe file e inteligência de concorrente |
| `postiz` | Agendamento em 28+ plataformas (fica como plano B, já que a decisão é browser) |

**Skills abertas que valem o clone:** [`sergebulaev/instagram-skills`](https://github.com/sergebulaev/instagram-skills)
(ganchos, plano semanal, hashtag), [`coreyhaines31/marketingskills`](https://github.com/coreyhaines31/marketingskills)
(CRO e copywriting). Nesta sessão já existem `content-engine`, `design-system`,
`frontend-design` e `artifact-diagramming`.

---

## 5. A arquitetura do sistema — quem faz o quê

O erro do desenho anterior foi tratar tudo como automatizável. O desenho certo separa o
que é **infraestrutura** (minha) do que é **autoria** (sua):

| Camada | Dono | Ferramenta | Tempo/semana |
|---|---|---|---|
| **1. Inteligência** — o que o nicho publicou, quais outliers, por que funcionaram | Claude | NexLev, BrightData, LunarCrush → Notion | 0 (roda sozinho) |
| **2. Direção** — pilar, gancho, referência visual, o que a peça afirma | **você** | Notion + 20 min de conversa comigo | 30 min |
| **3. Matéria-prima** — capturas reais, áudio seu, foto do processo | **você** | Screen Studio, celular | 1 h |
| **4. Produção** — montagem, motion, variações, legenda, versão A/B | Claude | Figma Motion/shaders, Cavalry, Higgsfield, Submagic, pipeline do repo | 0 |
| **5. QA** — checklist de qualidade, `brand-voice`, `design-critique` | Claude + você aprova | plugins | 10 min |
| **6. Publicação** — browser control, cadência humana | Claude | browser do Claude Code / Chrome | 0 |
| **7. Aprendizado** — métrica por peça, o que repetir | Claude | Insights lidos na tela → Notion | 0 |

**Total seu: ~1h40 por semana** para 3 reels + 2 carrosséis. É esse o número que torna o
projeto sustentável — e é ele que some se a gente tentar automatizar a camada 2 e 3.

---

## 6. O padrão de qualidade — checklist que mata o slop

Nenhuma peça publica sem passar em todos:

1. **Tem material real?** Pelo menos um frame de tela, código, mão ou lugar que só o Storm
   tem. Se a peça inteira é texto sobre fundo, ela não sobe.
2. **A afirmação é sua?** A peça diz algo que só quem construiu aquilo pode dizer. "Site
   rápido converte mais" não é; "reduzi 4,8s para 0,9s trocando 3 coisas, olha aqui" é.
3. **O movimento tem física?** Easing próprio, stagger, overshoot. Nada de fade + zoom linear.
4. **O primeiro frame lê a 1/4 da tela?** Teste real: reduza o preview a 270px de largura.
5. **Tem um motivo para ser enviado no direct?** *Sends* pesam 3-5x mais que like.
6. **Passou no `brand-voice` e no `design-critique`?**
7. **A trilha é licenciada e o som foi desenhado?** Pelo menos um efeito no corte-chave.
8. **Tem imperfeição humana?** Um erro de digitação no terminal, um take com respiração,
   um "isso aqui deu errado três vezes". É o que mede 40-60% a mais de dwell time.

---

## 7. Custo — três níveis

| Nível | Composição | Mensal |
|---|---|---|
| **Enxuto** | Figma Full seat + Cavalry (grátis) + pipeline do repo + Artlist | ~US$ 35 |
| **Sério** (recomendado) | \+ Screen Studio (US$ 149 uma vez) + Higgsfield Pro US$ 29 + Submagic ~US$ 20 + ElevenLabs US$ 5 | ~US$ 90/mês + US$ 149 inicial |
| **Agressivo** | \+ fal.ai por segundo (~US$ 30) + LTX Studio US$ 35 + Epidemic Pro | ~US$ 190 |

Referência: uma peça de motion contratada em agência custa de US$ 1.500 a US$ 5.000. O
nível "sério" produz ~20 peças/mês.

---

## 8. Plano de 30 dias

**Semana 0 — fundação (sem publicar quase nada)**
Conta profissional criada e aquecida pelo protocolo de 14 dias (`browser/PUBLICACAO.md`).
Nome de exibição com palavra-chave (`Storm Studio · sites e sistemas sob medida`). Figma
com Full seat, arquivo `Storm Social` com o sistema de peças (grid, tipografia, shader da
tempestade, 4 templates de timeline). Primeira sessão de captura: 40 min de Screen Studio
no site do Beto Chaves e no Lab.

**Semana 1 — provar que existe** — 1 reel de produto em movimento (Beto Chaves, som
próprio, legenda Submagic) + 1 carrossel de 12 slides com telas reais anotadas.

**Semana 2 — provar que entende** — 1 reel de tipografia cinética (Figma Motion + shader)
com uma opinião técnica forte + 1 carrossel de antes/depois com números reais.

**Semana 3 — provar que trabalha** — bastidor da Clínica da Fé (com autorização) + reel de
processo com b-roll de abertura gerado no Higgsfield.

**Semana 4 — converter** — carrossel de oferta + reel "como eu trabalho", já com CTA de
direct. Revisão das métricas: qual gancho teve mais *sends*.

---

## 9. O que eu preciso de você para isso sair do papel

1. **Figma com Full seat em plano pago** — sem isso não há export de vídeo em alta e a
   camada B inteira cai.
2. **1 hora de captura por semana.** É o insumo que nenhuma ferramenta substitui.
3. **Decisão sobre rosto e voz.** Estúdio de uma pessoa vendendo atendimento 1-a-1 sem
   nunca aparecer é uma contradição que o público sente. Sugestão: 1 peça por semana com
   você, o resto sem.
4. **Orçamento aprovado** (recomendo o nível "sério").
5. **Autorização da Clínica da Fé** para build em público.
6. **A conta e o dispositivo** de onde a publicação vai sair — o browser control precisa
   ser sempre o mesmo ambiente.

---

## Fontes

Qualidade e mercado: [Superside — por que criativo de IA soa off-brand](https://www.superside.com/blog/why-ai-generated-creative-feels-off-brand) ·
[Field Vision — o que é taste](https://fieldvisiongroup.com/blog/ai-slop-what-taste-means/) ·
[Nurdd — marcas batendo o slop](https://www.nurdd.club/blogs/made-by-humans-authentic-content-ai-slop) ·
[Digiday — autenticidade em alta](https://digiday.com/media/after-an-oversaturation-of-ai-generated-content-creators-authenticity-and-messiness-are-in-high-demand/) ·
[Versa — tendências de design social 2026](https://versacreative.com/blog/top-social-media-design-trends-2026/)

Publicação e risco: [PostEngage — risco de banimento por automação](https://postengage.ai/blog/instagram-automation-ban-risk-truth) ·
[Unfollr — regras de automação 2026](https://www.unfollr.com/blog/instagram-automation-rules) ·
[Multilogin — warm-up de contas](https://multilogin.com/blog/how-to-warm-up-accounts/) ·
[Ssemble — guia de warm-up 2026](https://www.ssemble.com/blog/account-warmup-guide-2026) ·
[ContentStudio — shadowban](https://contentstudio.io/blog/instagram-shadowban) ·
[PostEverywhere — limites do Instagram no desktop](https://posteverywhere.ai/blog/how-to-post-instagram-reels-from-desktop) ·
[Hopper HQ — postar do desktop](https://www.hopperhq.com/blog/how-to-post-to-instagram-from-desktop/) ·
[Claude Code — browser embutido](https://code.claude.com/docs/en/whats-new/2026-w28) ·
[Playwright MCP](https://playwright.dev/mcp/introduction)

Ferramentas: [Figma — Config 2026](https://www.figma.com/blog/config-2026-recap/) ·
[Figma Motion](https://www.figma.com/blog/introducing-figma-motion/) ·
[Figma — shaders e plugins generativos](https://www.figma.com/blog/how-we-built-generative-plugins-and-shaders/) ·
[LottieFiles — melhores ferramentas de motion 2026](https://lottiefiles.com/blog/design-guides-and-tips/best-motion-design-tools-ranked-by-use-case/) ·
[Rive vs Cavalry](https://artofstyleframe.com/blog/rive-vs-cavalry-which-motion-tool/) ·
[Higgsfield — review e preços](https://dynalord.com/blog/higgsfield-review) ·
[Higgsfield — planos](https://creatify.ai/blog/higgsfield-pricing-(2026)-plans-and-what-you-ll-actually-pay) ·
[The Rundown — Higgsfield](https://www.therundown.ai/tools/higgsfield) ·
[fal.ai — review e preços](https://vibecoding.gallery/en/tools/fal-ai/) ·
[Comparativo de APIs de vídeo](https://www.teamday.ai/blog/ai-image-video-api-providers-comparison-2026) ·
[Ranking de modelos de vídeo 2026](https://techsy.io/en/blog/best-ai-video-models) ·
[Veo/Flow — preços](https://costgoat.com/pricing/google-flow) ·
[LTX Studio](https://www.therundown.ai/tools/ltx-studio) ·
[Screen Studio e alternativas](https://focusee.imobie.com/reviews/best-screen-studio-alternative.htm) ·
[Submagic vs OpusClip](https://www.ngram.com/blog/opus-clip-vs-submagic) ·
[Licenciamento de música IA 2026](https://thepostflow.com/ai/ai-music-licensing-for-video-editors-what-you-can-actually-use-and-when-the-rights-evaporate/) ·
[Suno — uso comercial](https://techjacksolutions.com/ai-tools/suno/suno-commercial-use/) ·
[UGC com IA — comparativo](https://lensgo.ai/blog/best-ai-ugc-ad-tools-2026)
