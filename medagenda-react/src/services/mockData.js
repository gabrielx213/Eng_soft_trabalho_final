// Banco de Dados Simulado / Armazenamento Local (LocalStorage) para Modo Híbrido/Demo
// Sistema MedAgenda - UFPA 2026.1 (Trabalho Final de Engenharia de Software I)
// Autores: Carlos Eduardo Vitelli da Silva, Gabriel Xavier Vieira do Nascimento, Kayky Gonçalves Feio

const INITIAL_DATA = {
  usuarios: [
    {
      id: 1,
      nome: "Maria Silva (Paciente Demo)",
      email: "paciente@medagenda.com",
      senha: "123",
      role: "paciente",
      cpf: "123.456.789-00",
      dataNascimento: "1988-05-14",
      telefone: "(91) 98877-6655",
      endereco: "Av. Nazaré, 1000 - Belém/PA"
    },
    {
      id: 2,
      nome: "Dr. Carlos Eduardo Vitelli",
      email: "medico@medagenda.com",
      senha: "123",
      role: "medico",
      crm: "CRM/PA 12345",
      especialidade: "Cardiologia",
      valorConsulta: 300.00,
      diasAtendimento: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      gradeHoraria: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
    },
    {
      id: 3,
      nome: "Dra. Gabriela Xavier",
      email: "gabi.med@medagenda.com",
      senha: "123",
      role: "medico",
      crm: "CRM/PA 54321",
      especialidade: "Dermatologia",
      valorConsulta: 250.00,
      diasAtendimento: ["Segunda", "Quarta", "Sexta"],
      gradeHoraria: ["08:30", "09:30", "10:30", "14:30", "15:30", "16:30"]
    },
    {
      id: 4,
      nome: "Kayky Gonçalves (Admin Geral)",
      email: "admin@medagenda.com",
      senha: "123",
      role: "admin",
      nivelAcesso: 3
    }
  ],
  especialidades: ["Cardiologia", "Dermatologia", "Pediatria", "Ortopedia", "Clínica Geral", "Ginecologia"],
  consultas: [
    {
      id: 101,
      pacienteId: 1,
      pacienteNome: "Maria Silva (Paciente Demo)",
      medicoId: 2,
      medicoNome: "Dr. Carlos Eduardo Vitelli",
      especialidade: "Cardiologia",
      data: getRelativeDate(2),
      hora: "10:00",
      status: "CONFIRMADA",
      observacao: "Check-up anual cardiológico com retorno de exames."
    },
    {
      id: 102,
      pacienteId: 1,
      pacienteNome: "Maria Silva (Paciente Demo)",
      medicoId: 3,
      medicoNome: "Dra. Gabriela Xavier",
      especialidade: "Dermatologia",
      data: getRelativeDate(-4),
      hora: "14:30",
      status: "CONCLUIDA",
      observacao: "Consulta de rotina para avaliação de pele.",
      prontuario: {
        id: 501,
        dataRegistro: getRelativeDate(-4),
        anamnese: "Paciente relata leve ressecamento cutâneo em membros superiores nos últimos 3 meses, sem coceira severa.",
        diagnostico: "L85.3 - Xerose cutânea (ressecamento de pele)",
        prescricao: "1. Hidratante corporal com ureia 10% aplicar 2x ao dia após o banho.\n2. Sabonete líquido com pH neutro.\n3. Protetor solar FPS 50 diário.",
        assinado: true
      }
    },
    {
      id: 103,
      pacienteId: 1,
      pacienteNome: "Maria Silva (Paciente Demo)",
      medicoId: 2,
      medicoNome: "Dr. Carlos Eduardo Vitelli",
      especialidade: "Cardiologia",
      data: getRelativeDate(-12),
      hora: "09:00",
      status: "CANCELADA",
      observacao: "Cancelado pelo paciente com mais de 24h de antecedência por motivo de viagem."
    }
  ],
  notificacoes: [
    {
      id: 1,
      usuarioId: 1,
      titulo: "🔔 Lembrete Automático (RF-08)",
      mensagem: "Sua consulta de Cardiologia com Dr. Carlos Eduardo está confirmada para breve! Compareça com 15 minutos de antecedência.",
      data: new Date().toLocaleDateString("pt-BR"),
      lida: false
    },
    {
      id: 2,
      usuarioId: 1,
      titulo: "📄 Prontuário Disponível (RF-11)",
      mensagem: "O laudo e prescrição da sua última consulta de Dermatologia foram assinados por Dra. Gabriela Xavier.",
      data: getRelativeDate(-4),
      lida: true
    }
  ]
};

function getRelativeDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
}

export const StorageService = {
  init() {
    if (!localStorage.getItem("medagenda_data")) {
      localStorage.setItem("medagenda_data", JSON.stringify(INITIAL_DATA));
    }
  },
  get() {
    this.init();
    return JSON.parse(localStorage.getItem("medagenda_data"));
  },
  save(data) {
    localStorage.setItem("medagenda_data", JSON.stringify(data));
  },
  reset() {
    localStorage.setItem("medagenda_data", JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
};
