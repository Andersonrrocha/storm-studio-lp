# Benchmark — quem faz conteúdo bom nesse nicho e qual é a fórmula

Levantamento de contas de estúdios de software/design com reels e carrosséis que
funcionam, análise da estrutura comum e a fórmula extraída para o Storm Studio.

**Estado:** iteração 2. A iteração 1 mapeou 23 contas por busca web e extraiu a fórmula
por padrão agregado. A iteração 2 (07/09/2026, Chrome logado no Instagram) levantou
**views reais por reel de 16 contas**, abriu os maiores outliers para ler curtidas e
rótulo de parceria, e verificou o nicho em PT-BR. Cinco achados mudaram a fórmula e a
fila — ver *Iteração 2*. Dados brutos em `social/browser/raw/`.

---

## Método e nível de evidência

Três fontes, com pesos diferentes — declarado por honestidade, porque muda o quanto
confiar em cada linha:

| Fonte | O que dá | Limite |
|---|---|---|
| **Busca web** | nomes de contas, posicionamento, ordem de grandeza de seguidores | não dá métrica por post |
| **NexLev `watch_instagram_video_and_ask`** | teardown real do reel: gancho, cortes, tipografia, áudio, CTA | **plano free = 1 vídeo por 24h** — é o gargalo do loop |
| **Estudos publicados de 2026** | padrões agregados (hook rate, duração ótima, peso de *sends*) | média do mercado, não deste nicho |

**Quarta fonte, a partir da iteração 2 — Instagram logado via Claude in Chrome (desktop):**
a grade `/reels/` de cada conta expõe views por reel; o post individual expõe curtidas,
comentários, data e o rótulo "Parceria paga"/colab. É métrica pública real, não
estimativa, e é a fonte que manda quando contradiz as outras três. (A iteração 1 rodou
num contêiner remoto sem rota para `instagram.com` — por isso dependia do NexLev.)

---

## Iteração 2 — o que os números reais mostram

### Método
Chrome com o Instagram do Anderson logado. Para cada conta: grade `/reels/` (12 a 25
reels mais recentes → views por reel), cabeçalho (seguidores, posts), captura da grade
para ler o gancho queimado na capa. Para o maior reel de cada conta: post aberto para
ler curtidas, comentários, data e rótulo de parceria. Handles verificados pela busca
interna. Brutos: `social/browser/raw/<conta>.json`.

### As 16 contas medidas

Mediana e topo em views. `med/seg` = mediana ÷ seguidores — é a métrica que interessa
para uma conta que começa do zero, porque mede quanto o formato entrega *por seguidor*.

| Conta | Seguidores | Reels | Mediana | Topo | Topo/med | med/seg |
|---|---:|---:|---:|---:|---:|---:|
| **basementdotstudio** | 4.871 | 10 | 5.878 | 15.400 | 2,6x | **121%** |
| _webstacks | 266 | 25 | 255 | 1.241 | 4,9x | 96% |
| **dannpetty** | 16.200 | 12 | 5.950 | 41.100 | 6,9x | **37%** |
| remsoftsistemas (BR) | 1.797 | 25 | 573 | 57.200 | 99,8x | 32% |
| brachadesigns | 438 | 25 | 112 | 599 | 5,3x | 26% |
| **deduxerstudio** | 2.695 | 13 | 553 | 4.890 | 8,8x | **21%** |
| **awsmd_com** | 24.800 | 25 | 4.510 | 9.941 | 2,2x | **18%** |
| brasilcode_ (BR) | 351.000 | 25 | 51.400 | 281.000 | 5,5x | 15% |
| goingclearboston | 598 | 19 | 46 | 178 | 3,9x | 8% |
| flux.academy | 53.800 | 24 | 3.826 | 258.000 | 67x | 7% |
| golivehq | 49.200 | 15 | 2.395 | 70.900 | 30x | 5% |
| experts_web_designs | 2.854 | 12 | 137 | 421 | 3,1x | 5% |
| ramotion | 158.000 | 25 | 7.410 | 41.200 | 5,6x | 5% |
| tubikstudio | 72.700 | 25 | 3.093 | 7.230 | 2,3x | 4% |
| thechrisdo | 1.000.000 | 25 | 36.000 | 2.900.000 | 81x | 4% |
| kangostudiio (BR) | 38 | 2 | 82 | 131 | — | — |

### Os cinco achados que mudam a fórmula

**1. Views mente. Os maiores "outliers" do nicho são anúncio ou colab.**
Abri o maior reel de cada conta grande:

| Reel | Views | Curtidas | Taxa | O que é de verdade |
|---|---:|---:|---:|---|
| flux.academy `DbavfSttMaC` | 258.000 | 116 | 0,045% | **Parceria paga com Webflow** |
| thechrisdo `DcJNCj-hbvI` | 2.900.000 | 1.400 | 0,05% | **Parceria paga com LinkedIn** |
| remsoftsistemas `DadpBfcgopP` | 57.200 | 17 | 0,03% | impulsionado (organico da conta é ~570) |
| golivehq `Db_IIBBO4bC` | 70.900 | — | — | **colab** publicado pela fundadora + convidado famoso |
| basementdotstudio `CmJm7PhKyGi` | 15.400 | 281 | 1,8% | colab publicado pelo **@awwwards** — orgânico, mas alcance do awwwards |
| deduxerstudio `DGAjhCDs_xs` | 4.890 | 37 | 0,76% | **orgânico**, sem rótulo |

Regra que sai daqui e entra no método: **outlier orgânico = views alto E taxa de curtida
≥ 0,5% E sem rótulo de parceria/colab.** Abaixo de 0,1% é anúncio. A iteração 1 tinha
enfileirado o reel pago da Webflow como "aula de precificação" — era mídia paga.

**2. Portfólio bonito não gera alcance.** Tubik (72,7 mil seguidores) e Ramotion (158
mil) entregam 4-5% dos seguidores por reel, curva plana, sem outlier — e a Ramotion
está caindo: reels de 2022-23 faziam 10-41 mil, os de 2025-26 fazem 4-6 mil. Formato
dos dois: reveal de UI/marca, sem rosto, sem frase no primeiro frame. Awesomed (24,8
mil, mesmo formato) segura 18% só por cadência semanal cravada. **Feed = portfólio é
o arquétipo mais fraco em alcance**, o oposto do que a iteração 1 supunha.

**3. O que escala organicamente tem duas formas, e só duas.**
(a) **Rosto + uma tese em tipografia grande no primeiro frame** — Chris Do ("Why does it
cost this much?", 670 mil, fixado), flux.academy ("2 kinds of designers. Both in
trouble" 16,2 mil; "$20k website. 'Dead' industry" 11,9 mil, contra mediana de 3,8 mil),
Dann Petty (37% dos seguidores por reel).
(b) **Produto real em movimento com craft acima do nicho** — deduxer (3D custom + motion
do site do cliente, "watch till the end": 1,8x os seguidores, sem rosto e sem fala) e
basement (ficção curta de marca em 3D: 121% dos seguidores na mediana, a melhor razão
de todo o levantamento). É a única prova de estúdio puro crescendo sem aparecer.

**4. Volume sem formato não é nada.** Bracha Designs: 3.381 posts, 438 seguidores,
mediana de 112 views — rosto no carro com legenda palavra a palavra, todo dia.
Experts Web Designs: barra de marca fixa em toda capa, um formato só ("Real Stories,
Real Results!"), 137 de mediana. GoingClear, agência de 25 anos: 46. A cadência do
padrão nº 6 só vale **depois** do formato existir.

**5. PT-BR não está vazio — está lotado de conta fraca.** A busca interna por "sites
sob medida", "estúdio de sites" e "criação de sites" devolve dezenas de contas (REM
Soft, digital.sc, FIN, COSMOS, Estúdio de Sites, Kango, NEXO, StarTech, PHCode…). O
que está vazio é o **patamar**: a REM Soft — concorrente mais próxima em posicionamento,
"sites, apps e sistemas sob medida", 551 posts — tem mediana de 573 views; a Kango tem
dois reels genéricos de motivação e 38 seguidores; a NEXO tem 5.113 seguidores e um
post (conta de anúncio). A única conta PT-BR com tração real é a @brasilcode_ (351 mil,
mediana 51 mil), que é curso de programação vencendo por humor de dev, não estúdio.
**Correção à iteração 1:** o espaço não é "nicho vago", é "nicho sem ninguém acima de
mil views orgânicas". E há **colisão de nome**: @stormstudio.br já existe como agência
de "Marketing & Tecnologia" (1.334 seguidores), e a busca "storm studio" devolve cinco
contas — o nome de exibição precisa carregar o diferenciador.

### Correções de handle e de fila
- `@designjoy` no Instagram é uma conta morta (7 posts, 24 seguidores). Brett Williams
  cresceu no X — Designjoy segue como referência de *posicionamento*, não de Instagram.
- `@uiadrian` não existe mais; `@thefutur` não existe (Chris Do é `@thechrisdo`);
  basement é `@basementdotstudio`; deduxer é `@deduxerstudio`.
- Dos 18 reels da fila v1, com dado real: `DDXh2ohNfDZ` (experts) tem **165 views**,
  `C9h2wRkhEx9` (goingclear) **62**, `DFtj0utS1n-` (webstacks) **146**,
  `DDEWSH6Idni` (deduxer) **2.178** (o único bom), `DIjMYMhqOLW` (tubik) 3.617 na média
  da conta. A fila foi reordenada por evidência — `teardown.json` v2.

### O que muda para o Storm

- **Meta calibrada para os 90 primeiros dias:** com 0-500 seguidores, um reel orgânico
  bom neste nicho faz **300-1.500 views** (webstacks, deduxer, REM Soft). Um outlier
  orgânico real é **3-9x a mediana da própria conta**, não 100x. Qualquer coisa acima
  disso sem curtida proporcional é anúncio — inclusive o nosso, se impulsionar.
- **Não impulsionar cedo.** 57 mil views impulsionadas deram 17 curtidas e 1 comentário
  à REM Soft: não vira seguidor, não vira lead, e estraga a leitura do que funciona.
- **Base do feed = forma (b), uma vez por semana = forma (a).** A `BASTIDOR` e a
  `SOB MEDIDA` já são (b); passam a ter a exigência do deduxer/basement: craft
  visível acima do nicho (motion com física, 3D, tipografia cinética — capítulo B da
  pesquisa) e a promessa "assiste até o fim" cumprida. A `RAIO-X` vira a peça (a):
  rosto + tese de 4-6 palavras queimada no primeiro frame, no molde
  "$20k website. 'Dead' industry." / "Planilha resolve até certo ponto. Depois
  destrói." Isso resolve a "decisão sobre rosto e voz" do doc de pesquisa com dado:
  uma por semana, e é a que dá alcance.
- **Cadência cravada (awsmd) só depois de o formato provar 3x a mediana.** Antes disso,
  cada peça é experimento; volume é o erro da Bracha.
- **Nome de exibição** com o diferenciador, não só a palavra-chave — a palavra-chave já
  é disputada por dezenas de contas: `Storm Studio · sites e sistemas sob medida, feitos
  à mão`.

---

## As 20 contas — quatro arquétipos (iteração 1, por busca web)

### A. Estúdio-portfólio — o feed *é* o portfólio
Quem vende projeto grande. Post = case, não dica.

| # | Conta | O que faz de diferente |
|---|---|---|
| 1 | **@ramotion** | Feed como portfólio vivo: cada post é um case com desafio do cliente, meta e como resolveram. É o modelo mais próximo do que o Storm precisa |
| 2 | **Isadora Agency** | Mistura portfólio com método técnico — princípios de motion, framework de front-end, técnica de build responsivo |
| 3 | **Tubik Studio** | UI/ilustração/motion próprios como conteúdo; o processo vira a peça |
| 4 | **Halo Lab** | Estúdio de produto, forte em processo e time |
| 5 | **@awsmd_com** (Awesomed) | ~25 mil seguidores, ~794 posts — cadência alta e constante, UI/UX puro |
| 6 | **Outcrowd** | Identidade visual forte e consistente entre peças |
| 7 | **basement.studio** | "We make cool shit that performs" — storytelling de produto e ferramenta de dev; ~40 pessoas, clientes ambiciosos |
| 8 | **Obys Agency** | Tipografia editorial levada ao extremo; conceito antes de tudo |
| 9 | **@locomotive_creative** | Site de marca em nível de agência; craft como argumento |
| 10 | **Active Theory** | História + arte + tecnologia; experiências web premiadas |
| 11 | **@sagmeisterwalsh** | Autoria e provocação visual — o oposto de template |

### B. Educador-operador — ensina o negócio, vende serviço/curso
Quem cresce rápido. É de onde vem a **fórmula de carrossel**.

| # | Conta | Dado concreto |
|---|---|---|
| 12 | **Chris Do / The Futur** | Levou **2,5 anos para chegar a 10 mil** seguidores; depois de sistematizar o carrossel *seamless* (imagem que atravessa os slides) passou a ganhar **+10 mil por semana**. Chegou a produzir 5 carrosséis por dia com template |
| 13 | **Ran Segall / Flux Academy** | 17 anos de ofício; conteúdo curto de UI/UX + negócio digital, ancorado no YouTube |
| 14 | **Brett Williams / Designjoy** | Agência de **uma pessoa** faturando ~US$ 100 mil/mês — a prova viva de que estúdio individual pode parecer grande. É o caso mais próximo do posicionamento do Storm |
| 15 | **@dannpetty** | 20+ anos, "o web designer mais rápido do mundo" — ângulo de velocidade; 17 mil no IG, 174 mil no X |
| 15b | **@flux.academy** | A conta com **mais reels indexados** de todo o levantamento, e a mais sistemática: séries numeradas (`Portfolio Review #13`), objeções viradas em gancho ("quanto tempo leva"), preço explícito ("projeto de US$ 50 mil"). É a aula de estrutura |

### C. Agência local / nicho — vende serviço direto
De onde sai o formato de **antes/depois** e o CTA de direct.

| # | Conta | Formato dominante |
|---|---|---|
| 16 | **@golivehq** | Agência Squarespace: dica de site + template + build. Reel de referência: `C9JJyC4MeYl` |
| 17 | **@experts_web_designs** | "Another happy client" — entrega de cliente como conteúdo recorrente. Reel: `DDXh2ohNfDZ` |
| 18 | **@uiadrian** (Adrian Kuleszo) | Anunciou a própria agência em reel e abriu vagas de retainer. Reel: `Cxx0bKrNP9B` |
| 19 | **@newyorkwebsitedesigner** / **@modernconnectionuk** | Geografia no nome — SEO de busca local dentro do Instagram |
| 20 | **@freelance.webdesign** | Nome de exibição = a própria palavra-chave que o cliente digita |
| 21 | **@_webstacks** | Formato didático de comparação ("refresh vs redesign") — resolve dúvida de compra |
| 22 | **@deduxer** / **@goingclearboston** / **@brachadesigns** | Case de redesign e gancho de objeção; agência local com CTA direto |
| 23 | **@tubikstudio** (72 mil) · **@framer** (275 mil) · **@awsmd_com** (25 mil) | Referência de escala: produto e estúdio grandes publicando no mesmo nicho |

### D. Curadoria — alcance alto, conversão baixa
**@welovewebdesign** e similares. Volume de inspiração; serve como termômetro do que o
nicho acha bonito, **não** como modelo de negócio. O Storm não deve imitar: repost em
série tira a conta das recomendações.

> Referência brasileira: **@brasilcode_** é a única com tração que apareceu no
> levantamento. O nicho "estúdio de software sob medida" em PT-BR está **vazio** — isso é
> oportunidade, não falta de mercado.

---

## O que todos têm em comum

Cruzando os quatro arquétipos com os estudos de 2026, seis padrões aparecem em todos:

1. **Um formato repetido até virar assinatura.** Ninguém varia toda semana. Chris Do
   fez carrossel *seamless*; @experts_web_designs faz "mais um cliente feliz"; Ramotion
   faz case study. O que cresce é **série**, não post avulso — os formatos que ganham em
   2026 são mini-série, passo a passo e vitrine com trend.
2. **O resultado vem primeiro, o método depois.** Ganchos fortes mostram o resultado no
   primeiro frame e só então explicam. *Hook rate* (plays de 3s ÷ impressões) acima de
   **25%** é o sinal de criativo bom.
3. **Duração menor do que se imagina.** O ponto ótimo caiu para **~15s**; a faixa útil é
   15-45s. Acima de 3 min o Instagram para de entregar para não-seguidores.
4. **A peça é construída para ser *enviada*, não curtida.** DM share pesa **3-5x** mais
   que like — 10 envios valem mais que 100 curtidas.
5. **Carrossel é o motor de autoridade; reel é o motor de alcance.** Carrossel salva
   **4-5x** mais que reel e 8-10x mais que post simples. Educacional: 8-12 slides.
   Teardown, guia completo ou case timeline: 12-20 slides, com taxa de conclusão acima
   de 60% como meta.
6. **Cadência mata talento.** ~90% dos perfis brasileiros postam 1x/semana ou menos e
   perdem ~2% de seguidores ao ano; quem posta 2-3x/semana cresce **26%**.

---

## A fórmula extraída

### Reel — 3 blocos, 15 a 22 segundos

```
0,0-2,0s  GANCHO      o resultado já na tela + 4 a 6 palavras de texto grande.
                      Padrão de interrupção: número, contradição ou "antes/depois".
                      Nunca logo, nunca "oi pessoal", nunca fade de abertura.
2,0-7,0s  TENSÃO      o problema nomeado com especificidade — número, prazo, prejuízo.
                      Genérico aqui mata o reel inteiro.
7,0-16s   PROVA       a tela real fazendo a coisa. Corte a cada 1,2-2s.
                      Uma ideia por corte, texto sincronizado com o corte.
16-20s    SAÍDA       CTA leve de comentário/direct + loop de volta ao primeiro frame.
```
Regras que atravessam os quatro arquétipos: legenda queimada sempre; nenhum plano com
mais de 2s parado; o áudio marca o corte; a última frase costura com a primeira (loop
aumenta replays, que é sinal direto).

### Carrossel — 10 a 12 slides

```
1   GANCHO      promessa + lacuna de curiosidade. É 80% do resultado do post
2   CUSTO       o que a pessoa perde por não saber. Cria o motivo do swipe
3-8 SUBSTÂNCIA  uma ideia por slide, cada uma com tela/print/número real
9   VIRADA      a opinião contrária, o "todo mundo faz X, e é por isso que quebra"
10  PROVA       o seu case: antes, depois, prazo
11  RESUMO      os pontos em lista — é o slide que faz salvar
12  CTA         uma ação só, palavra-chave no direct
```
Truque do Chris Do que dá para copiar direto: **imagem contínua atravessando os
slides** (*seamless*) — o corte visual no meio de um elemento força o swipe.

### Ritmo semanal
3 reels + 2 carrosséis, sempre nos mesmos dias, dentro de **uma** série reconhecível.

---

## Como isso vira o Storm Studio

Posicionamento resultante do cruzamento: **arquétipo A (estúdio-portfólio) com voz de B
(operador que ensina) e CTA de C (direct)**. É exatamente o espaço do Designjoy — estúdio
de uma pessoa que parece grande — que em PT-BR não tem ninguém acima de mil views
orgânicas (ver *Iteração 2*, achado 5).

Três séries fixas, cada uma com identidade própria:

| Série | Formato | Cadência | Estrutura |
|---|---|---|---|
| **`RAIO-X`** | reel 18s | 1x/semana | Abro um site real (do cliente ou de um negócio qualquer), mostro em tela os 3 problemas e o que custa. Resultado no primeiro frame: o número de carregamento |
| **`SOB MEDIDA`** | carrossel 12 slides | 1x/semana | Case: o problema do cliente, as decisões, o antes/depois, o prazo. Slide 1 com o número final |
| **`BASTIDOR`** | reel 15s | 2x/semana | O build acontecendo — código, canvas, terminal, o erro que deu 3 vezes. É a série que prova o craft |

Nome de exibição seguindo o padrão C (palavra-chave no nome, não só na bio):
`Storm Studio · sites e sistemas sob medida`.

---

## Fila de teardown v2 — as próximas iterações do loop

`social/browser/teardown.json` foi reordenada com os números reais: primeiro os
outliers **orgânicos** (taxa de curtida verificada ou views ≥ 3x a mediana da conta sem
rótulo de parceria), depois os representativos de cada forma, por último o que a
iteração 1 tinha posto na frente sem dado. Reels pagos/colab ficam na lista
`descartados` com o motivo — não servem de modelo de formato.

Cada teardown vira uma linha com: gancho literal, duração de cada bloco, tipo de
imagem, ritmo de corte, tipografia, CTA e o que é replicável. Com o Chrome logado o
teardown é feito assistindo o reel na tela (sem cota); o NexLev fica para transcrição
em lote quando valer a pena.

---

## Fontes

[Magnet — top 20 contas de web designer 2026](https://marketingbymagnet.com/top-20-web-designer-instagram-accounts-2026) ·
[Magnet — mid-tier 25K-100K](https://marketingbymagnet.com/mid-tier-web-designer-instagram-accounts) ·
[Digital Agency Network — contas de agências criativas](https://digitalagencynetwork.com/creative-digital-agency-instagram-accounts/) ·
[Eagle — 22 contas de UX/web design](https://en.eagle.cool/blog/post/best-instagram-accounts-for-ux-web-design-inspiration) ·
[Hafi — mais seguidos em web design](https://hafi.pro/top/most-followed-instagram/web-design) ·
[Codrops — dentro da basement.studio](https://tympanus.net/codrops/2025/12/15/from-basement-to-breakthroughs-inside-the-studio-powering-the-internets-boldest-brands/) ·
[Designjoy — agência de uma pessoa](https://www.linkedin.com/in/brettwill1025/) ·
[Chris Do — carrossel seamless](https://www.linkedin.com/posts/thechrisdo_seamless-instagram-carousel-posts-activity-7041437835979100160-Crsm) ·
[Design Lumo — estratégia de reels para agências 2026](https://www.designlumo.com/blog/instagram-reels-strategy-for-instagram-marketing-agencies) ·
[Influencers Time — brief de hook, shot e CTA](https://www.influencers-time.com/instagram-reels-creative-brief-hook-shot-and-cta-guide/) ·
[AdPicto — carrossel slide a slide](https://www.adpicto.com/en/blog/instagram-carousel-best-practices-2026) ·
[TrueFuture — estratégia de carrossel 2026](https://www.truefuturemedia.com/articles/instagram-carousel-strategy-2026) ·
[Postig — guia de carrosséis (dados BR)](https://postig.com.br/en/blog/guia-completo-carrosseis-instagram-2026) ·
[Propmark — reels ou carrossel no Brasil](https://propmark.com.br/digital/reels-ou-carrossel-qual-gera-mais-engajamento-no-instagram-em-2026/) ·
[Cloud Campaign — plano de reels para agências](https://www.cloudcampaign.com/blog/instagram-reels-strategies)
