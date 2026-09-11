# Verificação de fatos — reel RAIO-X 01 (08/09/2026)

| Beat | Afirmação | Fonte | Estado |
|---|---|---|---|
| gancho | tela do site antigo | Wayback Machine, snapshot 11/01/2024 de betochaves.com.br (captura mobile inteira, 780×4146) | ✓ real |
| contexto | "Oficina com 30 anos" | betochaves.com.br hoje: "+30 anos de oficina" | ✓ |
| contexto | "Site de loja virtual genérica": busca, "Entrar", categorias, "Fale conosco" | visíveis na captura (topo) | ✓ |
| 01 | "Sem produtos em destaque no momento." | texto literal na captura (barra azul, seção POPULAR) | ✓ |
| 02 | foto sem relação com a oficina (chave genérica) | captura: banner com chave de carro que não é da oficina; a origem não é provável, por isso o texto diz "sem relação" e não "banco de imagem" | ✓ |
| 02 | "nem uma avaliação" | captura inteira (780×4146): nenhuma avaliação ou depoimento em toda a página | ✓ por ausência |
| 02 | quadro do Facebook vazio | captura: "Siga-nos no Facebook" com caixa em branco | ✓ |
| 03 | telefone só no fim da página; nenhum WhatsApp, nenhum botão | captura: "(51) 9975-6561" aparece em "Atendimento" (final da 2ª tela) e no rodapé; sem botão, sem WhatsApp em toda a página | ✓ |
| hoje | hero com foto e "30 anos"; botão flutuante do WhatsApp; avaliações do Google (4,5 · 422) | capturas de 07–08/09/2026 do site atual | ✓ |
| fundo | raio vertical em cobre | **gerado** (social/assets/gen/raio-vertical-01.png), cenário, rotulado "imagem de fundo gerada" no topo direito | gerado |
| áudio | whoosh, tiques, batida, clique | sintetizados no ffmpeg (assets/sfx.wav); sem trilha licenciada — adicionar no app | — |

Gates: avisar o Henrique (o reel mostra o site antigo dele); decidir trilha (biblioteca do Instagram só no app).

## Ciclo 1 (3 críticos, Sonnet)
- Copy: 'custava clientes'; 'banco de imagem' → 'sem relação com a oficina'; contexto mais curto (beat 2,6–4,8); saída sem repetir 'RAIO-X no direct'; legenda cabe antes do '…mais'.
- Social: carimbo e varredura já na capa (0,35 s); número na manchete; fade do CTA em 19,3 s para o loop.
- Design: carimbos na moldura (não sobre o print); chips de acerto na moldura inferior; kicker 30/sub 42; rótulo do fundo 22 px; easing distinto no beat antes do clímax.

## Ciclo 2
- Copy: '3 problemas que custavam clientes'; contexto 'como qualquer loja online' (sem 'de ninguém' — origem da foto não é provável; e sem entregar o problema 02 antes da hora).
- Marcações: carimbos ANTES/HOJE, chips 01–03 e chips de acerto ficam na moldura do fone, fora do print (só as caixas ficam sobre a tela).
- Loop: fone final mais alto e varredura mais curta — termina visível antes do fim.

## Verificação final
- Fone 80 px mais curto (base em 1760 px, acima do rodapé em 1804); rodapé com fundo para o fone final passar por trás sem riscar o texto.

## Zona segura e rótulo (decisão do Anderson, 08/09)
- Especificação conferida: 1080×1920 (9:16), 30 fps, H.264 High, AAC 44,1 kHz, 5–8 Mbps; interface do Instagram cobre ~250 px no topo e ~340–450 px na base, mais a coluna de ícones à direita. Texto passa a começar em 270 px; rodapé removido (marca na linha do kicker); fone entre 820 e 1820 px (a parte baixa é decorativa).
- Rótulo 'imagem de fundo gerada' removido da peça; a divulgação fica aqui. Política da Meta exige aviso só para conteúdo fotorrealista que possa enganar — não é o caso de textura abstrata de fundo.
