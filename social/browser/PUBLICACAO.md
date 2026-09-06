# Publicação por browser control — protocolo operacional

Como a conta @stormstudio é publicada sem API: eu opero o `instagram.com` pelo navegador
(browser embutido do Claude Code — `Cmd/Ctrl+Shift+B` — ou Claude in Chrome), e este
documento é o procedimento que eu sigo. Ele existe porque **conta nova é o momento de
maior risco**: os primeiros 7-14 dias definem o *trust score* do perfil.

Regra que não se quebra: **o ambiente de publicação é sempre o mesmo** — mesma máquina,
mesmo IP, mesma sessão logada. Login simultâneo de duas geografias é o sinal mais direto
de restrição.

---

## Fase 0 — warm-up (14 dias, antes de qualquer post de oferta)

| Dia | O que fazer | Limite |
|---|---|---|
| 1-2 | Criar a conta **no celular**, na rede de casa. Foto, bio, nome de exibição com palavra-chave. Nenhum post | — |
| 1-14 | Navegar como gente: abrir o feed, ver stories, salvar posts do nicho, comentar de verdade | 10-15 min/dia |
| 3-7 | Seguir contas do nicho manualmente | **5-10/dia** |
| 4 | Primeiro post: **1 carrossel** sem link, sem oferta, sem CTA de venda | 1 |
| 6, 9, 12 | Mais 3 posts, alternando carrossel e reel | 1 por dia de post |
| 8-14 | Aumentar follows | até 20-30/dia no fim da 2ª semana |
| **A partir do dia 8** | Só então qualquer menção a serviço/oferta | — |

Regras duras do warm-up:
- **nada de link de oferta nos primeiros 7 dias** — o algoritmo lê como spam e o shadowban
  é praticamente imediato;
- **nada de DM automatizada**, nunca — é o vetor nº 1 de banimento;
- **não pular de 1 post a cada 2 dias para 3 por dia** — mudança brusca de cadência é
  comportamento de bot; a subida é ao longo de semanas;
- se a conta já foi banida nesse aparelho antes, o novo perfil é sinalizado **mais rápido**,
  não mais devagar.

---

## Fase 1 — regime de cruzeiro

- **3 reels + 2 carrosséis por semana**, nunca dois posts no mesmo horário do dia.
- Publicar em horários variados dentro da janela em que a audiência está online.
- Responder comentário e DM **manualmente** e rápido — conversa de mão dupla é sinal
  rankeado desde março/2026.
- Nenhuma ação em rajada: entre uma publicação e a próxima interação, minutos, não segundos.

---

## Procedimento de publicação — carrossel (até 20 slides)

1. Confirmar que os arquivos estão prontos em `social/out/<peça>/` e que passaram no
   checklist de qualidade (seção 6 da pesquisa).
2. Abrir `instagram.com`, confirmar que a sessão já está logada (**não** fazer login novo
   dentro de automação; a sessão é estabelecida por você, na mão).
3. `Criar` → `Publicação` → selecionar os arquivos **na ordem** — o corte de todos segue o
   aspecto do **primeiro**, então o slide 1 define o enquadramento (4:5, 1080x1350).
4. Colar a legenda de `fila.json`. Primeiras duas linhas com as palavras que a pessoa
   digitaria na busca — é o que rankeia hoje, não hashtag.
5. Alt-text em cada slide (campo em *Configurações avançadas*): é indexável e é
   acessibilidade de verdade.
6. 3-5 hashtags relevantes no fim. Mais que isso derruba.
7. Publicar. **Conferir o post publicado na tela** — ordem dos slides, corte, quebra de
   linha da legenda — e registrar o link em `fila.json`.

## Procedimento — reel

1. O MP4 precisa sair pronto: 1080x1920, H.264, legenda **queimada**, som já embutido
   (a web não dá acesso à biblioteca de áudio do Instagram).
2. `Criar` → `Publicação` → arrastar o MP4 → escolher o frame de capa (a web só permite
   frame do próprio vídeo; se a capa importa, o primeiro frame já tem que ser a capa).
3. Legenda, mesmos critérios do carrossel.
4. Marcar `Também compartilhar no Facebook` só se a página existir.

**Quando o reel precisa de áudio de tendência:** não sai pelo navegador. Duas saídas:
(a) exportar o MP4, mandar para o celular e publicar pelo app escolhendo o som;
(b) publicar como rascunho no app e finalizar lá. Trending audio não existe na web.

---

## Fila de publicação

`social/browser/fila.json` é o que eu leio para saber o que publicar:

```json
[
  {"id": "2026-09-15-beto-reveal",
   "tipo": "reel",
   "arquivo": "social/out/beto-reveal.mp4",
   "legenda": "...",
   "quando": "2026-09-15T19:00-03:00",
   "estado": "pronto",
   "link": null,
   "metricas": null}
]
```

`estado`: `rascunho` → `pronto` → `publicado`. Depois de publicar eu preencho `link` e,
na semana seguinte, `metricas` (views, alcance, saves, sends lidos na tela do Insights).

---

## Sinais de alerta — parar e esperar

- queda súbita de alcance num perfil que vinha bem (costuma anteceder restrição em dias);
- aviso de "comportamento automatizado" → **parar tudo por 7 dias**, publicar só pelo app,
  na mão;
- pedido de verificação/checkpoint fora do normal;
- comentário ou seguidor sumindo.

Em qualquer um deles: publicação volta a ser 100% manual pelo celular por uma semana,
depois retoma no ritmo mais baixo.
