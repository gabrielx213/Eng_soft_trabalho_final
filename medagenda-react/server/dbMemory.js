// Banco de Dados em Memória (Fallback Resiliente para o Servidor Node.js/Express)
// Sistema MedAgenda - UFPA 2026.1
// Autores: Carlos Eduardo Vitelli da Silva, Gabriel Xavier Vieira do Nascimento, Kayky Gonçalves Feio

function getRelativeDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

export const dbMemory = {
  usuarios: [
    {
      id: 1,
      nome: 'Maria Silva (Paciente Demo)',
      email: 'paciente@medagenda.com',
      senhaHash: '$2b$10$hashSimulado_123',
      role: 'paciente',
      paciente: {
        id: 10,
        cpf: '123.456.789-00',
        dataNascimento: '1988-05-14',
        telefone: '(91) 98877-6655',
        endereco: 'Av. Nazaré, 1000 - Belém/PA'
      }
    },
    {
      id: 2,
      nome: 'Dr. Carlos Eduardo Vitelli',
      email: 'medico@medagenda.com',
      senhaHash: '$2b$10$hashSimulado_123',
      role: 'medico',
      medico: {
        id: 20,
        crm: 'CRM/PA 12345',
        especialidade: 'Cardiologia',
        valorConsulta: 300.00,
        horariosDisponiveis: [
          { diaSemana: 'Segunda', horaInicio: '08:00', horaFim: '12:00' },
          { diaSemana: 'Terça', horaInicio: '14:00', horaFim: '18:00' }
        ]
      }
    },
    {
      id: 3,
      nome: 'Dra. Gabriela Xavier',
      email: 'gabi.med@medagenda.com',
      senhaHash: '$2b$10$hashSimulado_123',
      role: 'medico',
      medico: {
        id: 30,
        crm: 'CRM/PA 54321',
        especialidade: 'Dermatologia',
        valorConsulta: 250.00,
        horariosDisponiveis: [
          { diaSemana: 'Quarta', horaInicio: '08:30', horaFim: '12:30' }
        ]
      }
    },
    {
      id: 4,
      nome: 'Kayky Gonçalves (Admin Geral)',
      email: 'admin@medagenda.com',
      senhaHash: '$2b$10$hashSimulado_123',
      role: 'admin',
      administrador: {
        id: 40,
        nivelAcesso: 3
      }
    }
  ],
  consultas: [
    {
      id: 101,
      pacienteId: 10,
      medicoId: 20,
      dataHora: new Date(`${getRelativeDate(2)}T10:00:00`),
      status: 'CONFIRMADA',
      observacao: 'Check-up anual cardiológico com retorno de exames.',
      paciente: {
        id: 10,
        cpf: '123.456.789-00',
        usuario: { id: 1, nome: 'Maria Silva (Paciente Demo)', email: 'paciente@medagenda.com' }
      },
      medico: {
        id: 20,
        crm: 'CRM/PA 12345',
        especialidade: 'Cardiologia',
        usuario: { id: 2, nome: 'Dr. Carlos Eduardo Vitelli', email: 'medico@medagenda.com' }
      },
      prontuario: null
    },
    {
      id: 102,
      pacienteId: 10,
      medicoId: 30,
      dataHora: new Date(`${getRelativeDate(-4)}T14:30:00`),
      status: 'CONCLUIDA',
      observacao: 'Consulta de rotina para avaliação de pele.',
      paciente: {
        id: 10,
        cpf: '123.456.789-00',
        usuario: { id: 1, nome: 'Maria Silva (Paciente Demo)', email: 'paciente@medagenda.com' }
      },
      medico: {
        id: 30,
        crm: 'CRM/PA 54321',
        especialidade: 'Dermatologia',
        usuario: { id: 3, nome: 'Dra. Gabriela Xavier', email: 'gabi.med@medagenda.com' }
      },
      prontuario: {
        id: 501,
        consultaId: 102,
        dataRegistro: new Date(getRelativeDate(-4)),
        anamnese: 'Paciente relata leve ressecamento cutâneo em membros superiores nos últimos 3 meses, sem coceira severa.',
        diagnostico: 'L85.3 - Xerose cutânea (ressecamento de pele)',
        prescricao: '1. Hidratante corporal com ureia 10% aplicar 2x ao dia após o banho.\n2. Sabonete líquido com pH neutro.\n3. Protetor solar FPS 50 diário.',
        assinado: true
      }
    },
    {
      id: 103,
      pacienteId: 10,
      medicoId: 20,
      dataHora: new Date(`${getRelativeDate(-12)}T09:00:00`),
      status: 'CANCELADA',
      observacao: 'Cancelado pelo paciente com mais de 24h de antecedência por motivo de viagem.',
      paciente: {
        id: 10,
        cpf: '123.456.789-00',
        usuario: { id: 1, nome: 'Maria Silva (Paciente Demo)', email: 'paciente@medagenda.com' }
      },
      medico: {
        id: 20,
        crm: 'CRM/PA 12345',
        especialidade: 'Cardiologia',
        usuario: { id: 2, nome: 'Dr. Carlos Eduardo Vitelli', email: 'medico@medagenda.com' }
      },
      prontuario: null
    }
  ]
};
