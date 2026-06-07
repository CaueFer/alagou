# Fluxo 3 — Avisos da Defesa Civil

## Visão Geral

Aba dedicada a avisos oficiais emitidos pela Defesa Civil de Joinville. O conteúdo é institucional e unidirecional — o usuário apenas lê; não há ação de resposta ou confirmação disponível nesta tela.

A aba exibe um **badge numérico** no ícone da navegação inferior quando há avisos ativos não lidos, funcionando como indicador de urgência.

---

## Estados da Tela

* **Carregando**: skeleton de lista enquanto os avisos são buscados.
* **Com avisos**: lista em ordem cronológica reversa (mais recente no topo).
* **Sem avisos ativos**: ilustração e texto "Nenhum aviso ativo no momento. Joinville está segura.".
* **Erro de rede**: mensagem de erro com botão "Tentar novamente"; exibe cache local se disponível.

---

## Fluxo 3.1 — Visualizar Lista de Avisos

1. Usuário toca na aba "Defesa Civil" na barra de navegação inferior.
2. A tela exibe a lista de avisos em ordem do mais recente para o mais antigo.
3. Cada item da lista mostra:
   * Nível de risco (badge colorido): Atenção (amarelo), Alerta (laranja), Emergência (vermelho).
   * Título resumido do aviso.
   * Data e hora de emissão.
   * Primeira linha do texto (truncada).
4. O usuário rola a lista para ver todos os avisos.

---

## Fluxo 3.2 — Ler um Aviso Completo

1. Usuário toca em um item da lista.
2. A tela navega para a tela de detalhe do aviso (ou abre um bottom sheet expandido).
3. O detalhe exibe:
   * Título completo.
   * Nível de risco (badge).
   * Data e hora de emissão.
   * Órgão emissor ("Defesa Civil de Joinville").
   * Texto completo do aviso.
   * Área de abrangência geográfica (quando disponível).
   * Instruções à população (quando presentes no aviso).
4. Botão "Voltar" ou gesto de swipe retorna à lista.

---

## Badge de Notificação

* O badge aparece no ícone da aba "Defesa Civil" quando há 1 ou mais avisos com nível "Alerta" ou "Emergência" emitidos nas últimas 24 horas.
* O badge é removido automaticamente após o usuário abrir a aba.
* O número exibido representa a quantidade de avisos ativos não visualizados.

---

## Integração com Dados Externos

A Defesa Civil de Joinville é uma das integrações planejadas na API (ver `api/CLAUDE.md`). Enquanto o endpoint oficial não estiver disponível, a tela pode exibir dados mockados ou uma mensagem de "em breve".

O backend consumirá avisos da Defesa Civil via job agendado (`@Scheduled`) com frequência de 10 minutos, criando alertas com `usuarioId = null` para indicar fonte oficial.

---

## Componentes de UI Envolvidos

* `CivilDefenseList` — lista de avisos
* `CivilDefenseCard` — card de item individual com badge de nível
* `CivilDefenseDetail` — tela ou bottom sheet de detalhe completo
* `RiskBadge` — badge reutilizável de nível de risco (Atenção / Alerta / Emergência)
