# Verificação de fatos — carrossel 04 "Do esboço ao deploy" (08/09/2026)

| Slide | Afirmação | Fonte | Estado |
|---|---|---|---|
| 1 | tela: seção "Do esboço ao deploy" | captura 08/09 | ✓ real |
| 1 | fundo: céu de tempestade | **gerado**, cenário, rotulado | gerado |
| 3 | briefing de três campos (nome, o que você precisa, sobre o projeto) | formulário da landing (captura) | ✓ |
| 4 | tokens do globals.css do Beto Chaves | repo beto-chaves-lp | ✓ |
| 4 | "você aprova antes de eu construir" | landing (β Desenhar: "decisões documentadas, trade-offs explícitos") + prática | promessa do Anderson — confirmar |
| 5 | "commits que você pode ver, com data e o que mudou" | captura real de github.com/Andersonrrocha/storm-studio-lp/commits (repo público). **Repos de cliente são privados** (beto-chaves-lp): o cliente vê por acesso concedido ou por deploy, não por página pública | ⚠ → reescrito: "recebe o registro do que mudou a cada entrega… como no meu próprio repositório" |
| 6 | "publicação automática a cada mudança, com registro" | GitHub Actions do storm-studio-lp (captura real, 14 runs) | ✓ para o próprio site; para cliente depende da hospedagem (Beto Chaves: "deploy não implantado a partir deste repositório") | ⚠ → reescrito: "é assim no meu site, e é assim que eu monto o seu" (promessa de método, não de hospedagem) |
| 7 | "plano e orçamento previsível, por escrito" | landing: "respondo pessoalmente com um plano e um orçamento previsível"; terminal: "entrega completa · custo previsível" | ✓ |
| 9 | "4 etapas: descobrir, desenhar, construir, lançar" | landing, seção processo | ✓ |

## Ciclo 1 — o que mudou (3 críticos, Sonnet)
- "deploy" (jargão proibido pelo GUIA §1.5) → "ao ar" na capa e no resumo. Kickers α/β/γ/δ → 01–04.
- Slides 5 e 6: páginas brancas do GitHub (ilegíveis a 270px, letras cortadas) → blocos de código escuros com conteúdo real: `git log` do storm-studio-lp e o workflow de deploy (14 runs no Actions).
- Slide 6: "é assim que eu monto o seu" → "é o método que eu levo para o seu, dentro da hospedagem que você já usa" (o cliente real não tem publicação automática).
- Slide 7: removida a frase sobre mudança de escopo (sem fonte). **Gates:** "você aprova antes de eu construir" (slide 4) e "valor fechado" (slide 7) são promessas do Anderson — confirmar.
- Slide 8: objeção de preço. Slide 9: "4 etapas" repetido → "14 publicações · nenhuma à mão" (Actions do próprio site, 08/09/2026).
- Capa: navegador subiu para não colidir com o índice; terminal do 7 recortado na proporção da moldura.
- Aviso dos críticos: post de processo sem depoimento — publicar como 3º/4º post, depois de mais uma prova.

## Ciclo 2
- Capa: a captura real da landing mostra 'Do esboço ao deploy' (título da própria seção) ao lado do título corrigido 'ao ar' — recorte passou a mostrar só a linha do tempo. **Sugestão fora do escopo:** trocar o H2 da landing para 'Do esboço ao ar' (mesmo público, mesmo jargão).
- Slide 6: linha '14 publicações' removida do bloco; a revelação do número fica só no slide 9.
- Slide 2 ('o custo') deixa de usar o molde da virada (raio grande só no slide 9, como manda o GUIA §2).
- Slide 7: o terminal da landing é animação (encena um comando), não deploy real — recorte passa a mostrar só a linha 'entrega — completa · custo previsível', que é o que a frase promete. Slide 9: título amarra o número ao medo do slide 2 ('nenhuma te deixando no escuro').
- Capa: navegador menor e mais baixo, sem tocar a linha de swipe nem o rodapé. Slide 6: cabeçalho do bloco encurtado (sem quebra).
- Voz do estúdio (08/09): sai o git log e o workflow do próprio site (indiferente para o cliente); entram **exemplos rotulados** de registro de entrega e de publicação. Slide 9 '14 publicações' → depoimento real do Henrique (trecho sobre organização). 'como trabalhamos'.
