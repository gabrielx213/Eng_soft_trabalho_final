// Camada de Serviços Híbrida (Conecta à API Node.js/Express + Prisma ou fallback para LocalStorage)
// Sistema MedAgenda - UFPA 2026.1
import { StorageService } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

// Tenta requisição REST; em caso de falha de conexão (servidor off), usa StorageService local
async function fetchWithFallback(url, options = {}, fallbackAction) {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, options);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.erro || 'Erro na resposta do servidor');
    }
    return await res.json();
  } catch (error) {
    console.warn(`[Modo Híbrido] Servidor Node/PostgreSQL offline ou indisponível em ${url}. Usando LocalStorage reativo.`, error.message);
    return fallbackAction();
  }
}

export const ApiService = {
  // RF-02: Login
  async login(email, senha) {
    return fetchWithFallback(
      '/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      },
      () => {
        const db = StorageService.get();
        const user = db.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);
        if (!user) throw new Error('E-mail ou senha incorretos.');
        return user;
      }
    );
  },

  // RF-01: Cadastrar Paciente
  async cadastrarPaciente(dados) {
    return fetchWithFallback(
      '/pacientes',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      },
      () => {
        const db = StorageService.get();
        if (db.usuarios.some(u => u.email === dados.email || u.cpf === dados.cpf)) {
          throw new Error('E-mail ou CPF já cadastrados.');
        }
        const novoUser = {
          id: Date.now(),
          ...dados,
          role: 'paciente',
          senha: dados.senha || '123'
        };
        db.usuarios.push(novoUser);
        StorageService.save(db);
        return novoUser;
      }
    );
  },

  // RF-03 / RF-04 / RF-11: Listar Consultas
  async getConsultas(filtro = {}) {
    const params = new URLSearchParams(filtro).toString();
    return fetchWithFallback(
      `/consultas?${params}`,
      {},
      () => {
        const db = StorageService.get();
        let lista = [...db.consultas];
        if (filtro.pacienteId) lista = lista.filter(c => c.pacienteId === Number(filtro.pacienteId));
        if (filtro.medicoId) lista = lista.filter(c => c.medicoId === Number(filtro.medicoId));
        if (filtro.status) lista = lista.filter(c => c.status === filtro.status);
        return lista;
      }
    );
  },

  // RF-03: Agendar Consulta
  async agendarConsulta(dados) {
    return fetchWithFallback(
      '/consultas',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      },
      () => {
        const db = StorageService.get();
        const medico = db.usuarios.find(u => u.id === Number(dados.medicoId));
        const paciente = db.usuarios.find(u => u.id === Number(dados.pacienteId));
        
        const nova = {
          id: Date.now(),
          pacienteId: Number(dados.pacienteId),
          pacienteNome: paciente ? paciente.nome : 'Paciente',
          medicoId: Number(dados.medicoId),
          medicoNome: medico ? medico.nome : 'Médico',
          especialidade: dados.especialidade,
          data: dados.data,
          hora: dados.hora,
          status: 'CONFIRMADA',
          observacao: dados.observacao || 'Consulta agendada via portal reativo.'
        };

        db.consultas.push(nova);
        // Gera notificação simulada (RF-08)
        db.notificacoes.unshift({
          id: Date.now() + 1,
          usuarioId: Number(dados.pacienteId),
          titulo: '🔔 Agendamento Confirmado (RF-08)',
          mensagem: `Sua consulta de ${dados.especialidade} com ${medico?.nome} foi confirmada para ${dados.data} às ${dados.hora}.`,
          data: new Date().toLocaleDateString('pt-BR'),
          lida: false
        });

        StorageService.save(db);
        return nova;
      }
    );
  },

  // RF-04: Cancelar Consulta com regra de 24h
  async cancelarConsulta(id) {
    return fetchWithFallback(
      `/consultas/${id}/cancelar`,
      { method: 'PATCH' },
      () => {
        const db = StorageService.get();
        const index = db.consultas.findIndex(c => c.id === Number(id));
        if (index === -1) throw new Error('Consulta não encontrada.');

        const consulta = db.consultas[index];
        const dataHoraConsulta = new Date(`${consulta.data}T${consulta.hora}:00`);
        const diferencaHoras = (dataHoraConsulta - new Date()) / (1000 * 60 * 60);

        if (diferencaHoras < 24) {
          throw new Error('Cancelamento bloqueado (RF-04): Faltam menos de 24 horas para o atendimento.');
        }

        db.consultas[index].status = 'CANCELADA';
        StorageService.save(db);
        return db.consultas[index];
      }
    );
  },

  // RF-06: Registrar Prontuário
  async registrarProntuario(dados) {
    return fetchWithFallback(
      '/prontuarios',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      },
      () => {
        const db = StorageService.get();
        const index = db.consultas.findIndex(c => c.id === Number(dados.consultaId));
        if (index === -1) throw new Error('Consulta não encontrada.');

        db.consultas[index].status = 'CONCLUIDA';
        db.consultas[index].prontuario = {
          id: Date.now(),
          dataRegistro: new Date().toLocaleDateString('pt-BR'),
          anamnese: dados.anamnese,
          diagnostico: dados.diagnostico,
          prescricao: dados.prescricao,
          assinado: true
        };

        StorageService.save(db);
        return db.consultas[index].prontuario;
      }
    );
  },

  // RF-07 / RF-09: Médicos
  async getMedicos() {
    return fetchWithFallback(
      '/medicos',
      {},
      () => {
        const db = StorageService.get();
        return db.usuarios.filter(u => u.role === 'medico');
      }
    );
  },

  async cadastrarMedico(dados) {
    return fetchWithFallback(
      '/medicos',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      },
      () => {
        const db = StorageService.get();
        if (db.usuarios.some(u => u.crm === dados.crm || u.email === dados.email)) {
          throw new Error('CRM ou E-mail já cadastrados.');
        }
        if (dados.especialidade && !db.especialidades.includes(dados.especialidade)) {
          db.especialidades.push(dados.especialidade);
        }
        const novo = {
          id: Date.now(),
          ...dados,
          role: 'medico',
          senha: dados.senha || '123',
          diasAtendimento: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
          gradeHoraria: ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00']
        };
        db.usuarios.push(novo);
        StorageService.save(db);
        return novo;
      }
    );
  },

  // RF-10: KPIs para Admin
  async getKPIs() {
    return fetchWithFallback(
      '/kpis',
      {},
      () => {
        const db = StorageService.get();
        const total = db.consultas.length;
        const concluidas = db.consultas.filter(c => c.status === 'CONCLUIDA').length;
        const canceladas = db.consultas.filter(c => c.status === 'CANCELADA').length;
        const confirmadas = db.consultas.filter(c => c.status === 'CONFIRMADA').length;
        const taxaCancelamento = total > 0 ? ((canceladas / total) * 100).toFixed(1) : 0;
        return {
          totalConsultas: total,
          concluidas,
          canceladas,
          confirmadas,
          taxaCancelamento: Number(taxaCancelamento),
          taxaOcupacao: total > 0 ? (((confirmadas + concluidas) / total) * 100).toFixed(1) : 86.5
        };
      }
    );
  }
};
