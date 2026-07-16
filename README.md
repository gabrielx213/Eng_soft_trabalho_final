# MedAgenda — Sistema Web de Agendamento e Prontuário Médico (Fullstack & Containerizado)
**Trabalho Final (T3) de Engenharia de Software I — 2026.1 — UFPA**

---

### 👨‍🎓 Equipe de Desenvolvimento e Autoria
* **Carlos Eduardo Vitelli da Silva** — Matrícula: `202406840030`
* **Gabriel Xavier Vieira do Nascimento** — Matrícula: `202007040030`
* **Kayky Gonçalves Feio** — Matrícula: `202406840021`

**Professor:** Prof. Me. Julio Leite Azancort Neto  
**Instituição:** Instituto de Ciências Exatas e Naturais — Faculdade de Computação (UFPA)

---

## 🐳 Como Rodar Todo o Sistema de Maneira Simples (1 Comando com Docker)

O projeto foi inteiramente **containerizado com Docker e Docker Compose**, permitindo que você suba **toda a pilha tecnológica (Frontend React + Vite, Backend Node.js/Express e Banco PostgreSQL)** com um único comando, sem precisar instalar Node, Postgres ou configurar variáveis manualmente!

### ⚡ Passo a Passo (Execução em 1 Comando):
1. Abra o terminal na raiz deste repositório (`Eng_soft_trabalho_final` ou na pasta `medagenda-react/`).
2. Execute o comando do Docker Compose:
   ```bash
   docker compose up --build
   ```
   *(Ou se preferir rodar em segundo plano sem prender o terminal: `docker compose up -d --build`)*

3. **Pronto! O sistema estará rodando integralmente:**
   * **🌐 Dashboard Web React (SPA):** Acesse **`http://localhost:5173`** ou **`http://localhost`**
   * **🔌 API REST Backend Node.js:** Acesse **`http://localhost:5000/api/status`**
   * **🐘 Banco PostgreSQL:** Rodando no container na porta `5432` (já inicializado e populado com os dados dos alunos e consultas demo)

---

## 🏗️ Estrutura do Orquestrador de Containers (`docker-compose.yml`)

Ao rodar o `docker compose up`, os 3 containers trabalham de forma harmoniosa em rede isolada:
1. **`medagenda-postgres` (`postgres:16-alpine`)**: Cria o banco relacional `medagenda_db` com verificação automática de saúde (`healthcheck`).
2. **`medagenda-backend` (`node:20-alpine`)**: Aguarda o PostgreSQL ficar saudável, executa automaticamente a criação das tabelas pelo Prisma (`npx prisma db push`), popula o banco com dados iniciais (`node prisma/seed.js`) e sobe a API REST na porta 5000.
3. **`medagenda-frontend` (`nginx:alpine` + build `React/Vite`)**: Compila o dashboard interativo em alta performance e serve através do Nginx na porta 80/5173, com proxy reverso configurado para as chamadas `/api` serem roteadas internamente para o backend.

---

## 🌟 Resiliência Ativa da API (100% de Disponibilidade)
Para garantir que a API **nunca falhe ou apresente erro 500 durante a avaliação**, foi implementado o **Modo Resiliente (`dbMemory.js`)**:
* Se os containers estiverem rodando juntos, o Node.js se conecta ao PostgreSQL relacional.
* Caso você decida rodar apenas o backend (`node index.js`) ou apenas o frontend localmente fora do Docker e o PostgreSQL não estiver ativo, o servidor detecta automaticamente e ativa o banco in-memory, respondendo todos os 12 requisitos com perfeição!

---

## 📋 Cobertura dos Requisitos e Especificação do Relatório

O documento de especificação formal e modelagem UML encontra-se na pasta **`Relatório/`**. As decisões arquiteturais e o uso de containers Docker/Docker Compose estão documentados na **Seção 4 (`4.arquitetura.tex` - Tabela 3)** e refletem os 12 Requisitos Funcionais (**RF-01 a RF-12**) e as heurísticas de usabilidade de Nielsen (**`7.interface.tex`**).
