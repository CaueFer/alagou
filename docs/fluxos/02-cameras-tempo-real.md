# Fluxo 2 — Câmeras em Tempo Real

## Visão Geral

Aba que exibe câmeras ao vivo de pontos estratégicos de Joinville — cruzamentos, vias de drenagem e áreas historicamente sujeitas a alagamentos. Os streams são embarcados diretamente do portal de câmeras da Prefeitura de Joinville; o app não hospeda ou processa vídeo.

---

## Estados da Tela

* **Carregando**: skeleton cards enquanto a lista de câmeras é montada.
* **Com câmeras disponíveis**: grid ou lista vertical de cards com preview e nome do ponto.
* **Câmera indisponível**: card exibe mensagem "Câmera temporariamente indisponível" no lugar do stream.
* **Sem conexão**: banner no topo "Você está offline — câmeras indisponíveis"; cards ficam bloqueados.

---

## Fluxo 2.1 — Navegar pela Lista de Câmeras

1. Usuário toca na aba "Câmeras" na barra de navegação inferior.
2. A tela exibe uma lista vertical de cards, cada um representando uma câmera:
   * Nome do ponto monitorado (ex: "Av. Beira-Rio — Cruzamento Rua XV").
   * Thumbnail estático ou preview do stream ao vivo.
   * Indicador "AO VIVO" quando o stream está ativo.
3. O usuário rola a lista para encontrar a câmera desejada.

---

## Fluxo 2.2 — Assistir a uma Câmera

1. Usuário toca no card de uma câmera.
2. O stream é expandido em tela cheia (ou em modal de tamanho maior) via embed/iframe do portal da Prefeitura.
3. Controles disponíveis:
   * Fechar (ícone "X" ou botão voltar).
   * Rotacionar para paisagem (aproveitando orientação do dispositivo).
4. Tocar fora do player ou no botão fechar retorna à lista.

### Estados do Player

* **Conectando**: spinner sobre o frame enquanto o stream carrega.
* **Ao vivo**: stream em reprodução contínua.
* **Erro de carregamento**: mensagem "Não foi possível carregar esta câmera" com botão "Tentar novamente".

---

## Considerações Técnicas

* O conteúdo das câmeras é controlado integralmente pela Prefeitura de Joinville — o app apenas embarca o endpoint público.
* Não há armazenamento local de vídeo.
* A lista de câmeras disponíveis deve ser mantida em configuração no frontend (array de objetos com `id`, `nome`, `embedUrl`) até haver um endpoint na API para isso.

---

## Componentes de UI Envolvidos

* `CameraList` — lista de cards de câmeras
* `CameraCard` — card individual com nome, thumbnail e indicador "ao vivo"
* `CameraPlayer` — player em tela cheia com iframe do stream
