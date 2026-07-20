// Controlador Principal do Sistema SPA (App.jsx)
// MedAgenda - UFPA 2026.1 - React.js + Node/Express + Prisma + PostgreSQL
// Autoria: Carlos Eduardo Vitelli da Silva, Gabriel Xavier Vieira do Nascimento, Kayky Gonçalves Feio
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginView from './components/LoginView';
import PatientView from './components/PatientView';
import DoctorView from './components/DoctorView';
import AdminView from './components/AdminView';
import { ApiService } from './services/api';
import { StorageService } from './services/mockData';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('medagenda_theme') || 'light');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sistema de Toasts Globais para confirmação em tempo real ("Redondinho e com confirmação visual")
  const [toasts, setToasts] = useState([]);

  // Estados Globais de Dados (Sincronizados entre API REST e LocalStorage reativo)
  const [consultas, setConsultas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [kpis, setKpis] = useState({ totalConsultas: 0, concluidas: 0, canceladas: 0, confirmadas: 0, taxaCancelamento: 0, taxaOcupacao: 0 });
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('medagenda_theme', theme);
  }, [theme]);

  // Carrega dados e sincroniza com o banco/storage local ao iniciar e nas mudanças
  useEffect(() => {
    StorageService.init();
    loadAllData();
  }, []);

  function addToast(mensagem, tipo = 'success') {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, mensagem, tipo }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5500);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  async function loadAllData() {
    try {
      const db = StorageService.get();
      setEspecialidades(db.especialidades || []);
      setNotificacoes(db.notificacoes || []);

      const listaConsultas = await ApiService.getConsultas();
      setConsultas(listaConsultas);

      const listaMedicos = await ApiService.getMedicos();
      setMedicos(listaMedicos);

      const kpiData = await ApiService.getKPIs();
      setKpis(kpiData);
    } catch (err) {
      console.error('Erro ao carregar dados consolidados:', err);
    }
  }

  function handleToggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  // RF-02: Autenticação / Login
  async function handleLogin(email, senha) {
    setLoading(true);
    try {
      const usuario = await ApiService.login(email, senha);
      setUser(usuario);
      await loadAllData();
      addToast(`Login bem-sucedido! Bem-vindo(a), ${usuario.nome.split(' ')[0]} (Perfil: ${usuario.role.toUpperCase()})`, 'success');
    } catch (error) {
      addToast(error.message || 'Falha no login.', 'danger');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // RF-01: Cadastro de Paciente
  async function handleRegister(dados) {
    setLoading(true);
    try {
      const novo = await ApiService.cadastrarPaciente(dados);
      setUser(novo);
      await loadAllData();
      addToast(`✓ Paciente cadastrado com sucesso (RF-01)! Bem-vindo(a), ${novo.nome.split(' ')[0]}!`, 'success');
    } catch (error) {
      addToast(error.message || 'Falha no cadastro.', 'danger');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setUser(null);
    addToast('Sessão encerrada com sucesso.', 'info');
  }

  // Seletor Inteligente de Perfis (Modo Avaliação Demo para Professor)
  async function handleSelectProfile(role) {
    const db = StorageService.get();
    const targetUser = db.usuarios.find(u => u.role === role);
    if (targetUser) {
      setUser(targetUser);
      await loadAllData();
      addToast(`✓ Perfil de avaliação alterado para: ${targetUser.nome} (${role.toUpperCase()})`, 'info');
    }
  }

  function handleMarcarNotificacoesLidas() {
    const db = StorageService.get();
    db.notificacoes.forEach(n => {
      if (!user || n.usuarioId === user.id) n.lida = true;
    });
    StorageService.save(db);
    loadAllData();
    addToast('Todas as notificações foram marcadas como lidas (RF-08).', 'info');
  }

  // RF-03: Agendamento pelo Paciente
  async function handleAgendarConsulta(dados) {
    try {
      const nova = await ApiService.agendarConsulta(dados);
      await loadAllData();
      addToast(`✓ Agendamento cadastrado com sucesso! Consulta de ${dados.especialidade} em ${dados.data} às ${dados.hora} com ${nova.medicoNome} (RF-03 & RF-08).`, 'success');
      return nova;
    } catch (error) {
      addToast(error.message || 'Não foi possível agendar.', 'danger');
      throw error;
    }
  }

  // RF-04: Cancelamento com verificação 24h
  async function handleCancelarConsulta(id) {
    try {
      const res = await ApiService.cancelarConsulta(id);
      await loadAllData();
      addToast('✓ Consulta cancelada com sucesso conforme regra de antecedência de 24 horas (RF-04).', 'warning');
      return res;
    } catch (error) {
      addToast(error.message || 'Cancelamento bloqueado (RF-04).', 'danger');
      throw error;
    }
  }

  // RF-06: Registro de Prontuário Eletrônico
  async function handleRegistrarProntuario(dados) {
    try {
      const res = await ApiService.registrarProntuario(dados);
      await loadAllData();
      addToast('✓ Laudo digital e prescrição médica registrados e vinculados à consulta com sucesso (RF-06 & RF-11)!', 'success');
      return res;
    } catch (error) {
      addToast(error.message || 'Erro ao registrar prontuário.', 'danger');
      throw error;
    }
  }

  // RF-09: Cadastro de Médico pela Administração
  async function handleCadastrarMedico(dados) {
    try {
      const res = await ApiService.cadastrarMedico(dados);
      await loadAllData();
      addToast(`✓ Dr(a). ${dados.nome} cadastrado(a) com sucesso no corpo clínico (CRM: ${dados.crm} • ${dados.especialidade}) (RF-09)!`, 'success');
      return res;
    } catch (error) {
      addToast(error.message || 'Erro ao cadastrar médico.', 'danger');
      throw error;
    }
  }

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Container de Toasts Flutuantes para Confirmações Instantâneas */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-item toast-${toast.tipo} animate-slide-in`}>
            <div>
              {toast.tipo === 'success' && <CheckCircle2 size={18} color="var(--success)" />}
              {toast.tipo === 'warning' && <AlertCircle size={18} color="var(--warning)" />}
              {toast.tipo === 'danger' && <AlertCircle size={18} color="var(--danger)" />}
              {toast.tipo === 'info' && <Info size={18} color="var(--primary)" />}
            </div>
            <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.4', fontWeight: '500', color: 'var(--foreground)' }}>
              {toast.mensagem}
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>

      <Header 
        user={user} 
        onSelectProfile={handleSelectProfile} 
        onLogout={handleLogout} 
        theme={theme} 
        onToggleTheme={handleToggleTheme}
        notificacoes={notificacoes}
        onMarcarLidas={handleMarcarNotificacoesLidas}
      />

      <main style={{ flex: 1 }}>
        {!user ? (
          <LoginView 
            onLogin={handleLogin} 
            onRegister={handleRegister} 
            loading={loading} 
            onShowToast={addToast}
          />
        ) : user.role === 'paciente' ? (
          <PatientView 
            user={user} 
            consultas={consultas} 
            medicos={medicos} 
            especialidades={especialidades} 
            onAgendar={handleAgendarConsulta} 
            onCancelar={handleCancelarConsulta}
            onShowToast={addToast}
          />
        ) : user.role === 'medico' ? (
          <DoctorView 
            user={user} 
            consultas={consultas} 
            onRegistrarProntuario={handleRegistrarProntuario}
            onShowToast={addToast}
          />
        ) : (
          <AdminView 
            kpis={kpis} 
            medicos={medicos} 
            especialidades={especialidades} 
            onCadastrarMedico={handleCadastrarMedico} 
            theme={theme}
            onShowToast={addToast}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
