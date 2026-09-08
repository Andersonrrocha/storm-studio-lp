# Guia — como o Storm Studio faz uma peça para o Instagram

O que aprendemos fazendo o carrossel 01 (07–08/09/2026): pesquisa com dados reais do
Instagram, uma fórmula, uma peça com material real e três ciclos de crítica por agentes.
Este é o processo a repetir. O que está aqui foi testado; o que ainda não foi, está marcado.

---

## 1. Os princípios (não negociáveis)

1. **Material real ou nada.** Tela real do site, código real, foto real do lugar, número
   medido, citação literal. Texto sobre gradiente é o que sobra quando não há o que
   mostrar — e é o que o público lê como IA. Se uma decisão do projeto não tem tela que
   a prove, ela não vira slide.
2. **A afirmação é nossa, e é verificável.** Cada frase que afirma um fato entra em
   `_fatos.md` com fonte e estado (✓ / ✗ / opinião). "Quem chega julga em segundos" pode
   ficar como voz; "carrega em 0,9 s" só com medição repetida. O que a medição
   contradiz, sai — mesmo que estrague o slide (aconteceu com a velocidade do site do
   cliente: LCP 10,9 s; saiu).
3. **Views mente.** No benchmark, os maiores "outliers" do nicho eram anúncio ou colab.
   Referência só com taxa de curtida ≥ 0,5 % e sem rótulo de parceria. Nunca impulsionar
   cedo: 57 mil views impulsionadas deram 17 curtidas a um concorrente.
4. **Identidade = a landing.** Só tokens de `styles.css` (near-black, cobre→bronze,
   flash, Space Grotesk + JetBrains Mono, grão, raio). Anti-referências em `PRODUCT.md`
   (creme editorial, serifa itálica, roxo, pílula genérica, ícone desenhado no lugar de
   foto). Kicker mono é o `.section-label` da landing, não o *eyebrow* de template.
5. **Sem jargão para o dono de PME.** "Scroll", "terminal", "deploy", "craft", "grade"
   não passam. Se a frase precisa de 30 palavras para explicar, a decisão não pertence à
   peça.
6. **Uma peça, um quadro.** Um carrossel de case fala do site *daquele* cliente do
   primeiro ao último slide. Mostrar o nosso próprio site no meio quebrou o quadro e
   virou autopromoção — o nosso site fica no rodapé e no CTA.
7. **IA é infraestrutura, não voz.** Análise, variação, crítica, render, publicação: sim.
   Texto com cara de IA, imagem gerada no lugar de material real, rosto gerado: nunca.
   Imagem gerada só como **cenário** (textura, atmosfera, abertura), nunca como
   **protagonista** nem como algo que finja ser real — ver §6.

## 2. A fórmula (carrossel, 10–12 slides)

```
1   GANCHO     tese em 6–9 palavras, palavra-chave em cobre, tela real sangrando na
               borda, linha de promessa ("6 decisões, com a tela real →").
2   CUSTO      o problema com a citação literal do cliente + o "antes" carimbado.
3   DEPOIS     a recompensa logo depois do antes (não adiar: o CSS explica depois).
3–8 SUBSTÂNCIA uma decisão por slide, cada uma com tela real e um motivo em uma frase;
               a mais forte é a que só existe entendendo o negócio ("o que mais vende
               vem primeiro").
9   VIRADA     a opinião contrária + a objeção de preço ("template custa menos…").
10  PROVA      citação literal, nome, cidade, site — só tipografia.
11  RESUMO     lista numerada, kicker "salva".
12  CTA        uma ação, uma palavra-chave, fallback para quem não tem site,
               "de graça, sem call".
```
Legenda: primeira linha específica (cabe antes do "mais"), pedido de **envio**
(sends pesam 3–5× o like), um gatilho de comentário barato, CTA com a mesma palavra da
bio, hashtags de dono e de cidade — não de designer.

Regras visuais que sobreviveram aos ciclos: tela real sempre em moldura (fone ou
navegador) com o que a frase cita **visível** (o botão de WhatsApp tem de aparecer no
slide do WhatsApp); carimbos "ANTES · data" / "HOJE" sobre a mídia; número grande com
unidade (`100 /100 · seo`); raio só na virada, recortado acima do rodapé; botão do CTA
em mono com canto 8 px como na landing; folha de contato a 270 px é o teste final.

## 3. O pipeline (o que roda)

```bash
python3 -m venv social/.venv && social/.venv/bin/pip install playwright pillow

# 1. material real
social/.venv/bin/python social/reel/capture_shots.py social/out/shots     # sites de cliente
social/.venv/bin/python social/reel/capture_lab.py                        # nossos produtos/páginas
#   antes/depois: Wayback (archive.org/wayback/available?url=…) → captura com Playwright
#   elementos fixed/sticky ocultos antes de capturar seção (senão o header carimba a tela)
#   números: npx lighthouse <url> --form-factor=mobile --output=json (≥ 2 rodadas; só usar
#   o que se repete: SEO, acessibilidade, CLS. Performance oscila 20 pontos — não usar)

# 2. deck + render
social/.venv/bin/python social/carousel/render.py social/carousel/deck-NN-*.json social/out/carrossel-NN
#   → slide_NN.jpg/png, _sheet.jpg (270 px), legenda.txt

# 3. fatos
#   social/out/carrossel-NN/_fatos.md: tabela afirmação · fonte · estado, antes da crítica
```

Deck: `type` cover | shot | big | turn | quote | list | cta; `img` + `frame` phone|browser,
`crop`, `pos: phone-r [in|old]`, `stamp`, `swipe`, `unit`, `flip`. Ver `social/README.md`.

## 4. O loop de crítica (3 ciclos, 3 críticos)

Cada ciclo dispara **três agentes em paralelo**, cada um com a sua skill, recebendo:
folha a 270 px, slides, deck, legenda, `PRODUCT.md`, `BENCHMARK.md` (Iteração 2 + fórmula)
e `_fatos.md` com o histórico. Saída padronizada: veredito em uma linha; correções
`slide N · severidade · problema · evidência · correção concreta (texto final)`; o que
não mexer. **Nunca alteram arquivos** — só relatam; quem aplica é a sessão principal,
que verifica cada proposta antes.

| Crítico | Skills | O que olha |
|---|---|---|
| Marketing / copy | `copywriting`, `marketing-psychology` | gancho, sequência de persuasão, especificidade, prova, objeções, CTA, **fatos** |
| Social / Instagram | `content-strategy` + BENCHMARK | salvar/enviar/comentar, 270 px, ordem e queda de interesse, legenda, primeiro post de conta zerada, cheiro de anúncio |
| Design / marca | `design:design-critique` + PRODUCT.md + tokens | hierarquia, enquadramento das telas, colisões, viúvas, identidade, resíduo de template |

Ritmo que funcionou: **ciclo 1** aberto (até 8 correções cada) → **ciclo 2** só o que
ainda é material (alta/média), com o registro do que mudou → **ciclo 3** só alta ou
"NADA MATERIAL". Parar quando os três devolvem nada material ou em 3 ciclos. Cada ciclo
é um commit. Os críticos discordam entre si às vezes (o slide do nosso site: um mandou
tirar, outro reescrever) — a decisão é da sessão principal, com o argumento registrado
em `_fatos.md`.

Modelo dos críticos: com regras bem definidas como acima, Sonnet basta; Opus para o de
marketing quando a peça tem muita afirmação de fato. (Ciclos do carrossel 01 rodaram no
modelo padrão da sessão; decks 02–04 rodaram em Sonnet: 21 pareceres, pegaram fatos
errados, jargão, recortes e até um bug de CSS — validado.)

Erros que os críticos pegaram e eu não tinha visto: "fachada, bancada, carro" (só a
fachada existe como foto); citação atribuída ao "primeiro contato" (era do depoimento
pós-projeto); "o terminal roda o deploy" (era animação); header fixo carimbado no meio
da captura; slide de SEO prometendo ranking; "6 cidades" (eram 4, em `lib/site.ts`).
**Toda afirmação de fato passa por leitura do código/site do cliente, não da ficha.**

## 5. Gates antes de publicar (decisões do Anderson, não do agente)

1. Aprovar texto e legenda.
2. Avisar o cliente quando a peça mostra o site dele (inclusive o antigo) ou o cita.
3. Conta: criada, nome de exibição com o diferenciador (colisão com @stormstudio.br),
   bio com a mesma palavra do CTA, 14 dias de warm-up (`browser/PUBLICACAO.md`).
4. Conferir "Solicitações" de mensagem todo dia — direct de não-seguidor cai lá.
5. Expectativa realista (benchmark): 300–1.500 views no primeiro post orgânico; outlier
   real = 3–9× a mediana da própria conta. O carrossel é a peça de fixar; o alcance vem
   do reel da mesma semana.

## 6. Assets gerados (cenário, nunca protagonista) — em teste

Regra: imagem gerada entra como **fundo/atmosfera** (textura de raio em cobre, macro de
hardware, névoa) atrás de material real, ou como abertura abstrata. Nunca: tela de site
que não existe, pessoa, cliente, produto "de mentira", nem nada que um leitor possa
tomar por foto real. Sempre com a paleta da marca, sem texto dentro da imagem (texto é
nosso, em tipografia), e registrado em `_fatos.md` como "gerado".

Mecanismo: ChatGPT pela assinatura (OAuth do Codex, `~/.codex/auth.json`), mesmo caminho
que o Hermes usa (`panel/server/src/state.ts`) — endpoint
`https://chatgpt.com/backend-api/codex/responses` com a ferramenta `image_generation`.
Script: `social/assets/gen.py` (estado: ver `social/README.md`).

## 7. Onde está cada coisa

- `social/BENCHMARK.md` — 16 contas medidas, os cinco achados, a fórmula.
- `social/PESQUISA-INSTAGRAM.md` — ferramentas, stack premium, plano de 30 dias.
- `social/carousel/` — template, render, decks. `social/reel/` — capturas e montagem.
- `social/out/carrossel-NN/` — saídas + `_fatos.md` (fora do git, exceto `_fatos.md` que
  deve ser copiado para `social/carousel/fatos-NN.md` ao fechar a peça).
- `social/browser/` — fila do que está pronto, fila de teardown, protocolo de publicação.
