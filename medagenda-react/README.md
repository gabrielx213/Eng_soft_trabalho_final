# MedAgenda — Sistema Web Completo de Agendamento e Prontuário Médico (Fullstack & Containerizado)
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

O projeto está 100% containerizado. Você pode subir todo o sistema (Banco PostgreSQL, API Node/Express e Dashboard React/Vite) com apenas **1 comando**:

```bash
docker compose up --build
```
*(Se quiser rodar em segundo plano: `docker compose up -d --build`)*

* **Acesse o site React no navegador:** [http://localhost:5173](http://localhost:5173) ou [http://localhost](http://localhost)
* **Acesse o status da API REST:** [http://localhost:5000/api/status](http://localhost:5000/api/status)

O container do backend realiza automaticamente as migrações do Prisma e o seed do banco relacional com as matrículas dos alunos e dados demo!

---

## ⚡ Alternativa sem Docker (Modo Local / Híbrido)

Caso não queira rodar o Docker e prefira testar apenas no Node/Navegador:
```bash
npm install
npm run dev
```
O frontend React rodará na porta do Vite. Se a API Node/Postgres não estiver ativa, o sistema ativa automaticamente a persistência reativa local, permitindo testar todos os 12 requisitos sem precisar de nenhuma configuração adicional!

---

## 🚀 Arquitetura e Tecnologias Implementadas (Alinhadas à Seção 4 do Relatório)

1. **Frontend (SPA & Dashboard):** `React.js + Vite` + `Chart.js` (`react-chartjs-2`) + `Lucide Icons` + `Vanilla CSS Glassmorphism` (suporte a Light/Dark Mode).
2. **Backend (API REST):** `Node.js` + `Express` (`server/index.js`) com resiliência ativa (`server/dbMemory.js`).
3. **ORM & Banco Relacional:** `Prisma ORM` + `PostgreSQL` com garantia de integridade transacional ACID.
4. **Containerização & Orquestração:** `Docker` e `Docker Compose` (com builds multi-stage e Nginx).

---

## 📋 Mapeamento Completo de Requisitos Funcionais (RF-01 a RF-12)

| ID | Descrição do Requisito | Como Verificar na Aplicação |
| :--- | :--- | :--- |
| **RF-01** | **Cadastro de novos pacientes** | Na tela inicial, clique em **"+ Cadastrar Novo Paciente (RF-01)"**. Preencha Nome, E-mail e CPF. |
| **RF-02** | **Autenticação de usuários** | Form de Login identificando perfil (`paciente`, `medico`, `admin`) ou seletor **⚡ Modo Avaliação**. |
| **RF-03** | **Agendamento de consultas** | No Painel do Paciente, clique em **"+ Agendar Nova Consulta (RF-03)"**. Seleção em cascata filtra horários livres. |
| **RF-04** | **Cancelamento com regra de 24h** | O sistema calcula cronologicamente a diferença em horas. Se `< 24h`, o cancelamento é impedido com aviso. |
| **RF-05** | **Agenda diária médica por turno** | No Painel do Médico, filtre por **Data** e **Turno (Manhã &lt; 12h ou Tarde &ge; 12h)** para visualização cronológica. |
| **RF-06** | **Prontuário eletrônico assinado** | Na Agenda Médica, clique em **"Iniciar Prontuário (RF-06)"**. Preencha Anamnese, CID-10 e Prescrição. |
| **RF-07** | **Pesquisa de médicos** | Na aba "Pesquisar Médicos", busque por nome ou especialidade para conferir dias e valores. |
| **RF-08** | **Notificações automáticas (24h)** | No cabeçalho, clique no **Sino de Alertas 🔔** para acompanhar confirmações e laudos liberados. |
| **RF-09** | **Cadastro de novos médicos** | No Painel do Administrador, clique em **"+ Cadastrar Médico (RF-09)"** para cadastrar CRM e especialidade. |
| **RF-10** | **Relatórios gerenciais e KPIs** | Cards numéricos reativos e **2 Gráficos Interativos (Chart.js)** por Status e Especialidade, com exportação TXT/CSV. |
| **RF-11** | **Histórico e laudos do paciente** | Na aba "Meu Histórico", veja os atendimentos e clique em **"Ver Laudo / Prescrição"** para abrir o documento. |
| **RF-12** | **Gestão de horários pelo médico** | Na aba "Configurar Horários" do médico, edite os dias de atendimento e a grade de horários livres da clínica. |
