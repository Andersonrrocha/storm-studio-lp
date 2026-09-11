# Verificação de fatos — carrossel 02 "Você fala com quem constrói" (08/09/2026)

| Slide | Afirmação | Fonte | Estado |
|---|---|---|---|
| 1 | tela: hero mobile de stormstudio.dev | captura 07/09 | ✓ real |
| 1 | fundo: raio vertical em cobre | **gerado** (ChatGPT, social/assets/gen.py), cenário | gerado, rotulado no slide |
| 2 | "briefing passa por três mãos" | opinião/voz | opinião |
| 3 | "quatro etapas, a mesma pessoa" | landing: processo α/β/γ/δ; PRODUCT.md "estúdio pessoal de Anderson Rocha" | ✓ |
| 4 | "Sete anos, cinco empresas, uma linha contínua" | andersonrocha.dev/pt: "Sete anos, cinco empresas, uma linha contínua" (literal); trajetória 2019–2026 | ✓ |
| 4 | "portal para mais de 4 milhões de usuários" | portfólio: Compasso UOL 2019–21, "cliente de serviços financeiros (mais de 4 milhões de usuários)" | ✓ |
| 4 | "plataforma reconstruída para 27 países" | portfólio: Singular Apps 2023–25 | ✓ |
| 4 | "onboarding para 6 milhões de consultores" | portfólio: Thoughtworks 2021–23, "mais de 50 países e 6 milhões de consultores" | ✓ |
| 4 | recorte do portfólio sem o nome do empregador atual | decisão: não citar empregador atual em marketing do estúdio — **gate do Anderson** | decisão |
| 5 | "três produtos no laboratório, em uso real: agenda, finanças, treino" | landing: "3 produtos construídos no lab, em uso real" (Horine, WIMM, GymFlow) | ✓ (WIMM e GymFlow constam como "pausado" no atlas — "em uso real" é a frase da landing; verificar se ainda vale) |
| 6 | Horine: reservas, equipe, bloqueios, página pública; no ar em horine.stormstudio.dev | ficha schedule-sass + captura 08/09 (200) | ✓ |
| 7 | "primeiro cliente entregue: oficina de 30 anos"; "Um, não trinta" | landing "1 cliente entregue"; betochaves.com.br "+30 anos" | ✓ |
| 8 | tokens --bg #05060a, --cyan #fb923c, --flash #fff4e6, --fd Space Grotesk | styles.css da landing | ✓ (nota: o token chama-se `--cyan` mas vale cobre) |
| 9 | "resposta em horas" | landing: "respondo rápido", "respondo pessoalmente" — sem SLA medido | opinião/promessa do Anderson — confirmar |
| 10 | citação do Henrique | landing, literal | ✓ |

## Ciclo 1 — o que mudou (3 críticos, Sonnet)
- Slide 5: "três produtos em uso real: agenda, finanças, treino" → "um em produção, um em operação, um em desenvolvimento: finanças pessoais, agentes de IA, treino" (o card real do Lab diz WIMM · em produção, Hermes · em operação, GymFlow · em desenvolvimento; Horine não está nesse grid).
- Slide 4: sem "frontends"/"onboarding"; ponte para o negócio pequeno; recorte termina antes dos botões.
- Slide 7: hero recapturado sem o botão flutuante; fone em pose diferente do 6.
- Slide 9: "resposta em horas" (sem medição) → tese nova: quem vendeu ≠ quem constrói ≠ quem conserta; aqui é a mesma pessoa, com nome, site e telefone.
- Slide 11: resumo institucional → "6 perguntas para quem vai fazer seu site" (o leitor leva algo).
- Legenda: pedido de envio mais amplo + gatilho de comentário.
- Bug de CSS corrigido: rótulo "imagem de fundo gerada" não aparecia (regra `.bgimg + *` sobrescrevia o `position:absolute`).
- Aviso dos críticos sociais: "sobre nós" é o arquétipo mais fraco em alcance (BENCHMARK achado 2); ordem sugerida na semana: depois de mais um case ou de um reel RAIO-X.

## Ciclo 2
- Marketing: NADA MATERIAL. Polimentos: slide 9 sem 'a única coisa'; legenda 'mais de 4 milhões'.
- Slide 2 ('o custo') deixa de usar o molde da virada (raio grande só no slide 9, como manda o GUIA §2).
- Slide 4: recorte inclui a frase inteira do portfólio ('…tranquilidade em produção.').
- Voz do estúdio (08/09): slides 3/4/5 deixam de apresentar o Anderson ('uma pessoa', portfólio) e passam a apresentar o estúdio: sob medida, 'mais de 8 anos, Brasil e exterior' (**afirmação do Anderson**; o portfólio público diz '7+ anos desde 2019' — a diferença é dele), alinhamento expectativa/necessidade/custo. Slide 7 sem 'um, não trinta'. Virada sem 'estúdio de uma pessoa'.
- Verificação final: slide 3 passa a usar o formulário (as opções de 'o que você precisa' provam 'nasce da necessidade'); slide 5 usa a linha do tempo inteira; slide 4 sem os números do portfólio (não há prova sem expor o Anderson) — fica a frase geral do estúdio; 'nome, site e telefone da Storm'.
