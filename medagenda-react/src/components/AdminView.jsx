// Componente AdminView (Painel Administrativo - RF-09 Cadastro de Médico e RF-10 Indicadores & Gráficos Chart.js)
// MedAgenda - UFPA 2026.1
import React, { useState } from 'react';
import { BarChart, Users, Activity, CheckCircle, XCircle, UserPlus, Download, TrendingUp } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminView({ kpis, medicos, especialidades, onCadastrarMedico, theme }) {
  const [showModalMedico, setShowModalMedico] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('123');
  const [crm, setCrm] = useState('');
  const [especialidade, setEspecialidade] = useState('Cardiologia');
  const [novaEspec, setNovaEspec] = useState('');
  const [valorConsulta, setValorConsulta] = useState(250);
  const [erroMed, setErroMed] = useState('');

  // Configurações de Gráficos Chart.js (RF-10)
  const isDark = theme === 'dark';
  const textColor = isDark ? '#E2E8F0' : '#1E293B';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  // Gráfico 1: Distribuição por Status (Doughnut)
  const doughnutData = {
    labels: ['Concluídas', 'Confirmadas / Agendadas', 'Canceladas'],
    datasets: [
      {
        data: [kpis.concluidas, kpis.confirmadas, kpis.canceladas],
        backgroundColor: ['#10B981', '#0EA5E9', '#EF4444'],
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };

  // Gráfico 2: Médicos cadastrados por Especialidade (Barra)
  const especContagem = {};
  especialidades.forEach(e => {
    especContagem[e] = medicos.filter(m => m.especialidade === e).length;
  });

  const barData = {
    labels: Object.keys(especContagem),
    datasets: [
      {
        label: 'Profissionais Específicos',
        data: Object.values(especContagem),
        backgroundColor: 'rgba(14, 165, 233, 0.75)',
        borderColor: '#0EA5E9',
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12 } } }
    },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true }
    }
  };

  async function handleNovoMedico(e) {
    e.preventDefault();
    setErroMed('');
    if (!nome || !email || !crm) {
      setErroMed('Preencha Nome, E-mail e CRM.');
      return;
    }
    try {
      await onCadastrarMedico({
        nome,
        email,
        senha,
        crm,
        especialidade: especialidade === 'NOVA' ? novaEspec : especialidade,
        valorConsulta: Number(valorConsulta)
      });
      setShowModalMedico(false);
      setNome('');
      setEmail('');
      setCrm('');
    } catch (err) {
      setErroMed(err.message || 'Erro ao cadastrar médico.');
    }
  }

  function handleExportarRelatorio() {
    const conteudo = `RELATORIO GERENCIAL MEDAGENDA - UFPA 2026.1
Total de Consultas: ${kpis.totalConsultas}
Consultas Concluidas: ${kpis.concluidas}
Consultas Confirmadas: ${kpis.confirmadas}
Consultas Canceladas: ${kpis.canceladas}
Taxa de Cancelamento: ${kpis.taxaCancelamento}%
Taxa de Ocupacao: ${kpis.taxaOcupacao}%
Tecnologias: React.js, Node.js, Express, Prisma ORM, PostgreSQL`;

    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_gerencial_medagenda_${Date.now()}.txt`;
    a.click();
  }

  return (
    <div style={{ maxWidth: '1150px', margin: '24px auto', padding: '0 16px' }}>
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3>⚙️ Painel Gerencial & KPIs da Clínica (RF-09 / RF-10)</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Controle de especialistas médicos, estatísticas de consultas e ocupação em tempo real.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleExportarRelatorio}>
            <Download size={16} />
            Exportar Relatório (RF-10)
          </button>
          <button className="btn btn-primary" onClick={() => setShowModalMedico(true)}>
            <UserPlus size={18} />
            + Cadastrar Médico (RF-09)
          </button>
        </div>
      </div>

      {/* 4 Cards de KPIs Gerenciais (RF-10) */}
      <div className="kpis-grid">
        <div className="kpi-card">
          <span className="kpi-title">TOTAL DE CONSULTAS</span>
          <span className="kpi-value">{kpis.totalConsultas}</span>
          <small style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} color="var(--primary)" /> Fluxo transacional integral
          </small>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">ATENDIMENTOS CONCLUÍDOS</span>
          <span className="kpi-value" style={{ color: 'var(--success)' }}>{kpis.concluidas}</span>
          <small style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} color="var(--success)" /> Com prontuário assinado
          </small>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">TAXA DE CANCELAMENTO</span>
          <span className="kpi-value" style={{ color: 'var(--danger)' }}>{kpis.taxaCancelamento}%</span>
          <small style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <XCircle size={14} color="var(--danger)" /> Regra RF-04 monitorada
          </small>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">TAXA DE OCUPAÇÃO DA CLÍNICA</span>
          <span className="kpi-value">{kpis.taxaOcupacao}%</span>
          <small style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={14} color="var(--primary)" /> Grade horária otimizada
          </small>
        </div>
      </div>

      {/* Gráficos Chart.js Interativos (RF-10) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="glass-panel">
          <h4 style={{ fontSize: '15px', marginBottom: '16px', textAlign: 'center' }}>📊 Distribuição de Consultas por Status (Chart.js)</h4>
          <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: textColor } } } }} />
          </div>
        </div>

        <div className="glass-panel">
          <h4 style={{ fontSize: '15px', marginBottom: '16px', textAlign: 'center' }}>📈 Corpo Clínico por Especialidade Médica</h4>
          <div style={{ height: '260px' }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Tabela do Corpo Clínico Cadastrado (RF-09) */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '16px' }}>👨‍⚕️ Corpo Clínico Cadastrado (RF-09)</h4>
          <span className="badge badge-AGENDADA">{medicos.length} Especialistas Ativos</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Médico(a)</th>
              <th>CRM</th>
              <th>Especialidade</th>
              <th>Valor Consulta</th>
              <th>Dias de Atendimento (Grade RF-12)</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map(m => (
              <tr key={m.id}>
                <td><strong>{m.nome}</strong><br /><small style={{ color: 'var(--text-muted)' }}>{m.email}</small></td>
                <td><span style={{ fontWeight: '600', color: 'var(--primary)' }}>{m.crm}</span></td>
                <td><span className="badge badge-AGENDADA">{m.especialidade}</span></td>
                <td>R$ {m.valorConsulta?.toFixed(2)}</td>
                <td style={{ fontSize: '13px' }}>{m.diasAtendimento?.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastrar Médico (RF-09) */}
      {showModalMedico && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h4 style={{ fontSize: '18px' }}>👨‍⚕️ Cadastrar Novo Médico (RF-09)</h4>
              <button onClick={() => setShowModalMedico(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>✖</button>
            </div>

            {erroMed && <div style={{ padding: '10px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '10px', fontSize: '13px', marginBottom: '14px' }}>{erroMed}</div>}

            <form onSubmit={handleNovoMedico} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Nome do Médico:</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} required placeholder="ex: Dr. Lucas Martins" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>E-mail Institucional:</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="lucas@medagenda.com" />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>Senha Inicial:</label>
                  <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>Registro CRM:</label>
                  <input type="text" value={crm} onChange={e => setCrm(e.target.value)} required placeholder="CRM/PA 99999" />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>Valor da Consulta (R$):</label>
                  <input type="number" value={valorConsulta} onChange={e => setValorConsulta(e.target.value)} required step="10" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Especialidade Médica:</label>
                <select value={especialidade} onChange={e => setEspecialidade(e.target.value)}>
                  {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
                  <option value="NOVA">+ Cadastrar Nova Especialidade</option>
                </select>
              </div>

              {especialidade === 'NOVA' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>Nome da Nova Especialidade:</label>
                  <input type="text" value={novaEspec} onChange={e => setNovaEspec(e.target.value)} required placeholder="ex: Oftalmologia ou Neurologia" />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModalMedico(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Confirmar Cadastro (RF-09)</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
