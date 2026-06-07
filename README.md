# RFC: Request for Comments - Projeto Alagou

**Engenharia de Software - Católica SC**

---

# Identificação

- **Título do Projeto:**
  **Alagou** - Plataforma Web de Mobilidade Urbana com Resiliência Climática para Joinville/SC

- **Linha de Projeto (Direction):**
  Web Apps

- **Autor:**
  Caue Fernandes

- **Data da Proposta:**
  24/05/2026

- **Versão:**
  2.0

- **Status:**
  Rascunho (Draft) - em revisão pelo comitê

- **Repositório:**
  https://github.com/CaueFer/alagou

---

# 1. Visão do Produto e Impacto (O Problema)

O objetivo desta seção é responder uma pergunta fundamental:

**Este projeto resolve um problema real ou é apenas um exercício técnico?**

A resposta para o **Alagou** é direta: trata-se de uma plataforma desenhada para mitigar um problema crônico, recorrente e documentado da cidade de Joinville - a falta de informação confiável sobre o estado das vias urbanas durante eventos de alagamento. O impacto esperado é a **redução de acidentes**, a **economia de tempo em deslocamentos** e o **apoio à gestão pública de emergências**.

---

## 1.1 Contexto e Problema

Joinville é o maior município de Santa Catarina e está localizado em uma região com **alta suscetibilidade a alagamentos**, especialmente nas bacias hidrográficas dos rios Cachoeira, Águas Vermelhas e Cubatão. Eventos de chuva intensa, combinados com fenômenos de maré alta (ressaca) que afetam a drenagem urbana, geram bloqueios viários recorrentes que prejudicam a mobilidade de milhares de moradores.

### Quem sofre com o problema

- **Motoristas e motociclistas** que precisam se deslocar durante chuvas intensas e ficam expostos ao risco de entrar em vias alagadas.
- **Motoristas de aplicativo** (Uber, 99, iFood) que dependem da mobilidade urbana para sua renda diária.
- **Equipes da Defesa Civil e Trânsito Municipal**, que operam de forma reativa por falta de dados granulares em tempo real.
- **Cidadãos em geral** que sofrem prejuízos materiais e atrasos por desinformação sobre o estado das vias.

### Em que contexto ocorre

O problema se manifesta com mais intensidade em:

- Períodos chuvosos prolongados (especialmente entre setembro e março).
- Coincidência entre chuva e maré alta no Porto de São Francisco do Sul, o que dificulta a vazão dos rios.
- Horários de pico (início da manhã e final da tarde), quando o impacto na mobilidade é máximo.

### Como o problema é resolvido atualmente

Hoje, o cidadão de Joinville recorre a fontes **dispersas e não integradas**:

1. Publicações em redes sociais (Facebook, Instagram, X/Twitter) de bairros e grupos comunitários - informais, sem padronização e com baixa confiabilidade.
2. Câmeras públicas de monitoramento do portal NDMais - visuais, mas exigem que o usuário saiba exatamente onde olhar.
3. Boletins esporádicos da Defesa Civil - assertivos, porém pouco frequentes e não georreferenciados ao trajeto do usuário.
4. WhatsApp de bairro - alta latência, sem validação coletiva.

### Limitações das soluções atuais

- **Fragmentação:** não há um único ponto de acesso à informação consolidada.
- **Falta de georreferenciamento preciso:** relatos em texto livre dificultam a localização exata do ponto alagado.
- **Ausência de visualização em mapa:** o usuário não consegue planejar trajetos alternativos.
- **Inexistência de validação cruzada:** boatos e informações desatualizadas circulam sem mecanismo de correção.
- **Ausência de dados sobre severidade:** "está alagado" não diferencia entre uma poça transponível e uma via intransitável.

### Exemplos do problema observados em campo

Levantamento realizado em **grupos públicos de Facebook de Joinville** durante eventos chuvosos de fevereiro a abril/2026, mostrando o tipo de informação que circula hoje:

> *"Pessoal, tá alagado lá pelo Bucarein?"* (sem foto, sem rua específica - 12 comentários divergentes em 30 minutos)

> *"Tá tudo parado na Otto Boehm"* - *(resposta após 47 minutos)* *"Já passou, tá liberado"* - *(15 minutos depois)* *"Voltou a alagar agora"*

> *"Alguém sabe se passa carro na Procópio Gomes?"* - sem resposta

Esses três padrões - **falta de geolocalização precisa**, **defasagem temporal das informações** e **perguntas sem resposta** - sintetizam a oportunidade do Alagou.

---

## 1.2 Origem da Demanda e Evidências

A demanda pelo **Alagou** se fundamenta em três pilares de evidência: **registros históricos públicos** dos eventos climáticos em Joinville, **manifestações da comunidade** nas redes sociais durante alagamentos e **observação direta dos processos atuais**.

### Demanda da Comunidade

O projeto se enquadra na modalidade **Projeto Voltado à Comunidade** (conforme PAC Extensionista VII, item 1.2), uma vez que pretende atender uma necessidade pública identificada de forma estruturada na cidade de Joinville.

**Histórico de eventos relevantes:**

- Janeiro de 2024: enchentes no bairro Bom Retiro e Vila Nova com necessidade de remoção de famílias.
- Outubro de 2024: alagamentos generalizados na região central durante chuvas associadas à ressaca de maré.
- Verão de 2025: múltiplos boletins da Defesa Civil de Joinville sobre transbordamento do Rio Cachoeira.

### Pesquisa com Usuários

Foi conduzida uma pesquisa estruturada entre **março e abril de 2026** com o público-alvo do Alagou, combinando questionário online amplo e entrevistas semiestruturadas com motoristas de aplicativo.

#### Questionário online (18 respondentes)

Divulgado em grupos de Facebook locais ("Joinville Alerta", "Eu Amo Joinville", "Motoristas de Joinville e Região") e WhatsApp comunitários de bairros centrais. Amostra inicial exploratória, majoritariamente entre 25 e 55 anos, com proporção equilibrada entre homens e mulheres.

| Pergunta | Resultado |
|---|---|
| Você já entrou em uma rua alagada sem saber que estava alagada? | **16 de 18 (89%)** sim |
| Já sofreu algum prejuízo material por causa de alagamento em via? | **7 de 18 (39%)** sim (de pequenos danos a perda de veículo) |
| Em dias de chuva forte, você se sente seguro para sair com seu veículo? | **4 de 18 (22%)** sim - **14 de 18 (78%)** não |
| Você usaria um app/site que mostre em tempo real onde há alagamentos? | **17 de 18 (94%)** sim, usaria com frequência |
| Você contribuiria com relatos se o processo fosse simples (< 1 min)? | **12 de 18 (67%)** sim - **4 de 18 (22%)** talvez - **2 de 18 (11%)** não |
| O que aumentaria sua confiança em um relato? *(múltipla escolha)* | **14 de 18 (78%)** foto recente do local; **9 de 18 (50%)** validação por outros usuários; **7 de 18 (39%)** dado oficial integrado |
| Você tentaria descobrir o estado de uma rua antes de sair de casa em dia chuvoso? | **15 de 18 (83%)** sim, mas hoje não tem fonte confiável |

**Bairros mais citados como críticos** (questão aberta): Bucarein (9 menções), Bom Retiro (6), Vila Nova (4), Saguaçu (3), América (3), Boa Vista (2), Fátima (2), Iririú (1).

#### Entrevistas semiestruturadas - 5 motoristas de aplicativo

Identidades preservadas; idades e perfis profissionais reais conforme declarado.

| ID | Perfil | Frase representativa |
|---|---|---|
| E1 | Homem, 38 anos, Uber há 4 anos | *"Já tive prejuízo de R$ 1.800 com motor depois de pegar uma rua alagada na Otto Boehm. Não tinha como saber que ia ter."* |
| E2 | Mulher, 29 anos, 99 há 2 anos | *"Se tivesse uma foto eu confiava. Só ler 'tá alagado' eu já não acredito mais - muita gente exagera."* |
| E3 | Homem, 45 anos, ambos os apps | *"O que eu queria saber é se passa carro ou não. Esse negócio de 'leve', 'médio', 'pesado' confunde. Tem que ser direto."* |
| E4 | Mulher, 31 anos, motoboy iFood | *"De moto é pior. Se tiver 20cm de água eu já não passo. Preciso de informação por trecho, não por bairro inteiro."* |
| E5 | Homem, 50 anos, Uber há 6 anos | *"Eu reportaria sim, mas só se for rápido. Se tiver muita pergunta eu desisto e sigo viagem."* |

#### Padrões observados

- **5/5** entrevistados tiveram pelo menos uma experiência negativa direta com via alagada.
- **5/5** declararam que usariam o sistema com frequência diária em períodos chuvosos.
- **4/5** apontaram a **foto** como o elemento que mais aumentaria a confiança no relato.
- **3/5** reforçaram a importância de uma **escala de severidade simples e direta** - o que motivou diretamente o desenho dos 3 níveis (carro passa / só veículo grande / nenhum veículo).
- **5/5** apoiaram a obrigatoriedade da foto, mesmo cientes do custo adicional de captura.
- **3/5** demonstraram preocupação com a velocidade do fluxo de relato (o que motivou a meta de "menos de 4 toques" em RNF14).

### Evidência de Interesse

- **Engajamento orgânico em redes sociais:** levantamento manual realizado durante **7 dias chuvosos entre fevereiro e abril/2026** identificou em média **34 postagens diárias** sobre alagamentos nos grupos analisados, com média de **18 comentários e 27 reações** cada - confirmando interesse ativo, porém fragmentado e sem persistência.

- **Contato com a Coordenadoria Municipal de Defesa Civil:** reunião exploratória conduzida em **15/04/2026**. A coordenadoria demonstrou interesse no recebimento dos dados agregados gerados pela plataforma e indicou que **não existe atualmente sistema unificado de relatos cidadãos integrado às suas operações**. A formalização por carta de intenção está prevista para a próxima etapa do projeto.

- **Feedback espontâneo durante o questionário:** entre os 18 respondentes, **8 deixaram comentários abertos**, dos quais **6 (75%)** eram sugestões construtivas - destacando-se três pedidos repetidos: (i) integração com Waze/Google Maps para abrir rota alternativa, (ii) possibilidade de marcar a área como segura novamente, e (iii) histórico para conferir se um trecho costuma alagar. Os dois primeiros já estão contemplados no escopo (UC06 "Pista Limpa" e link externo para apps de navegação); o terceiro corresponde ao RF15.

---

## 1.3 Análise de Soluções Existentes (Benchmark)

Foram analisadas **cinco soluções** que, em alguma medida, abordam parcialmente o problema da informação sobre vias alagadas. Para cada uma, foram identificados público-alvo, funcionalidades principais e limitações.

### Solução 1 - Waze

- **Link:** https://www.waze.com
- **Público-Alvo:** Motoristas em geral, foco em trânsito urbano.
- **Funcionalidades principais:** Navegação assistida, relatos colaborativos de trânsito, polícia, acidentes e alagamentos como categoria genérica.
- **Limitações:** A categoria "alagamento" é tratada como mais um evento entre dezenas. Não há classificação de severidade (carro passa? Ônibus passa?), não exige foto, não integra dados de sensores de rios ou marés. Em cidades menores como Joinville, a base de usuários é menor e os relatos demoram a aparecer.

### Solução 2 - Google Maps

- **Link:** https://maps.google.com
- **Público-Alvo:** Público geral.
- **Funcionalidades principais:** Mapa, navegação, dados de trânsito em tempo real.
- **Limitações:** Não possui categoria específica para alagamentos. Detecta lentidão, mas não a causa. Não permite relato cidadão direto sobre estado da via.

### Solução 3 - Portal NDMais / Câmeras da Defesa Civil

- **Link:** https://ndmais.com.br
- **Público-Alvo:** Público geral, jornalistas, gestores municipais.
- **Funcionalidades principais:** Transmissão ao vivo de câmeras urbanas em pontos críticos de Joinville.
- **Limitações:** Exige que o usuário saiba exatamente em qual câmera olhar. Não há mapa unificado. Cobertura limitada a pontos pré-definidos. Sem alertas ativos.

### Solução 4 - Aplicativos da Defesa Civil (Defesa Civil Alerta / SGB)

- **Link:** https://www.gov.br/mdr/defesacivil
- **Público-Alvo:** Cidadãos em áreas de risco cadastradas.
- **Funcionalidades principais:** Envio de alertas via SMS e push para CEPs em risco; mapa nacional de emergências.
- **Limitações:** Comunicação unidirecional (do órgão para o cidadão). Não permite relato. Não foca em mobilidade urbana, mas em risco a vidas em áreas de desastre.

### Solução 5 - Grupos de WhatsApp/Facebook de Bairro

- **Público-Alvo:** Moradores de bairros específicos.
- **Funcionalidades principais:** Compartilhamento informal de fotos e relatos.
- **Limitações:** Sem georreferenciamento, sem validação, sem persistência (a mensagem se perde), restritos por adesão a um grupo.

---

### Comparação

| Solução | Pontos Fortes | Limitações |
|---|---|---|
| Waze | Base de usuários ampla; relato colaborativo simples | Sem severidade de alagamento; sem foto obrigatória; sem dados oficiais |
| Google Maps | Cobertura universal; navegação madura | Não trata alagamento como categoria |
| Portal NDMais | Câmeras ao vivo reais | Sem mapa unificado; sem alertas; sem participação cidadã |
| Defesa Civil Alerta | Alerta oficial; abrangência nacional | Comunicação unidirecional; sem foco em mobilidade |
| WhatsApp/Facebook | Engajamento alto; relatos com foto | Sem geolocalização; sem validação; informações se perdem |

---

### Diferencial do Projeto

O **Alagou** se posiciona em uma lacuna ainda não preenchida: ser uma plataforma **especializada, georreferenciada, colaborativa e validada** para alagamentos urbanos. Seus diferenciais são:

1. **Especialização local:** focado na realidade hidrográfica de Joinville (rios Cachoeira, Águas Vermelhas, Cubatão + tábua de marés).
2. **Foto obrigatória no relato:** *(melhoria sugerida pelo professor Walter Theodoro)* - cada reporte exige fotografia tirada no momento, aumentando a credibilidade e permitindo validação visual cruzada.
3. **Indicador de severidade objetivo:** *(melhoria sugerida pelo professor Walter Theodoro)* - o relato informa o nível aproximado da água (carro passa / só ônibus e caminhão passam / via intransitável).
4. **Visualização em mapa com áreas circulares:** *(melhoria sugerida pelo professor Walter Theodoro)* - em vez de pontos isolados, o sistema marca **círculos (raios) na região alagada**, dando ao usuário uma noção espacial da extensão do problema.
5. **Integração com fontes oficiais:** consome sensores de nível dos rios, dados de marés e alertas da Defesa Civil.
6. **Validação coletiva (TTL dinâmico):** relatos têm tempo de vida que se renova com confirmações de outros usuários e se encerra após 3 relatos de "Pista Limpa".

---

## 1.4 Público-Alvo

### Perfil dos Usuários

| Segmento | Perfil | Contexto de Uso | Conhecimento Técnico |
|---|---|---|---|
| **Motoristas e motociclistas comuns** | Moradores de Joinville que se deslocam diariamente de carro/moto | Antes e durante deslocamentos em dias chuvosos | Baixo a médio - usa apps de mapas |
| **Motoristas de aplicativo** | Profissionais de Uber, 99, iFood | Trabalho contínuo na cidade; alta frequência de uso | Médio - familiarizado com múltiplos apps |
| **Agentes da Defesa Civil / Trânsito** | Servidores públicos da Prefeitura de Joinville | Tomada de decisão em sala de operação durante eventos críticos | Médio - usa dashboards e sistemas de informação |
| **Cidadãos colaboradores** | Voluntários, líderes comunitários, moradores engajados | Pontual: reportam quando passam por uma via alagada | Baixo - interface deve ser simples |

### Características gerais do público

- Localização: predominantemente Joinville/SC e região (Araquari, Garuva, São Francisco do Sul).
- Faixa etária esperada: 18 a 65 anos.
- Dispositivos: navegador web em desktop (uso institucional) e navegador mobile (uso em campo) - sistema responsivo é requisito.
- Conexão: 4G/5G em mobilidade; banda larga em estações de monitoramento.

---

## 1.5 Objetivos do Projeto

### Objetivo Geral

Desenvolver uma **plataforma web colaborativa e geoespacial** que centralize informações em tempo real sobre alagamentos nas vias urbanas de Joinville, integrando relatos validados de cidadãos a dados de fontes oficiais, com o propósito de **reduzir o número de incidentes em vias alagadas** e **apoiar a gestão municipal de emergências**.

### Objetivos Específicos

1. **Construir um mapa interativo** que exiba áreas alagadas representadas por círculos georreferenciados, classificadas por severidade (Moderado, Grave, Crítico).
2. **Implementar o fluxo de relato cidadão** com captura obrigatória de foto no momento do registro e indicação do nível da água.
3. **Desenvolver o sistema de validação coletiva** baseado em TTL dinâmico (relatos expiram em 45 minutos se não confirmados e podem ser encerrados via relato "Pista Limpa" após 3 validações).
4. **Integrar fontes oficiais externas** (sensores de rios, tábua de marés do Porto de São Francisco do Sul, alertas SMS da Defesa Civil).
5. **Construir um painel administrativo** voltado à Defesa Civil para visualização agregada e exportação de dados históricos.

---

## 1.6 Métricas de Sucesso (KPIs)

| KPI | Meta | Como medir |
|---|---|---|
| Tempo médio de resposta de API | < 300 ms (p95) | Monitoramento Prometheus/Grafana |
| Disponibilidade do sistema | ≥ 99% mensal | Uptime checks (Better Uptime / Grafana Cloud) |
| Acurácia da classificação de severidade | ≥ 85% de concordância em revisões pares | Amostragem manual mensal |
| Cobertura geográfica em dia de evento | ≥ 70% das vias críticas com pelo menos 1 relato | Comparação contra mapa de pontos críticos da Defesa Civil |
| Tempo entre primeiro relato e exibição no mapa | < 30 segundos | Telemetria de eventos |
| Usuários ativos durante eventos chuvosos | ≥ 200 sessões/dia em eventos críticos | Analytics (Plausible / GA) |
| Taxa de relatos com foto válida | 100% (foto é obrigatória) | Validação no backend |
| Falsos positivos confirmados | < 10% dos relatos publicados | Auditoria amostral |

---

# 2. Engenharia de Requisitos

Esta seção define **o que o sistema fará**.

A engenharia de requisitos do Alagou foi construída em torno do fluxo principal "**relatar → validar → consultar**" e incorpora explicitamente as melhorias sugeridas pelo professor Walter Theodoro (círculo de alagamento no mapa, foto obrigatória, indicador de nível da água).

---

## 2.1 Personas

### Persona 1 - Marcos, o motorista de aplicativo

- **Idade:** 34 anos
- **Profissão:** Motorista de Uber e 99 em tempo integral
- **Contexto:** Roda em média 10 horas por dia em Joinville, sob qualquer condição climática.
- **Objetivos:** Maximizar corridas seguras; evitar danos ao veículo (única fonte de renda).
- **Dificuldades:** Em dias de chuva, perde corridas porque rejeita áreas desconhecidas por receio de alagamento. Já teve o motor afetado por entrar em via inundada.
- **Frase típica:** *"Se eu soubesse que tinha alagamento, eu teria pegado outro caminho."*

### Persona 2 - Helena, a moradora preocupada

- **Idade:** 47 anos
- **Profissão:** Professora de escola pública, mora no bairro Bucarein
- **Contexto:** Usa carro próprio para levar filho à escola e ir ao trabalho. Em dias chuvosos fica ansiosa.
- **Objetivos:** Sair de casa com segurança; saber se a rota habitual está livre.
- **Dificuldades:** Não confia em postagens de Facebook; quer ver uma foto recente do ponto crítico.
- **Frase típica:** *"Eu queria ver com meus olhos se ainda está alagado antes de sair."*

### Persona 3 - Diego, o agente da Defesa Civil

- **Idade:** 41 anos
- **Profissão:** Coordenador de operações na Defesa Civil de Joinville
- **Contexto:** Em eventos críticos, coordena equipes de campo a partir da sala de operações.
- **Objetivos:** Ter visão consolidada em tempo real para decidir onde alocar recursos (bombeiros, bloqueios, sinalização).
- **Dificuldades:** Hoje depende de chamadas de moradores e patrulhamento das equipes; informação chega fragmentada.
- **Frase típica:** *"Preciso de um mapa único que mostre tudo que está acontecendo na cidade agora."*

---

## 2.2 Casos de Uso Principais

Os principais fluxos do sistema são:

1. **UC01 - Criar conta** (cadastro com e-mail e senha; verificação opcional por SMS)
2. **UC02 - Autenticar-se** (login)
3. **UC03 - Visualizar mapa de alagamentos** (sem login, modo público)
4. **UC04 - Reportar alagamento** (login obrigatório; exige foto e nível da água)
5. **UC05 - Confirmar relato de outro usuário** ("Ainda está alagado")
6. **UC06 - Reportar via desbloqueada** ("Pista Limpa")
7. **UC07 - Receber alertas de áreas próximas** (notificação web push)
8. **UC08 - Consultar histórico de relatos** (próprios e da cidade)
9. **UC09 - Acessar painel administrativo** (perfil Defesa Civil)
10. **UC10 - Exportar dados agregados** (relatórios CSV/PDF, perfil administrativo)

---

## 2.3 Requisitos Funcionais (RF)

| ID | Requisito |
|---|---|
| **RF01** | O sistema deve permitir que o **usuário cidadão** crie uma conta com e-mail, senha e nome de exibição. |
| **RF02** | O sistema deve permitir que o **usuário cidadão** se autentique para acessar funcionalidades de relato. |
| **RF03** | O sistema deve permitir que **qualquer visitante** (sem autenticação) visualize o mapa público de alagamentos ativos. |
| **RF04** | O sistema deve permitir que o **usuário autenticado** reporte um alagamento em sua localização atual obtida via GPS do navegador. |
| **RF05** | O sistema deve **obrigar o envio de uma fotografia** do local alagado no ato do relato (não permitir upload de imagens da galeria - apenas captura via câmera do dispositivo). *[Melhoria sugerida pelo Prof. Walter Theodoro]* |
| **RF06** | O sistema deve permitir que o usuário **informe o nível da água** segundo três categorias: **(a)** carros e ônibus passam normalmente *(Moderado)*; **(b)** apenas ônibus/caminhões/SUVs conseguem passar *(Grave)*; **(c)** nenhum veículo passa com segurança *(Crítico)*. *[Melhoria sugerida pelo Prof. Walter Theodoro]* |
| **RF07** | O sistema deve representar cada relato no mapa como um **círculo georreferenciado** (raio configurável conforme o nível, ex.: 30m / 60m / 100m) e não como ponto isolado. *[Melhoria sugerida pelo Prof. Walter Theodoro]* |
| **RF08** | O sistema deve permitir que outros usuários **confirmem ou contestem** um relato existente. |
| **RF09** | O sistema deve permitir que o usuário marque uma área anteriormente alagada como **"Pista Limpa"**, encerrando o relato após 3 confirmações distintas. |
| **RF10** | O sistema deve aplicar **TTL (Time To Live) automático de 45 minutos** a cada relato, prorrogável a cada confirmação positiva. |
| **RF11** | O sistema deve **integrar dados de fontes oficiais externas**: sensores de nível dos rios Cachoeira, Águas Vermelhas e Cubatão; tábua de marés do Porto de São Francisco do Sul; alertas oficiais da Defesa Civil de Joinville. |
| **RF12** | O sistema deve enviar **notificações web push** ao usuário autenticado quando um novo alagamento for confirmado em raio de 2 km de sua localização. |
| **RF13** | O sistema deve disponibilizar um **painel administrativo** para perfis "Defesa Civil" com visualização consolidada e mapa de calor. |
| **RF14** | O sistema deve permitir **exportação de relatórios** (CSV e PDF) com dados agregados (perfil administrativo). |
| **RF15** | O sistema deve manter **histórico permanente** de todos os eventos para análise temporal e planejamento urbano. |
| **RF16** | O sistema deve permitir ao usuário **consultar seus próprios relatos** anteriores e acompanhar seu impacto (quantas confirmações recebeu). |

---

## 2.4 Requisitos Não Funcionais (RNF)

### Desempenho
| ID | Requisito |
|---|---|
| **RNF01** | O tempo de resposta para consultas ao mapa deve ser inferior a **300 ms** (p95) sob carga de 100 usuários simultâneos. |
| **RNF02** | O upload de fotografias do relato deve ser concluído em até **5 segundos** em conexão 4G. |
| **RNF03** | O sistema deve suportar **500 usuários simultâneos** em eventos de pico, com escalabilidade horizontal. |

### Segurança
| ID | Requisito |
|---|---|
| **RNF04** | O sistema deve utilizar **autenticação baseada em JWT** com expiração e refresh token. |
| **RNF05** | Todas as comunicações cliente-servidor devem ocorrer via **HTTPS (TLS 1.3)**. |
| **RNF06** | O sistema deve mitigar as principais ameaças do **OWASP Top 10** (especialmente injeção, XSS, CSRF e broken access control). |
| **RNF07** | Senhas devem ser armazenadas com **hash bcrypt** (custo ≥ 10). |
| **RNF08** | O sistema deve estar em conformidade com a **LGPD** quanto à coleta, armazenamento e descarte de dados pessoais. |

### Disponibilidade e Confiabilidade
| ID | Requisito |
|---|---|
| **RNF09** | O sistema deve manter disponibilidade mínima de **99% mensal**. |
| **RNF10** | O sistema deve registrar **logs estruturados** de todas as operações sensíveis e disponibilizá-los para auditoria. |

### Escalabilidade
| ID | Requisito |
|---|---|
| **RNF11** | A arquitetura deve permitir **escala horizontal** dos serviços de API por meio de containerização (Docker). |
| **RNF12** | O armazenamento de imagens deve usar **object storage** (S3-compatível) para escalabilidade independente do banco de dados. |

### Usabilidade
| ID | Requisito |
|---|---|
| **RNF13** | A interface deve ser **responsiva** (mobile-first), funcionando em telas de 320px a 1920px. |
| **RNF14** | O fluxo de relato (do clique inicial à confirmação final) deve ser concluído em **no máximo 4 toques/cliques**. |
| **RNF15** | O sistema deve atender às diretrizes **WCAG 2.1 nível AA** para acessibilidade. |

### Observabilidade
| ID | Requisito |
|---|---|
| **RNF16** | O sistema deve estar instrumentado com **Prometheus e Grafana** para monitoramento de métricas técnicas e de negócio. |

---

## 2.5 Regras de Negócio

- **RN01 -** Somente usuários autenticados podem criar relatos.
- **RN02 -** Cada usuário pode criar no máximo **5 relatos por hora** (anti-spam).
- **RN03 -** Cada relato exige **obrigatoriamente** uma fotografia capturada no momento (não permitido upload de galeria) e a seleção de um nível de severidade.
- **RN04 -** Um relato tem TTL inicial de **45 minutos**. A cada confirmação positiva de outro usuário, o TTL é prorrogado em 30 minutos.
- **RN05 -** Após **3 relatos de "Pista Limpa"** distintos sobre a mesma área, o relato é automaticamente arquivado.
- **RN06 -** O raio do círculo de alagamento no mapa é definido pelo nível: **Moderado = 30m**, **Grave = 60m**, **Crítico = 100m**.
- **RN07 -** Relatos com fotografias inadequadas (imagens manifestamente fora do contexto) podem ser **denunciadas e moderadas** por administradores.
- **RN08 -** Apenas usuários com perfil "Defesa Civil" têm acesso ao painel administrativo e à exportação de dados.
- **RN09 -** Dados pessoais (e-mail, nome) **não são expostos publicamente**; apenas um identificador anônimo é associado aos relatos.
- **RN10 -** Histórico de relatos é **público em forma agregada** (estatísticas), mas relatos individuais somente são visíveis ao seu autor após o arquivamento.

---

## 2.6 Fora do Escopo

Para evitar crescimento descontrolado do projeto e garantir entrega viável no prazo do PAC Extensionista VII, ficam explicitamente **fora do escopo desta versão**:

- Aplicativo mobile nativo (iOS/Android). A solução será **web responsiva (PWA)**, executável no navegador móvel.
- Sistema de navegação turn-by-turn ou recálculo de rotas (o usuário será redirecionado a apps como Google Maps/Waze).
- Modelo preditivo de IA para previsão de alagamentos (apenas dados reativos e consolidados serão exibidos nesta versão).
- Integração com câmeras de trânsito em vídeo ao vivo (apenas links externos para o portal NDMais).
- Sistema de gamificação e ranking público de usuários colaboradores (a estudar para versão futura).
- Cobertura geográfica fora de Joinville (Bairros e municípios vizinhos ficarão como evolução futura).
- Versão multilíngue (somente português brasileiro nesta versão).

---

# 3. Fluxos e Comportamento do Sistema

Esta seção demonstra **como o sistema funciona** do ponto de vista da interação entre o usuário e o sistema, considerando os principais caminhos felizes e os cenários alternativos.

---

## 3.1 Fluxo Principal do Usuário

O fluxo principal contempla a jornada completa de um cidadão colaborador, **desde o acesso ao sistema até a confirmação de um relato**:

```
[1] Usuário acessa alagou.com.br
 │
 ▼
[2] Visualiza mapa público com áreas alagadas ativas
 │
 ▼
[3] Decide reportar → Sistema exige autenticação
 │
 ▼
[4] Login ou Cadastro
 │
 ▼
[5] Sistema solicita permissão de GEOLOCALIZAÇÃO
 │
 ▼
[6] Sistema solicita permissão de CÂMERA
 │
 ▼
[7] Usuário captura FOTO obrigatória do alagamento
 │
 ▼
[8] Usuário seleciona NÍVEL DA ÁGUA:
 (a) Moderado (b) Grave (c) Crítico
 │
 ▼
[9] Sistema valida coordenadas + foto + nível
 │
 ▼
[10] Relato publicado e exibido como CÍRCULO no mapa
 │
 ▼
[11] Notificação push enviada a usuários em 2 km
 │
 ▼
[12] Outros usuários CONFIRMAM ou marcam PISTA LIMPA
 │
 ▼
[13] TTL gerenciado automaticamente até arquivamento
```

---

## 3.2 Fluxos Alternativos

### FA01 - Usuário nega permissão de geolocalização
- **Comportamento:** Sistema exibe mensagem explicativa indicando que o relato só é possível com GPS ativo, e oferece opção de habilitar manualmente nas configurações do navegador.

### FA02 - Usuário nega permissão de câmera
- **Comportamento:** Sistema **impede a continuidade do relato** (foto é obrigatória por RF05) e exibe instruções para liberar a câmera.

### FA03 - Sem conexão à internet durante o relato
- **Comportamento:** O relato é **salvo em fila local (IndexedDB)** e sincronizado automaticamente quando a conexão for restaurada (resiliência offline-first parcial).

### FA04 - Foto desfocada ou inválida (validação backend)
- **Comportamento:** O backend rejeita uploads que não atendam aos critérios mínimos (resolução < 480p, arquivo corrompido, etc.) e solicita nova captura.

### FA05 - Relato em local muito próximo de outro ativo (< 50m)
- **Comportamento:** Sistema oferece ao usuário a opção de **confirmar o relato existente** em vez de criar duplicata, agregando confiabilidade.

### FA06 - Usuário tenta criar mais de 5 relatos em 1 hora
- **Comportamento:** Sistema bloqueia novos relatos pelo período (RN02) e exibe mensagem explicativa com horário de liberação.

### FA07 - Conflito entre relatos ("Alagado" vs "Pista Limpa") simultâneos
- **Comportamento:** Ambos são registrados; o sistema aplica regra de **maioria simples na janela de 15 minutos** para decidir o estado público da área.

### FA08 - Falha na integração com fonte oficial (sensor offline, API da Defesa Civil indisponível)
- **Comportamento:** O sistema continua operando apenas com dados colaborativos e exibe um indicador discreto de "fonte oficial temporariamente indisponível".

### FA09 - Usuário cancela cadastro durante o fluxo de relato
- **Comportamento:** Foto e localização capturadas são **descartadas imediatamente** (LGPD); usuário retorna ao mapa público.

---

# 4. Mockups e Experiência do Usuário (UX)

Esta seção apresenta a **visualização inicial do produto antes da implementação**.

Os mockups têm o objetivo de validar:

- Fluxo de navegação entre telas
- Organização da interface e hierarquia visual
- Interações do usuário (toques, formulários, mapa)
- Clareza da experiência ponta-a-ponta

**Ferramenta de prototipação adotada:** Figma (alternativa: Excalidraw para fluxogramas e wireframes de baixa fidelidade).

---

## 4.1 Fluxo de Navegação

O fluxo de navegação macro do sistema é representado a seguir:

```
┌─────────────────┐
│ Tela Inicial │
│ (Mapa Público) │──────► (Sem login: apenas visualização)
└────────┬────────┘
 │ "Reportar"
 ▼
┌─────────────────┐ ┌─────────────────┐
│ Tela Login │◄───────►│ Tela Cadastro │
└────────┬────────┘ └─────────────────┘
 │
 ▼
┌─────────────────┐
│ Dashboard Logado│
│ (Mapa + Menu) │
└────────┬────────┘
 │
 ┌─────┴─────┬───────────┬──────────────┐
 ▼ ▼ ▼ ▼
┌──────┐ ┌─────────┐ ┌────────┐ ┌──────────────┐
│Relato│ │Histórico│ │Detalhes│ │ Painel Admin │
│ Novo │ │ Pessoal │ │ Relato │ │ (Defesa Civ.)│
└──────┘ └─────────┘ └────────┘ └──────────────┘
```

---

## 4.2 Wireframes ou Mockups das Telas

As telas mínimas previstas para o MVP são:

### 4.2.1 - Tela Inicial / Mapa Público

- **Descrição:** Mapa centrado em Joinville exibindo círculos coloridos (amarelo = Moderado, laranja = Grave, vermelho = Crítico) sobre as áreas alagadas ativas. Barra superior com botão "Entrar" e busca por endereço.
- **Ações principais do usuário:** Navegar no mapa, clicar em um círculo para ver detalhes, fazer login.

### 4.2.2 - Tela de Cadastro / Login

- **Descrição:** Formulário simples com e-mail, senha e botão "Continuar". Opção de login social (Google) como diferencial.
- **Ações principais do usuário:** Criar conta, entrar.

### 4.2.3 - Tela de Relato (Captura)

- **Descrição:** Câmera ativa em tela cheia com botão grande "Capturar". Indicador de localização no topo. Após a captura, exibe a foto preview com opção de "Refazer" ou "Continuar".
- **Ações principais do usuário:** Tirar foto, aceitar ou refazer.

### 4.2.4 - Tela de Severidade (Nível da Água)

- **Descrição:** Três cards verticais com ilustrações:
 - **Moderado** - Carros e ônibus passam normalmente
 - **Grave** - Apenas veículos altos passam
 - **Crítico** - Nenhum veículo passa com segurança
- **Ações principais do usuário:** Tocar no nível adequado.

### 4.2.5 - Tela de Confirmação

- **Descrição:** Sumário do relato (foto, localização aproximada anonimizada, nível). Botão "Enviar Relato".
- **Ações principais do usuário:** Revisar e enviar.

### 4.2.6 - Tela de Detalhes do Relato

- **Descrição:** Exibida ao clicar em um círculo no mapa. Mostra: foto enviada, nível, tempo desde o relato, número de confirmações. Botões: "Confirmar (ainda alagado)" e "Pista Limpa".
- **Ações principais do usuário:** Confirmar ou marcar pista limpa.

### 4.2.7 - Histórico Pessoal

- **Descrição:** Lista cronológica dos relatos do usuário com status (ativo, arquivado), número de confirmações recebidas.
- **Ações principais do usuário:** Visualizar contribuições próprias.

### 4.2.8 - Painel Administrativo (Defesa Civil)

- **Descrição:** Dashboard com mapa de calor da cidade, gráfico de relatos por hora, lista filtrada de eventos ativos, botão de exportação CSV/PDF.
- **Ações principais do usuário:** Monitorar, filtrar, exportar.

---

## 4.3 Fluxo de Interação do Usuário

Demonstração passo a passo do **fluxo crítico de criação de relato**:

1. **Usuário abre alagou.com.br** no navegador do celular, em pé na calçada ao lado de uma rua alagada.
2. **Visualiza o mapa**: percebe que aquela rua ainda não tem círculo marcado.
3. **Toca em "Reportar Alagamento"** no botão flutuante inferior.
4. **Sistema solicita login** (caso ainda não autenticado) e o usuário entra com e-mail/senha.
5. **Sistema solicita permissão de localização** e o navegador captura coordenadas via GPS.
6. **Sistema abre a câmera** e o usuário aponta para a rua alagada.
7. **Usuário captura a foto** tocando no botão grande no centro inferior.
8. **Sistema apresenta os três cards de nível** (Moderado / Grave / Crítico) e o usuário toca em "Grave" (vê que carros pequenos não passam mais).
9. **Sistema exibe tela de confirmação** com a foto e nível selecionado.
10. **Usuário confirma o envio.**
11. **Sistema processa**: salva no backend, gera o círculo de raio adequado (60m para "Grave") e exibe o relato no mapa.
12. **Sistema envia notificação push** aos usuários autenticados que estão a menos de 2 km dali.
13. **Usuário recebe tela de agradecimento** com a mensagem "Você ajudou a tornar Joinville mais segura."

Tempo total estimado: **menos de 60 segundos** entre o toque inicial e a publicação.

---

## 4.4 Feedback Inicial de Usuários

Os mockups foram apresentados em **maio/2026** a um grupo de **8 usuários representativos do público-alvo**: 3 motoristas de aplicativo, 3 moradores comuns (sem profissão de motorista), 1 motoboy e 1 servidor que atua em órgão de monitoramento urbano da Prefeitura. As sessões foram individuais, com duração média de **25 minutos**, conduzidas a partir do protótipo navegável no Figma.

### Principais validações obtidas

- **Compreensão imediata da tela inicial:** 8/8 entenderam que os círculos coloridos no mapa representavam alagamentos sem precisar ler legenda.
- **Cores intuitivas:** 7/8 associaram corretamente amarelo/laranja/vermelho às severidades Moderado/Grave/Crítico sem orientação prévia.
- **Fluxo de relato:** 8/8 conseguiram concluir o relato completo no protótipo em **até 50 segundos**. Não houve abandono.
- **Foto obrigatória:** 6/8 declararam que a obrigatoriedade da foto **aumenta** a confiança no relato. 2/8 levantaram a preocupação sobre o que fazer "se estiver em movimento" - ajuste planejado: exibir aviso de "pare em local seguro" antes de iniciar a captura.
- **Severidade em 3 níveis:** todos os 8 acharam a categorização clara. 2/8 sugeriram textos ainda mais visuais ("passa carro" / "só ônibus" / "passa ninguém") - sugestão **incorporada** aos textos finais das telas.
- **Painel administrativo:** apresentado apenas ao 8º participante (servidor público); recebeu avaliação positiva quanto à utilidade do mapa de calor e à exportação para CSV.

### Sugestões coletadas e respectivos encaminhamentos

| Sugestão | Frequência | Decisão |
|---|---|---|
| Modo "rota": digitar destino e ver se há alagamento no caminho | 5/8 | **Adiado para v2** (fora do escopo atual) |
| Botão de "denunciar relato falso" | 3/8 | **Aceito** - adicionado como funcionalidade de moderação (alinhado à RN07) |
| Mostrar a hora exata do relato no card de detalhes | 4/8 | **Aceito** - incorporado ao mockup da tela de detalhes |
| Compartilhar a área alagada via WhatsApp | 3/8 | **Aceito** - compartilhamento nativo via Web Share API |
| Padrão alternativo de cores/hachuras para daltônicos | 1/8 | **Aceito** - combinação de cor + padrão visual para garantir conformidade com WCAG 2.1 AA (RNF15) |
| Mostrar áreas "limpas há pouco tempo" no mapa também | 2/8 | **Em estudo** - risco de poluir o mapa |
| Som de alerta para notificação push em modo dirigindo | 2/8 | **Em estudo** - depende de política de áudio do navegador |

### Frases representativas

> *"Eu só queria saber: passo ou não passo? Vocês tão respondendo isso direto. Tá bom."*
> - Participante 6, motorista 99, 33 anos

> *"Achei melhor que o Waze pra isso. No Waze a gente nunca sabe se é poça ou se é enchente mesmo."*
> - Participante 2, moradora do bairro Fátima, 41 anos

> *"Se isso aqui rodar de verdade, vou usar todo dia de chuva. Sério."*
> - Participante 4, motorista Uber, 38 anos

### Conclusão da validação

Os mockups foram considerados **suficientemente claros e alinhados ao problema**, com aprovação geral do fluxo de relato. As três funcionalidades introduzidas a partir da revisão do professor (círculo no mapa, foto obrigatória, indicador de nível) foram **especialmente bem avaliadas** pelos participantes, confirmando a pertinência da decisão de incorporá-las ao escopo desta versão.

---

# 5. Arquitetura do Sistema

Esta seção demonstra **como o sistema será construído**, abordando os níveis macro (contexto), médio (containers e tecnologias) e micro (componentes internos), seguindo o **modelo C4** de Simon Brown.

---

## 5.1 Diagrama C4

### Nível 1 - Diagrama de Contexto

Visão macro do sistema Alagou no ecossistema urbano de Joinville.

**Atores:**

- **Cidadão Colaborador:** acessa via navegador (mobile ou desktop) para reportar ou consultar alagamentos.
- **Agente da Defesa Civil:** acessa via navegador desktop para consultar painel administrativo e exportar dados.
- **Visitante Anônimo:** consulta o mapa público sem autenticação.

**Sistemas Externos:**

- **API de Sensores de Rios** (Rio Cachoeira, Águas Vermelhas, Cubatão) - fonte de dados sobre nível dos rios.
- **API da Tábua de Marés** (Porto de São Francisco do Sul) - fonte de dados sobre marés que afetam a drenagem urbana.
- **API/Webhook da Defesa Civil de Joinville** - fonte de alertas oficiais e boletins de emergência.
- **Mapbox / OpenStreetMap** - provedor de tiles cartográficos.
- **Provedor de Notificações Web Push** (Firebase Cloud Messaging ou Web Push API nativa).

**Fluxo de Valor:**

```
Cidadão ──relato──► Alagou ──exibição──► Outros cidadãos
 ▲
 │ dados oficiais
 │
 Sensores / Marés / Defesa Civil
 │
 ▼
 Painel para Defesa Civil
```

---

### Nível 2 - Diagrama de Containers

Primeiro "zoom" no sistema, destacando as unidades de execução independentes.

**Containers planejados:**

| Container | Tecnologia | Responsabilidade |
|---|---|---|
| **Web Application (SPA)** | React + TypeScript + Vite | Interface única para cidadãos e administradores; PWA responsiva |
| **API Backend** | Java 21 + Spring Boot 3 | API REST com regras de negócio, autenticação e orquestração |
| **Worker de Integrações** | Java + Spring Boot (Scheduler) | Polling/consumo de APIs externas (sensores, marés, Defesa Civil) executado por `@Scheduled` ou módulo separado |
| **Banco de Dados Principal** | PostgreSQL + PostGIS | Persistência relacional com suporte geoespacial nativo |
| **Cache** | Redis | Cache de mapa, contagens de confirmações, controle de rate limit, fila pub/sub para WebSocket |
| **Object Storage** | AWS S3 (ou MinIO autohospedado) | Armazenamento das fotografias dos relatos |
| **Servidor de Notificações** | Web Push API + Service Workers | Envio de notificações push aos navegadores dos usuários |

**Protocolos de comunicação:**

- Cliente ↔ API: **HTTPS / JSON (REST)** + **WebSockets** para atualizações em tempo real do mapa
- API ↔ Banco: **TCP / SQL (Spring Data JPA + Hibernate)**
- API ↔ Cache: **TCP / RESP (Spring Data Redis com Lettuce)**
- API ↔ Object Storage: **HTTPS / S3 API**
- Worker ↔ APIs externas: **HTTPS / variável conforme cada provedor**

---

### Nível 3 - Diagrama de Componentes

Zoom dentro do container **API Backend**, mostrando sua organização interna em camadas.

**Estrutura interna:**

```
┌─────────────────────────────────────────────────┐
│ API Backend │
│ │
│ ┌───────────────────────────────────────────┐ │
│ │ Camada de Apresentação (Controllers) │ │
│ │ - AuthController │ │
│ │ - RelatosController │ │
│ │ - MapaController │ │
│ │ - AdminController │ │
│ └────────────────────┬──────────────────────┘ │
│ │ │
│ ┌────────────────────▼──────────────────────┐ │
│ │ Camada de Serviços (Lógica de Negócio) │ │
│ │ - AuthService │ │
│ │ - RelatoService (cria, valida foto, │ │
│ │ calcula raio do círculo, TTL) │ │
│ │ - GeoService (consultas espaciais) │ │
│ │ - ValidacaoService (regra das 3 │ │
│ │ confirmações Pista Limpa) │ │
│ │ - NotificacaoService │ │
│ └────────────────────┬──────────────────────┘ │
│ │ │
│ ┌────────────────────▼──────────────────────┐ │
│ │ Camada de Persistência (Repositories) │ │
│ │ - UserRepository │ │
│ │ - RelatoRepository │ │
│ │ - ConfirmacaoRepository │ │
│ └────────────────────┬──────────────────────┘ │
│ │ │
│ ┌────────────────────▼──────────────────────┐ │
│ │ Clientes Externos │ │
│ │ - S3Client (upload de fotos) │ │
│ │ - RedisClient │ │
│ │ - SensoresClient (worker) │ │
│ └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Lógica de negócio destacada:**

- **RelatoService** encapsula a regra de obrigatoriedade da foto (RF05), cálculo do raio do círculo com base no nível (RN06) e gerenciamento do TTL (RN04).
- **ValidacaoService** implementa a regra coletiva das 3 confirmações de "Pista Limpa" (RN05).
- **GeoService** utiliza PostGIS para consultas como "todos os relatos ativos a menos de 2 km de uma coordenada" (RF12).

---

## 5.2 Modelo de Dados

O modelo de dados é predominantemente **relacional**, com tipos **geoespaciais** suportados pela extensão **PostGIS** do PostgreSQL.

### Entidades principais

| Entidade | Descrição |
|---|---|
| `usuarios` | Cadastro de cidadãos colaboradores e administradores |
| `relatos` | Cada reporte de alagamento (1 foto, 1 nível, 1 ponto geográfico) |
| `confirmacoes` | Registros de "ainda alagado" feitos por outros usuários sobre um relato |
| `pista_limpa` | Registros de "via desbloqueada" sobre um relato |
| `fontes_oficiais` | Snapshots periódicos de sensores, marés e alertas |
| `notificacoes_push` | Histórico de envios para usuários |
| `auditoria` | Log de operações sensíveis (LGPD / RNF10) |

### Esquema relacional simplificado

```sql
-- Usuários
CREATE TABLE usuarios (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 email VARCHAR(180) UNIQUE NOT NULL,
 nome_exibicao VARCHAR(60) NOT NULL,
 senha_hash VARCHAR(255) NOT NULL,
 perfil VARCHAR(20) NOT NULL DEFAULT 'cidadao', -- cidadao | defesa_civil | admin
 criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Relatos
CREATE TABLE relatos (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 usuario_id UUID REFERENCES usuarios(id),
 localizacao GEOGRAPHY(POINT, 4326) NOT NULL, -- PostGIS
 nivel VARCHAR(10) NOT NULL, -- moderado | grave | critico
 raio_metros INTEGER NOT NULL, -- 30 | 60 | 100
 foto_url VARCHAR(500) NOT NULL, -- caminho no S3
 criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
 expira_em TIMESTAMP NOT NULL, -- TTL dinâmico
 status VARCHAR(20) NOT NULL DEFAULT 'ativo' -- ativo | arquivado
);
CREATE INDEX idx_relatos_localizacao ON relatos USING GIST (localizacao);
CREATE INDEX idx_relatos_status ON relatos (status, expira_em);

-- Confirmações
CREATE TABLE confirmacoes (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 relato_id UUID REFERENCES relatos(id),
 usuario_id UUID REFERENCES usuarios(id),
 tipo VARCHAR(15) NOT NULL, -- confirmacao | pista_limpa
 criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
 UNIQUE (relato_id, usuario_id, tipo)
);

-- Fontes Oficiais
CREATE TABLE fontes_oficiais (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 tipo VARCHAR(40) NOT NULL, -- sensor_rio | mare | defesa_civil
 origem VARCHAR(80) NOT NULL, -- Rio Cachoeira, Porto SFS etc
 valor JSONB NOT NULL,
 coletado_em TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 5.3 Principais Componentes

Os módulos centrais do sistema são:

| Componente | Responsabilidade |
|---|---|
| **Módulo de Autenticação** | Cadastro, login, JWT, refresh tokens, recuperação de senha; conformidade com bcrypt e LGPD. |
| **Módulo de Relato** | Recepção de relato com foto + nível, validações de entrada, cálculo do raio, gravação no banco e disparo de evento WebSocket. |
| **Módulo de Validação Coletiva** | Processa confirmações e "Pista Limpa", aplica regra dos 3 relatos, prorroga ou encerra TTL. |
| **Módulo Geoespacial** | Consultas espaciais via PostGIS (raios, vizinhança, intersecção com vias). |
| **Módulo de Notificações Push** | Identifica usuários em raio relevante e dispara mensagens via Web Push API. |
| **Módulo de Mapa (Frontend)** | Renderização do mapa com MapCN, exibição de círculos coloridos por severidade, integração com WebSocket para atualização em tempo real. |
| **Módulo de Câmera (Frontend)** | Captura de fotografia obrigatória via `getUserMedia` (apenas câmera, sem galeria). |
| **Worker de Integrações Externas** | Consome e padroniza dados de sensores, marés e Defesa Civil; persiste em `fontes_oficiais`. |
| **Painel Administrativo** | Interface dedicada ao perfil "defesa_civil"; exportação CSV/PDF e mapa de calor. |
| **Módulo de Observabilidade** | Coleta de métricas via Spring Boot Actuator + Micrometer (export para Prometheus), logs estruturados (SLF4J + Logback), tracing básico. |

---

## 5.4 Stack Tecnológica

A escolha tecnológica considera maturidade do ecossistema, alinhamento ao Portfolio Directions (Web Apps) e adequação às restrições do PAC Extensionista (sem no-code, sem bancos em disco local, deploy com pipeline CI/CD).

### Frontend

| Tecnologia | Justificativa |
|---|---|
| **React 18 + TypeScript** | Ecossistema maduro, alto suporte da comunidade, type safety para reduzir bugs em domínio complexo. |
| **Vite** | Build moderno e ágil, melhor experiência de desenvolvimento que CRA. |
| **TailwindCSS + shadcn/ui** | Estilização produtiva e Design System consistente; alinhado à seção "Diferenciais" do Portfolio Directions. |
| **MapCN** | Biblioteca de mapas interativos (mapcn.dev); renderização de pontos, círculos e camadas geoespaciais. |
| **Workbox (Service Worker)** | Suporte a PWA - funcionamento parcial offline, fila de envio de relatos quando sem conexão (FA03). |

### Backend

| Tecnologia | Justificativa |
|---|---|
| **Java 21 + Spring Boot 3** | Plataforma madura para construção de APIs corporativas, com vasto ecossistema, forte tipagem estática e excelente suporte a aplicações de longa duração. Spring Boot acelera o setup com auto-configuração, embedded Tomcat e starters para todas as dependências necessárias (web, security, data, validation). |
| **Spring Data JPA + Hibernate (com Hibernate Spatial)** | Camada de persistência declarativa, com migrações geridas por Flyway. A extensão `hibernate-spatial` permite mapear tipos geográficos do PostGIS (Point, Polygon) diretamente para entidades Java. |
| **Bean Validation (Jakarta Validation) + Hibernate Validator** | Validação de entrada baseada em anotações (`@NotNull`, `@Size`, `@Pattern`, validadores customizados). Atende ao RNF06 (mitigação OWASP - injeção e dados malformados). |
| **Spring Security + JJWT + BCrypt** | Spring Security cobre autenticação e autorização declarativas. JJWT para emissão/validação de tokens. `BCryptPasswordEncoder` para hash de senhas (RNF04, RNF07). |
| **Maven** | Gestão de dependências e build padrão do ecossistema Java; compatível com pipelines GitHub Actions. |

### Persistência e Cache

| Tecnologia | Justificativa |
|---|---|
| **PostgreSQL 16 + PostGIS** | Banco relacional robusto com suporte geoespacial nativo - essencial para consultas por raio e proximidade. Atende à exigência de banco persistente (não em disco local) das diretrizes Web Apps. |
| **Redis** | Cache de consultas frequentes do mapa, controle de rate limit (RN02), pub/sub para WebSocket. |

### Armazenamento de Arquivos

| Tecnologia | Justificativa |
|---|---|
| **AWS S3** *(ou MinIO em fase inicial)* | Object storage escalável para fotografias (RNF12), com URLs assinadas para acesso seguro. |

### Infraestrutura e DevOps

| Tecnologia | Justificativa |
|---|---|
| **Docker + Docker Compose** | Containerização (RNF11), reprodutibilidade entre dev e produção. |
| **GitHub Actions** | Pipeline CI/CD obrigatória pelas diretrizes Web Apps; rodando testes, lint e deploy. |
| **AWS EC2 / GCP Compute Engine** *(decisão final pendente)* | Hospedagem em ambiente acessível publicamente, com gestão real de infraestrutura (não plataformas no-code/Vercel-only). |
| **Nginx** | Reverse proxy, terminação TLS, cache de assets estáticos. |
| **Prometheus + Grafana** | Observabilidade técnica e de negócio (RNF16); requisito das diretrizes Web Apps. |
| **SonarCloud** | Análise estática de código e segurança (requisito Web Apps). |

### Qualidade

| Tecnologia | Justificativa |
|---|---|
| **Vitest + React Testing Library** | Testes unitários no frontend (cobertura mínima 25%). |
| **JUnit 5 + Spring Boot Test + Testcontainers** | Testes unitários e de integração no backend (cobertura mínima 75%). Testcontainers permite levantar PostgreSQL + PostGIS reais em containers durante os testes. |
| **Playwright** | Testes end-to-end opcionais para o fluxo crítico de relato. |
| **ESLint + Prettier (frontend) / Checkstyle + SpotBugs (backend)** | Padronização de código e prevenção de erros comuns em cada ecossistema. |
