// Seed de Inicialização do PostgreSQL via Prisma ORM
// Sistema MedAgenda - UFPA 2026.1
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando processamento de Seed do banco de dados PostgreSQL...');

  // Limpar tabelas anteriores
  await prisma.prontuario.deleteMany();
  await prisma.consulta.deleteMany();
  await prisma.horarioDisponivel.deleteMany();
  await prisma.paciente.deleteMany();
  await prisma.medico.deleteMany();
  await prisma.administrador.deleteMany();
  await prisma.usuario.deleteMany();

  // 1. Criar Paciente Demo (Maria Silva)
  const userPaciente = await prisma.usuario.create({
    data: {
      nome: 'Maria Silva',
      email: 'paciente@medagenda.com',
      senhaHash: '$2b$10$demoHashSenhaPaciente123',
      role: 'paciente',
      paciente: {
        create: {
          cpf: '123.456.789-00',
          dataNascimento: '1988-05-14',
          telefone: '(91) 98877-6655',
          endereco: 'Av. Nazaré, 1000 - Belém/PA'
        }
      }
    },
    include: { paciente: true }
  });

  // 2. Criar Médico 1 (Dr. Carlos Eduardo Vitelli - Cardiologia)
  const userMedico1 = await prisma.usuario.create({
    data: {
      nome: 'Dr. Carlos Eduardo Vitelli',
      email: 'medico@medagenda.com',
      senhaHash: '$2b$10$demoHashSenhaMedico123',
      role: 'medico',
      medico: {
        create: {
          crm: 'CRM/PA 12345',
          especialidade: 'Cardiologia',
          valorConsulta: 300.00
        }
      }
    },
    include: { medico: true }
  });

  // 3. Criar Médica 2 (Dra. Gabriela Xavier - Dermatologia)
  const userMedico2 = await prisma.usuario.create({
    data: {
      nome: 'Dra. Gabriela Xavier',
      email: 'gabi.med@medagenda.com',
      senhaHash: '$2b$10$demoHashSenhaMedico123',
      role: 'medico',
      medico: {
        create: {
          crm: 'CRM/PA 54321',
          especialidade: 'Dermatologia',
          valorConsulta: 250.00
        }
      }
    },
    include: { medico: true }
  });

  // 4. Criar Administrador (Kayky Gonçalves)
  await prisma.usuario.create({
    data: {
      nome: 'Kayky Gonçalves (Admin Geral)',
      email: 'admin@medagenda.com',
      senhaHash: '$2b$10$demoHashSenhaAdmin123',
      role: 'admin',
      administrador: {
        create: { nivelAcesso: 3 }
      }
    }
  });

  // 5. Criar grade de Horários Disponíveis para Dr. Carlos
  const diasSemana = [1, 2, 3, 4, 5]; // Segunda a Sexta
  const horarios = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  
  for (const dia of diasSemana) {
    for (const hora of horarios) {
      await prisma.horarioDisponivel.create({
        data: {
          medicoId: userMedico1.medico.id,
          diaSemana: dia,
          horaInicio: hora,
          ativo: true
        }
      });
      await prisma.horarioDisponivel.create({
        data: {
          medicoId: userMedico2.medico.id,
          diaSemana: dia,
          horaInicio: hora,
          ativo: true
        }
      });
    }
  }

  // 6. Criar consultas iniciais
  const dataAmanha = new Date();
  dataAmanha.setDate(dataAmanha.getDate() + 2);
  dataAmanha.setHours(10, 0, 0, 0);

  await prisma.consulta.create({
    data: {
      pacienteId: userPaciente.paciente.id,
      medicoId: userMedico1.medico.id,
      dataHora: dataAmanha,
      status: 'CONFIRMADA',
      observacao: 'Check-up anual cardiológico'
    }
  });

  const dataOntem = new Date();
  dataOntem.setDate(dataOntem.getDate() - 5);
  dataOntem.setHours(14, 0, 0, 0);

  const consultaConcluida = await prisma.consulta.create({
    data: {
      pacienteId: userPaciente.paciente.id,
      medicoId: userMedico2.medico.id,
      dataHora: dataOntem,
      status: 'CONCLUIDA',
      observacao: 'Avaliação dermatológica de rotina'
    }
  });

  await prisma.prontuario.create({
    data: {
      consultaId: consultaConcluida.id,
      anamnese: 'Paciente apresenta leve ressecamento cutâneo nos braços sem coceira ou dor.',
      diagnostico: 'L85.3 - Xerose cutânea (ressecamento da pele)',
      prescricao: '1. Hidratante corporal à base de ureia 10% 2x ao dia.\n2. Evitar banhos quentes prolongados.\n3. Protetor solar FPS 50 diário.',
      assinado: true
    }
  });

  console.log('✅ Seed do banco PostgreSQL finalizada com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
