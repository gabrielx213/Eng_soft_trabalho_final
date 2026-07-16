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

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('medagenda_theme') || 'light');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setUser(null);
  }

  // Seletor Inteligente de Perfis (Modo Avaliação Demo para Professor)
  async function handleSelectProfile(role) {
    const db = StorageService.get();
    const targetUser = db.usuarios.find(u => u.role === role);
    if (targetUser) {
      setUser(targetUser);
      await loadAllData();
    }
  }

  // RF-03: Agendamento pelo Paciente
  async function handleAgendarConsulta(dados) {
    const nova = await ApiService.agendarConsulta(dados);
    await loadAllData();
    return nova;
  }

  // RF-04: Cancelamento com verificação 24h
  async function handleCancelarConsulta(id) {
    const res = await ApiService.cancelarConsulta(id);
    await loadAllData();
    return res;
  }

  // RF-06: Registro de Prontuário Eletrônico
  async function handleRegistrarProntuario(dados) {
    const res = await ApiService.registrarProntuario(dados);
    await loadAllData();
    return res;
  }

  // RF-09: Cadastro de Médico pela Administração
  async function handleCadastrarMedico(dados) {
    const res = await ApiService.cadastrarMedico(dados);
    await loadAllData();
    return res;
  }

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        user={user} 
        onSelectProfile={handleSelectProfile} 
        onLogout={handleLogout} 
        theme={theme} 
        onToggleTheme={handleToggleTheme}
        notificacoes={notificacoes}
      />

      <main style={{ flex: 1 }}>
        {!user ? (
          <LoginView onLogin={handleLogin} onRegister={handleRegister} loading={loading} />
        ) : user.role === 'paciente' ? (
          <PatientView 
            user={user} 
            consultas={consultas} 
            medicos={medicos} 
            especialidades={especialidades} 
            onAgendar={handleAgendarConsulta} 
            onCancelar={handleCancelarConsulta} 
          />
        ) : user.role === 'medico' ? (
          <DoctorView 
            user={user} 
            consultas={consultas} 
            onRegistrarProntuario={handleRegistrarProntuario} 
          />
        ) : (
          <AdminView 
            kpis={kpis} 
            medicos={medicos} 
            especialidades={especialidades} 
            onCadastrarMedico={handleCadastrarMedico} 
            theme={theme} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
