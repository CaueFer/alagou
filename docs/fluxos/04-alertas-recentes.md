# Fluxo 4 — Alertas Recentes

## Visão Geral

Feed unificado com os alertas mais recentes de Joinville, independente de origem. Reúne em uma única lista três tipos de alerta, cada um identificado por uma cor distinta. O objetivo é dar ao usuário uma visão cronológica rápida do que está acontecendo — sem precisar abrir o mapa.

---

## Tipos de Alerta e Cores

| Tipo | Cor | Origem |
|---|---|---|
| Crowdsource | Azul | Relatos de cidadãos via app |
| Climático | Ciano / Teal | Dados meteorológicos e sensores (CEMADEN, marés) |
| Defesa Civil grave | Vermelho | Avisos críticos da Defesa Civil de Joinville |

A cor aparece em: borda lateral do card, ícone de tipo e label de identificação.

---

## Fluxo 4.1 — Legenda de Cores

Uma legenda fixa é exibida no topo da tela, abaixo do título "Alertas Recentes", com três chips lado a lado:

* Chip azul + label "Cidadãos"
* Chip ciano + label "Climático"
* Chip vermelho + label "Defesa Civil"

A legenda é sempre visível, mesmo ao rolar a lista, para que o usuário não precise memorizar o código de cores.

---

## Estados da Tela

* **Carregando**: skeleton de 3 cards enquanto o feed é buscado.
* **Com alertas**: lista ordenada por horário de emissão (mais recente no topo).
* **Sem alertas**: mensagem "Nenhum alerta recente. Joinville está tranquila no momento.".
* **Erro de rede**: mensagem de erro com botão "Atualizar"; cache local exibido se disponível.

---

## Fluxo 4.2 — Navegar pelo Feed

1. Usuário toca na aba "Alertas" na barra de navegação inferior.
2. A legenda de cores é exibida no topo (ver 4.1).
3. Abaixo da legenda: chips de filtro rápido (ver 4.3).
4. A lista de cards é exibida em ordem cronológica reversa.
5. Cada card contém:
   * Borda lateral colorida conforme o tipo do alerta.
   * Ícone de tipo (crowdsource, climático ou Defesa Civil).
   * Label do tipo ("Cidadãos", "Climático" ou "Defesa Civil").
   * Local do alerta (endereço ou referência visual).
   * Horário de emissão (ex: "Há 5 minutos" ou "14h32").
   * Resumo do alerta (uma linha truncada).
6. O usuário rola para ver alertas mais antigos.

---

## Fluxo 4.3 — Filtrar por Tipo

1. Abaixo da legenda há três chips/toggles: "Cidadãos", "Climático", "Defesa Civil".
2. Por padrão, todos os filtros estão ativos (todos os tipos visíveis).
3. Ao tocar em um chip, ele é desativado e os alertas daquele tipo somem da lista.
4. Ao tocar novamente, o chip é reativado e os alertas voltam.
5. É possível ativar/desativar múltiplos filtros simultaneamente.
6. Se todos os filtros forem desativados: mensagem "Selecione ao menos um tipo de alerta.".

---

## Fluxo 4.4 — Ver Detalhes de um Alerta

1. Usuário toca em um card do feed.
2. O comportamento varia conforme o tipo:
   * **Crowdsource**: abre o bottom sheet de detalhes do alerta (mesmo componente do mapa), com ações "Confirmar" e "Pista Limpa".
   * **Climático**: abre modal informativo com dados da fonte (sensor, nível do rio, etc.) e link para a fonte oficial quando disponível.
   * **Defesa Civil grave**: navega para a tela de detalhe completo do aviso (mesmo componente do Fluxo 3.2).

---

## Componentes de UI Envolvidos

* `AlertFeed` — lista principal do feed
* `AlertFeedCard` — card de item com borda colorida e metadados
* `AlertTypeLegend` — legenda fixa de cores no topo
* `AlertTypeFilter` — chips de filtro por tipo
* `AlertDetailSheet` — bottom sheet reutilizado do Fluxo 1 (alertas crowdsource)
* `CivilDefenseDetail` — detalhe reutilizado do Fluxo 3 (alertas Defesa Civil)
