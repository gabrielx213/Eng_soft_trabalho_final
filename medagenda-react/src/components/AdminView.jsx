// Componente AdminView (Painel Minimalista Executivo - RF-09 e RF-10)
// MedAgenda - UFPA 2026.1
import React, { useState } from 'react';
import { BarChart, Users, Activity, CheckCircle2, XCircle, UserPlus, Download } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminView({ kpis, medicos, especialidades, onCadastrarMedico, theme, onShowToast }) {
  const [showModalMedico, setShowModalMedico] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('123');
  const [crm, setCrm] = useState('');
  const [especialidade, setEspecialidade] = useState('Cardiologia');
  const [novaEspec, setNovaEspec] = useState('');
  const [valorConsulta, setValorConsulta] = useState(250);
  const [erroMed, setErroMed] = useState('');

  // Confirmação inline
  const [msgSucessoInline, setMsgSucessoInline] = useState('');

  const isDark = theme === 'dark';
  const textColor = isDark ? '#E2E8F0' : '#1E293B';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  // Gráfico 1: Doughnut
  const doughnutData = {
    labels: ['Concluídas', 'Confirmadas / Agendadas', 'Canceladas'],
    datasets: [
      {
        data: [kpis.concluidas, kpis.confirmadas, kpis.canceladas],
        backgroundColor: ['#059669', '#0284c7', '#dc2626'],
        borderWidth: 0
      }
    ]
  };

  // Gráfico 2: Barra
  const especContagem = {};
  especialidades.forEach(e => {
    especContagem[e] = medicos.filter(m => m.especialidade === e).length;
  });

  const barData = {
    labels: Object.keys(especContagem),
    datasets: [
      {
        label: 'Profissionais no Corpo Clínico',
        data: Object.values(especContagem),
        backgroundColor: '#0284c7',
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: textColor, font: { family: 'Inter', size: 12 } } }
    },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true }
    }
  };

  async function handleNovoMedico(e) {
    e.preventDefault();
    setErroMed('');
    setMsgSucessoInline('');
    if (!nome || !email || !crm) {
      setErroMed('Preencha Nome, E-mail e CRM.');
      return;
    }
    try {
      const especialidadeFinal = especialidade === 'NOVA' ? novaEspec : especialidade;
      const novo = await onCadastrarMedico({
        nome,
        email,
        senha,
        crm,
        especialidade: especialidadeFinal,
        valorConsulta: Number(valorConsulta)
      });
      setShowModalMedico(false);
      setNome('');
      setEmail('');
      setCrm('');
      setMsgSucessoInline(`✓ Dr(a). ${novo.nome} (${novo.especialidade} - CRM ${novo.crm}) cadastrado(a) e adicionado(a) ao corpo clínico com sucesso! (RF-09 confirmado)`);
    } catch (err) {
      setErroMed(err.message || 'Erro ao cadastrar médico.');
    }
  }

  function handleExportarRelatorio() {
    const conteudo = `RELATORIO GERENCIAL MEDAGENDA - UFPA 2026.1
==================================================
Data da Emissao: ${new Date().toLocaleString('pt-BR')}
Total Geral de Consultas Registradas: ${kpis.totalConsultas}
Consultas Concluidas com Prontuario Digital: ${kpis.concluidas}
Consultas Confirmadas / Agendadas na Fila: ${kpis.confirmadas}
Consultas Canceladas: ${kpis.canceladas}
Taxa Oficial de Cancelamento: ${kpis.taxaCancelamento}%
Taxa Estimada de Ocupacao: ${kpis.taxaOcupacao}%
Corpo Clinico Ativo: ${medicos.length} medicos cadastrados`;

    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_gerencial_medagenda_${Date.now()}.txt`;
    a.click();
    onShowToast?.('Relatório gerencial exportado com sucesso (.txt)!', 'success');
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1040px', margin: '24px auto', padding: '0 24px' }}>
      
      {/* Cabeçalho Minimalista */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)' }}>
            Painel Executivo & KPIs Gerenciais
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginTop: '2px' }}>
            Indicadores clínicos em tempo real e gestão do corpo médico (RF-09 / RF-10)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleExportarRelatorio}>
            <Download size={15} /> Exportar Relatório TXT
          </button>
          <button className="btn btn-primary" onClick={() => setShowModalMedico(true)}>
            <UserPlus size={15} /> Cadastrar Médico (RF-09)
          </button>
        </div>
      </div>

      {/* Alerta de Sucesso Inline (Cadastro de Médico) */}
      {msgSucessoInline && (
        <div className="animate-slide-in" style={{
          padding: '14px 18px',
          borderRadius: 'var(--radius)',
          background: 'var(--success-bg)',
          color: 'var(--success)',
          border: '1px solid var(--success)',
          marginBottom: '20px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} />
            <span>{msgSucessoInline}</span>
          </div>
          <button onClick={() => setMsgSucessoInline('')} style={{ background: 'transparent', border: 'none', color: 'var(--success)', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
      )}

      {/* 4 Cards de KPIs Gerenciais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="clean-card">
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--muted-foreground)' }}>TOTAL GERAL CONSULTAS</span>
          <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '6px', color: 'var(--foreground)' }}>{kpis.totalConsultas}</div>
        </div>

        <div className="clean-card">
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--muted-foreground)' }}>ATENDIMENTOS CONCLUÍDOS</span>
          <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '6px', color: 'var(--success)' }}>{kpis.concluidas}</div>
        </div>

        <div className="clean-card">
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--muted-foreground)' }}>TAXA DE CANCELAMENTO</span>
          <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '6px', color: 'var(--danger)' }}>{kpis.taxaCancelamento}%</div>
        </div>

        <div className="clean-card">
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--muted-foreground)' }}>TAXA DE OCUPAÇÃO</span>
          <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '6px', color: 'var(--primary)' }}>{kpis.taxaOcupacao}%</div>
        </div>
      </div>

      {/* Gráficos Interativos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="clean-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px' }}>Distribuição de Consultas (RF-10)</span>
          <div style={{ flex: 1, position: 'relative' }}>
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>

        <div className="clean-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px' }}>Especialistas por Área Clínica (RF-07)</span>
          <div style={{ flex: 1, position: 'relative' }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Tabela de Médicos */}
      <div className="clean-card">
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '15px', fontWeight: '600' }}>Corpo Clínico Cadastrado ({medicos.length} profissionais)</span>
          <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Cadastro via RF-09</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome do Médico</th>
                <th>CRM</th>
                <th>Especialidade</th>
                <th>Valor Consulta</th>
                <th>Dias de Atendimento</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map(m => (
                <tr key={m.id}>
                  <td><strong style={{ fontSize: '15px' }}>{m.nome}</strong></td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{m.crm}</td>
                  <td><span className="badge badge-CONFIRMADA">{m.especialidade}</span></td>
                  <td style={{ fontWeight: '600' }}>R$ {m.valorConsulta?.toFixed(2)}</td>
                  <td style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{(m.diasAtendimento || ['Segunda a Sexta']).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro Médico */}
      {showModalMedico && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowModalMedico(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Cadastrar Novo Médico (RF-09)</h3>
              <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setShowModalMedico(false)}>✕</button>
            </div>

            {erroMed && (
              <div style={{ padding: '10px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '6px', fontSize: '13px', marginBottom: '14px' }}>
                {erroMed}
              </div>
            )}

            <form onSubmit={handleNovoMedico} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Nome Completo do Médico *</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Dr. Lucas Prado" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>E-mail *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="lucas@clinica.com" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Senha *</label>
                  <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>CRM *</label>
                  <input type="text" value={crm} onChange={e => setCrm(e.target.value)} required placeholder="CRM/PA 99887" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Valor Consulta (R$) *</label>
                  <input type="number" step="0.01" value={valorConsulta} onChange={e => setValorConsulta(e.target.value)} required />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Especialidade *</label>
                <select value={especialidade} onChange={e => setEspecialidade(e.target.value)}>
                  {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
                  <option value="NOVA">+ Cadastrar Nova Especialidade</option>
                </select>
              </div>

              {especialidade === 'NOVA' && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Nova Especialidade Clínica:</label>
                  <input type="text" value={novaEspec} onChange={e => setNovaEspec(e.target.value)} required placeholder="ex: Neurologia" />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModalMedico(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, fontWeight: '600' }}>
                  Concluir Cadastro do Médico →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
