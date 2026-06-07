# Fluxo 5 — Perfil e Configurações

## Visão Geral

O app não tem login. Esta aba é inteiramente de **configurações do dispositivo** — preferências locais que afetam como o app se comporta naquele aparelho. Não há dados sincronizados com o backend.

---

## Estrutura da Tela

A tela é dividida em seções agrupadas:

1. Notificações
2. Exibição
3. Sobre o app

---

## Fluxo 5.1 — Configurar Notificações Push

1. Usuário acessa a seção "Notificações".
2. Se o app ainda não tem permissão de notificação no dispositivo: banner no topo da seção com botão "Ativar notificações". Ao tocar, o sistema solicita a permissão nativa.
3. Se a permissão foi negada: banner informativo com instrução para ativar nas configurações do sistema; toggles desabilitados.
4. Se a permissão foi concedida: os três toggles estão habilitados.

### Toggles disponíveis

* **Alertas de cidadãos próximos** — notifica quando um novo alerta crowdsource é criado dentro do raio configurado.
  * Sub-opção visível quando ativo: seletor de raio em km (1 km / 3 km / 5 km / 10 km).
* **Alertas climáticos** — notifica ao receber dados de sensor indicando risco de alagamento.
* **Avisos graves da Defesa Civil** — notifica imediatamente ao receber aviso de nível "Emergência".

---

## Fluxo 5.2 — Configurar Exibição

1. Usuário acessa a seção "Exibição".
2. Opções disponíveis:
   * **Tipo de mapa**: seletor entre "Padrão" e "Satélite". Altera o tile layer do MapCN na tela do mapa.
   * **Distâncias**: toggle entre quilômetros e metros para exibição de distâncias no app.

---

## Fluxo 5.3 — Sobre o App

Seção informativa sem interações críticas:

* Versão do app (ex: "v1.0.0").
* Repositório: link para o GitHub do projeto.
* Créditos: "Desenvolvido por Cauê Fernandes".
* Fonte de dados: lista das fontes externas utilizadas (Prefeitura de Joinville, CEMADEN, Defesa Civil).
* Botão **"Reportar um problema"**: abre o formulário de issue do GitHub ou link de contato.

---

## Persistência

Todas as preferências desta tela são salvas no `localStorage` do navegador (ou `AsyncStorage` em contexto PWA). Não há sincronização com a API — as configurações são locais ao dispositivo.

---

## Componentes de UI Envolvidos

* `SettingsPage` — tela principal
* `NotificationSettings` — grupo de toggles de notificação com sub-opções
* `DisplaySettings` — grupo de opções de exibição
* `AppInfo` — seção de informações e créditos
* `RadiusSelector` — seletor de raio de notificação
