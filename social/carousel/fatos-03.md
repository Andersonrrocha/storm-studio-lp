# Verificação de fatos — carrossel 03 "O que sai do laboratório" (08/09/2026)

| Slide | Afirmação | Fonte | Estado |
|---|---|---|---|
| 1 | tela: Horine mobile | captura 08/09 | ✓ real |
| 1 | fundo: macro de circuito em cobre | **gerado**, cenário, rotulado | gerado |
| 3 | "Sites que fazem sua empresa parecer grande" / "não template requentado" | landing, literal | ✓ |
| 4 | "Um dado, um lugar" | landing: "API como fonte única da verdade" (reescrito sem jargão) | ✓ |
| 4 | Horine desktop, "produto próprio" | captura 08/09 | ✓ |
| 5 | "categorizar transações, ler e-mail, gerar documento" | WIMM: "categorização de transações assistida por IA" (portfólio); Hermes: leitura de e-mail pelo Microsoft Graph, geração de currículo/carta em PDF (ficha) | ✓ |
| 6 | "humano no loop… aprova pelo Telegram" | ficha storm-hermes: "chama o humano ao Telegram nos pontos que exigem julgamento" | ✓ |
| 6 | "roda 24/7 numa VPS desde junho" | ficha: status ativo, desde 2026-06, VPS storm-vps | ✓ |
| 6 | "caça vaga, prospecta lead, vigia preço" | ficha (tagline) | ✓ |
| 7 | "Horine, WIMM, GymFlow — em uso real" | landing "3 produtos no lab, em uso real"; atlas: WIMM e GymFlow "pausado" | ⚠ conferir com o Anderson se "em uso" ainda vale para os três |
| 8 | "'ainda não sei, quero conversar' é a opção que mais gente escolhe" | **não verificável** (não há dado de envios do formulário) | ✗ → reescrito: "está no meu formulário como opção, de propósito" (verificável: campo do formulário) |
| 9 | "1 cliente entregue · 3 produtos · 0 templates" | landing, literal ("Sob medida zero templates", "3 produtos", "1 cliente entregue") | ✓ |

## Ciclo 1 — o que mudou (3 críticos, Sonnet)
- Capa: "da planilha" → "do improviso" (cobre os 4 serviços).
- Slide 6: sem "VPS"/"humano no loop"/"caça vaga"; imagem (orbe do Hermes não provava as tarefas) → bloco de código com os scripts reais de `storm-hermes/deploy/` (jobhunt-sync, kairos-filter-daily, ingest-memory, data-sync).
- Slide 7: "três em uso real" → "Horine e WIMM em uso; GymFlow ainda no laboratório" (index.html: "GymFlow · em desenvolvimento"); imagem: os 3 cards do Lab (antes era o card do Beto Chaves).
- Slide 9: "3" → "2 produtos em uso". **Gate:** WIMM consta "em produção" na landing e "pausado" no atlas — confirmar com o Anderson.
- Slide 11: CTA único; "comenta o ramo" foi para a legenda.
- Aviso dos críticos: catálogo de 4 serviços é o formato que menos gera envio; alternativa = 4 peças SOB MEDIDA, uma por serviço.

## Ciclo 2
- Slide 6: bloco de código com os helpers reais de lead/preço/agenda/memória (`config/helpers/leadgen-cnpj.py`, `argos_busca.py`, `hestia-agenda.py`, `deploy/ingest-memory.sh`) — agora o código mostra o que a frase cita. Slide 7: título 'Três produtos. Dois já em uso real.' e kicker sem número (não é um 5º serviço).
- Slides 7 e 9: recontagem pelos rótulos reais da landing — Horine (no ar, seção 'sinais'), WIMM ('em produção'), Hermes ('em operação') = 3 em uso; GymFlow ('em desenvolvimento'). O texto do 7 agora cita os três cards visíveis. **Gate mantido:** WIMM consta 'pausado' no atlas — confirmar 'em produção' com o Anderson.
- Slide 2 ('o custo') deixa de usar o molde da virada (raio grande só no slide 9, como manda o GUIA §2).
- Slide 5: recorte do card do WIMM termina no rótulo 'WIMM · em produção' (sem frase pela metade — o CSS `object-fit: cover` cortava de novo).
- Slide 3: mesma correção do carrossel 01 — título do Beto Chaves completo.
- Voz do estúdio (08/09): slide 6 sem os scripts/agentes internos — bloco passa a ser um **exemplo de fluxo** (rotulado 'exemplo', não material real). Slide 7/9 em 'o estúdio'.
- Slide 3: o site do cliente quebra 'COMPLEXIDADE' em 'COMPLEXIDAD/E.' em qualquer largura (coluna fixa) — recorte termina depois de 'AO AUTOMOTIVO' para não expor a quebra nem cortar frase no meio.
