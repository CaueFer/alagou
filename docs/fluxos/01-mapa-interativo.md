# Fluxo 1 — Mapa Interativo

## Visão Geral

Tela principal e ponto de entrada do app. Exibe um mapa full-screen centrado em Joinville com todos os alertas ativos representados por marcadores coloridos por severidade.

---

## Estados da Tela

* **Carregando**: spinner centralizado enquanto busca alertas ativos via `GET /api/alertas`.
* **Com alertas**: marcadores coloridos sobre o mapa; botão flutuante "+" visível.
* **Sem alertas**: mapa limpo; botão "+" visível; mensagem sutil "Nenhum alerta ativo no momento".
* **Erro de rede**: toast de aviso; mapa continua visível com dados do cache (se disponível via PWA).

---

## Marcadores no Mapa

Cada marcador representa um `Alerta` ativo. A cor indica a severidade:

| Severidade | Cor |
|---|---|
| Moderado | Amarelo |
| Grave | Laranja |
| Crítico | Vermelho |

O marcador também exibe o número de confirmações recebidas.

---

## Fluxo 1.1 — Visualizar Detalhes de um Alerta

1. Usuário toca em um marcador no mapa.
2. Um **bottom sheet** desliza da base da tela com as informações do alerta:
   * Referência visual do local (endereço ou ponto de referência via geocode reverso — nunca coordenadas brutas).
   * Severidade (badge colorido).
   * Tempo restante até expiração (TTL formatado, ex: "Expira em 12 min").
   * Contagem de confirmações (ex: "3 confirmações").
3. O bottom sheet oferece duas ações:
   * **Confirmar** — envia `POST /api/alertas/{id}/confirmar`; reinicia visualmente o TTL.
   * **Pista Limpa** — envia `POST /api/alertas/{id}/pista-limpa`; ao atingir 3 relatos o marcador some.
4. Tocar fora do bottom sheet ou arrastar para baixo o fecha.

### Estados do Bottom Sheet

* **Carregando ação**: botões ficam desabilitados com indicador de progresso enquanto a requisição é enviada.
* **Sucesso de confirmação**: contador de confirmações incrementa; TTL volta para 45 min.
* **3 relatos "Pista Limpa"**: marcador some do mapa e bottom sheet fecha automaticamente.

---

## Fluxo 1.2 — Criar Novo Relato

Acionado pelo botão flutuante "+" no canto inferior direito.

### Passo 1 — Localização

* A localização é capturada automaticamente via GPS do dispositivo (`useGeolocation`).
* Um pin é exibido no mapa indicando o ponto capturado.
* O usuário pode arrastar o pin para ajustar a posição manualmente.

### Passo 2 — Identificação (opcional)

* Campo de texto: "Seu nome (opcional)".
* Se deixado em branco, o relato é exibido como "Anônimo".
* Sem validação de identidade — campo puramente informativo.

### Passo 3 — Fotos

* Botão "Adicionar foto" abre a câmera nativa do dispositivo.
* Apenas fotos tiradas na hora são aceitas (câmera direta, não galeria).
* Mínimo: 0 fotos. Máximo sugerido: 3 fotos.
* Miniaturas das fotos capturadas são exibidas horizontalmente.

### Passo 4 — Severidade

* Três opções visuais em cartões lado a lado:
  * Moderado (amarelo) — "Trânsito lento, cuidado ao passar".
  * Grave (laranja) — "Via parcialmente bloqueada".
  * Crítico (vermelho) — "Via totalmente bloqueada ou risco de vida".
* Apenas uma opção pode ser selecionada.

### Passo 5 — Envio

* Botão "Reportar" envia `POST /api/alertas` com localização, severidade, nome e fotos.
* Após sucesso: modal fecha, mapa centraliza no ponto e exibe o novo marcador.
* Após erro: mensagem de erro inline; usuário pode tentar novamente sem perder os dados preenchidos.

---

## Componentes de UI Envolvidos

* `MapView` — mapa interativo via MapCN, centrado em (-26.3044, -48.8456)
* `AlertMarker` — marcador colorido com contagem de confirmações
* `AlertDetailSheet` — bottom sheet de detalhes e ações
* `NewReportModal` — modal/sheet de criação de relato
* `SeveritySelector` — seletor visual de severidade

## Hooks Envolvidos

* `useAlertas` — busca e refresca lista de alertas ativos
* `useGeolocation` — captura posição GPS do dispositivo
* `useConfirmacao` — envia confirmação ou relato de pista limpa
