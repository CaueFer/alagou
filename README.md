# Alagou

> Plataforma de mobilidade urbana com resiliência climática para Joinville, SC

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](https://github.com/CaueFer/alagou)
[![Version](https://img.shields.io/badge/versão-1.0--draft-blue)](https://github.com/CaueFer/alagou)
[![License](https://img.shields.io/badge/licença-MIT-green)](LICENSE)

---

## Sobre o Projeto

O **Alagou** é um aplicativo mobile (iOS/Android) de crowdsourcing geoespacial especializado em alagamentos urbanos — no modelo do Waze, mas focado em eventos climáticos. Desenvolvido para Joinville, SC, a plataforma integra dados oficiais de sensores e órgãos públicos com relatos dos próprios usuários para gerar alertas em tempo real e rotas adaptativas durante chuvas intensas.

**Por que existe?** Joinville está em uma região de alta suscetibilidade a alagamentos (bacias dos rios Cachoeira, Águas Vermelhas e Cubatão). Hoje, as informações sobre bloqueios viários ficam dispersas em canais da Defesa Civil, redes sociais e câmeras públicas — sem integração acessível ao cidadão.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Backend** | Node.js · TypeScript |
| **Mobile** | React Native (iOS & Android) |
| **Banco de Dados** | PostgreSQL + PostGIS |
| **Cache** | Redis |
| **Mapas** | Mapbox SDK |

---

## Arquitetura & Funcionalidades Principais

### Alertas de Alagamento (Crowdsourcing)
- Usuários reportam pontos de alagamento geolocalizados
- **TTL dinâmico de 45 minutos**, renovável por confirmações de outros usuários
- Remoção via relato **"Pista Limpa"** após 3 validações
- Severidade classificada em: `Moderado` · `Grave` · `Crítico`

### Integração com Dados Oficiais
| Fonte | Dado |
|---|---|
| CEMADEN | Estações meteorológicas |
| Sensores municipais | Nível dos rios Cachoeira, Águas Vermelhas e Cubatão |
| Porto de São Francisco do Sul | Tábua de marés |
| Defesa Civil de Joinville | Alertas SMS e status de emergência |
| NDMais / Defesa Civil | Câmeras ao vivo de pontos críticos |

### Rotas Adaptativas
- Recálculo de rotas em tempo real com base nos pontos bloqueados ativos
- Visualização do mapa de calor de risco por área da cidade

---

## Banco de Dados

Utiliza **PostgreSQL com extensão PostGIS** para armazenamento e consulta de dados geoespaciais. Principais entidades previstas:

- `reports` — relatos de alagamento com geometria de ponto, severidade, TTL e contagem de confirmações
- `flood_zones` — polígonos de zonas de risco histórico
- `river_levels` — série temporal de leituras dos sensores de nível
- `official_alerts` — alertas recebidos da Defesa Civil e CEMADEN

O Redis é utilizado para cache de estado ativo dos alertas e filas de processamento de eventos em tempo real.

---

## Mapbox SDK

A camada de visualização usa o **Mapbox SDK** para:
- Renderização de mapa base com camadas customizadas de alagamento
- Cálculo e exibição de rotas alternativas
- Clustering de relatos próximos em zoom reduzido

---

## Estrutura do Repositório (planejada)

```
alagou/
├── apps/
│   ├── mobile/          # React Native (iOS & Android)
│   └── web/             # Painel web (gestão / Defesa Civil)
├── packages/
│   ├── api/             # Node.js + TypeScript — API REST / WebSocket
│   ├── database/        # Migrations, schemas PostGIS
│   └── shared/          # Tipos compartilhados, utils
└── infra/               # Docker, CI/CD, configs de ambiente
```

---

## Como Rodar Localmente

> **Pré-requisitos:** Node.js 20+, Docker, conta Mapbox (para token de API)

```bash
# Clone o repositório
git clone https://github.com/CaueFer/alagou.git
cd alagou

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves (Mapbox, DB, etc.)

# Suba o banco de dados (PostgreSQL + PostGIS + Redis)
docker compose up -d

# Rode as migrations
npm run db:migrate

# Inicie a API
npm run dev:api

# Inicie o app mobile (em outro terminal)
npm run dev:mobile
```

---

## Público-Alvo

- Motoristas e motociclistas em Joinville durante chuvas
- Passageiros e motoristas de apps (Uber, 99)
- Equipes da Defesa Civil e Trânsito Municipal
- Cidadãos que desejam contribuir com relatos

---

## Status do Projeto

| Fase | Status |
|---|---|
| RFC / Especificação | ✅ Concluído |
| Setup do repositório | 🔄 Em andamento |
| Backend — API core | ⏳ Pendente |
| Integração de dados oficiais | ⏳ Pendente |
| App mobile MVP | ⏳ Pendente |
| Painel web (Defesa Civil) | ⏳ Pendente |

---

## Documentação

- [RFC completo (Spec-Driven Design)](docs/RFC_Alagou_v1.0.pdf)

---

## Autor

**Caue Fernandes** — [github.com/CaueFer](https://github.com/CaueFer)

---

*Joinville, SC · 2026*
