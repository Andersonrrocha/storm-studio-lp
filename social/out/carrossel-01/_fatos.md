# Verificação de fatos — carrossel 01 (07/09/2026)

| Slide | Afirmação | Fonte | Estado |
|---|---|---|---|
| 2 | "30 anos de história" | betochaves.com.br mostra "+30 anos de oficina" | ✓ |
| 2 | "nosso site estava desatualizado e não refletia a credibilidade da empresa" | depoimento do Henrique na landing stormstudio.dev, literal | ✓ |
| 3 | "Zero biblioteca de interface" | beto-chaves-lp/package.json: só next, react, react-dom | ✓ |
| 3 | tokens --yellow #F5B400, --black #1A1A1A, --red #E63946, --cream #F5F2EA | beto-chaves-lp/app/globals.css | ✓ |
| 3 | "amarelo da fachada", "fita de perigo" | foto real da fachada é amarela; ficha do projeto cita fita de perigo | ✓ |
| 4 | fotos reais (fachada) | captura de betochaves.com.br | ✓ |
| 5 | botão de WhatsApp flutuante com mensagem pré-preenchida | ficha do projeto + captura (botão visível) | ✓ |
| 6 | "Nota 100 em SEO nas duas páginas" | Lighthouse mobile 07/09: betochaves SEO 100 / a11y 96 / CLS 0; stormstudio SEO 100 / best-practices 100 / TBT 0 ms | ✓ o número; **✗ a leitura**: Lighthouse SEO é auditoria técnica (title, meta, links, mobile) — não mede posição no Google. A frase "quem procura encontra antes de qualquer anúncio pago" é exagero e precisa sair |
| 6 | performance/velocidade | betochaves mobile: perf 68, LCP 10,9 s, 2,8 MB | **não usar** |
| 7 | "As 4 cidades" Esteio, Canoas, Sapucaia do Sul, São Leopoldo | beto-chaves-lp/lib/site.ts (a ficha dizia 6 — errado) | ✓ o fato; relevância questionada pelo Anderson |
| 8 | "a tempestade reage ao scroll" | ficha storm-studio-lp | ✓ |
| 8 | "o terminal roda o deploy" | a landing tem um bloco de terminal **animado** que encena `storm new … deploy → produção no ar`; não é deploy real | ambíguo — reescrever ("mostra"/"encena") |
| 10 | citação "Passamos a contar com um layout moderno que transmite segurança, um fator essencial no nosso ramo." | depoimento literal (trecho) na landing | ✓ |
| 10 | Henrique · Beto Chaves · Esteio/RS · +30 anos · betochaves.com.br | landing + site do cliente | ✓ |
| 2/7 | "Quem chega julga em segundos", "o Google só acha o que está escrito" | heurística/simplificação sem fonte | opinião — manter só como voz, não como dado |

Candidato para substituir o slide 7: "A página segue o que mais vende: chave automotiva primeiro" — decisão real do projeto (ficha: bloco de autoridade automotiva logo após o hero; grelha de serviços com o automotivo dominante).

## Re-verificação (2ª rodada de Lighthouse, mobile + desktop, 07/09/2026 à noite)

| Site | Modo | SEO | Auditorias de SEO falhas | title / meta description | A11y | CLS | Perf (não usar — varia 20 pontos entre rodadas) |
|---|---|---|---|---|---|---|---|
| betochaves.com.br | mobile | **100** | nenhuma | ✓ / ✓ | 96 | 0 | 68 → 83 |
| betochaves.com.br | desktop | **100** | nenhuma | ✓ / ✓ | 96 | 0 | 63 |
| stormstudio.dev | mobile | **100** | nenhuma | ✓ / ✓ | 96 | 0,001 | 86 → 93 |
| stormstudio.dev | desktop | **100** | nenhuma | ✓ / ✓ | 96 | 0,002 | 68 |

Conclusão: "100 em SEO nas duas páginas" é fato estável (4 de 4 rodadas, zero auditoria falha).
O que o número significa: o checklist técnico do Google (título, descrição, links rastreáveis,
mobile, robots) — **não** posição de busca. A copy tem de dizer isso, não mais que isso.

## Fatos novos no ciclo 1

| Slide | Afirmação | Fonte | Estado |
|---|---|---|---|
| 2 | "Era este." — tela do site antigo | Wayback Machine, snapshot de 11/01/2024 de betochaves.com.br (template de loja virtual: busca, "Entrar", "Sem produtos em destaque no momento") | ✓ captura real, não montagem |
| 7 | "Chave automotiva é o carro-chefe… primeiro bloco depois da fachada e o maior da grade" | ficha ~/Projects/storm-atlas/projects/beto-chaves-lp.md: "Bloco de autoridade automotiva — o carro-chefe do negócio, colocado imediatamente a seguir ao hero"; "grelha de serviços… com o automotivo dominante"; captura da seção confirma | ✓ |
| 6 | "checklist técnico do próprio Google: título, descrição, cada serviço, leitura no celular" | auditorias da categoria SEO do Lighthouse (document-title, meta-description, crawlable links, viewport/font-size/tap-targets) — todas passando | ✓ |
| 8 | "o terminal encena o deploy" | bloco de terminal animado da landing | ✓ (corrigido de "roda") |

## Ciclo 1 — o que mudou (07/09/2026)
Copy: capa com promessa ("6 decisões, com a tela real →"); slide 2 vira "o site de antes" com o Wayback; slide 6 reescrito honesto (checklist técnico, não ranking; "100 /100 · seo"); slide 7 trocado (cidades → "o que mais vende vem primeiro"); slide 8 sem "roda o deploy" e sem "craft"; slide 9 com a objeção de preço; slide 11 itens 4 e 5; slide 12 com fallback "não tem site? manda o Instagram"; legenda com pedido de envio, gatilho de comentário e hashtags de dono/local.
Design: fones dos slides 1/2/5/10 reenquadrados (botão do WhatsApp visível); raio duplicado removido do seam e o da virada com contorno (espelhado no 9); número com unidade; bloco de código centrado; botão do CTA em mono com canto 8px como na landing.

## Ciclo 2 — o que mudou
Estrutura: slide 2 com carimbo "ANTES · JAN/2024" e slide 3 (fachada nova) com carimbo "HOJE" logo em seguida — troca 3↔4, CSS explica depois da revelação. Slide 8 deixa de ser o site do Storm (quebrava o quadro "6 decisões deste site" e exigia jargão) e vira "Prova, não adjetivo": avaliações reais do Google dentro da página (4,5 · 422, com nome). Slide 10 só tipografia.
Copy: slide 6 sem causalidade que o Lighthouse não sustenta ("pronta para o Google ler… ele mostra sua empresa errado — ou não mostra"); slide 7 sem "grade"/"maior" (a captura prova "primeiro bloco depois da fachada"); legenda com menos pedidos (envio + comentário + RAIO-X), "respondo pessoalmente", #sapucaiadosul.
Design: raio da virada recortado acima do rodapé; linha de dados do 6 sem viúva; fone do site antigo sem halo cobre; recorte do 5 termina na seção escura; assinatura do 10 em 3 linhas.
Fato novo (slide 8): "4,5 de 422 pessoas" — bloco de avaliações do Google na página betochaves.com.br, captura de 07/09/2026. ✓

## Ciclo 3 — correções de fato
| Slide | Antes | Problema | Agora |
|---|---|---|---|
| 3 / 11 | "A fachada, a bancada, o carro" | no repo do cliente só há `fachada.jpeg` como foto de lugar; chave e carimbo são imagens de produto; não existe foto de bancada nem de carro | "A fachada como ela é na rua — não foto de banco de imagem" |
| 2 / legenda | "me disse no primeiro contato" / "Esse foi o briefing" | a citação é do depoimento pós-projeto, não do briefing | "me resumiu assim" / "Esse era o problema" |
| 8 | captura com a barra fixa carimbada no meio das avaliações | artefato de captura de página inteira | recapturado com elementos fixed/sticky ocultos; "4,5 estrelas em 422 avaliações" |

## Pós-ciclo 3 (08/09/2026)
- Slide 3: a captura de viewport cortava o título do site em 'TÉCNICO DE ALTA'; agora usa a captura de página inteira com a frase completa ('…ALTA COMPLEXIDADE').
- Voz do estúdio (08/09): 'me resumiu' → 'resumiu'; CTA e legenda em 'a gente'; assinatura 'Storm Studio'.
- Slide 3: o site do cliente quebra 'COMPLEXIDADE' em 'COMPLEXIDAD/E.' em qualquer largura (coluna fixa) — recorte termina depois de 'AO AUTOMOTIVO' para não expor a quebra nem cortar frase no meio.
