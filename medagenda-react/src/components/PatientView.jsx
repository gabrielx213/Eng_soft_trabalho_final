// Componente PatientView (Painel do Paciente - RF-03, RF-04, RF-07 e RF-11)
// MedAgenda - UFPA 2026.1
import React, { useState } from 'react';
import { Calendar, Clock, Search, XCircle, FileText, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function PatientView({ user, consultas, medicos, especialidades, onAgendar, onCancelar }) {
  const [activeTab, setActiveTab] = useState('agendamentos'); // 'agendamentos', 'busca', 'historico'
  const [showModal, setShowModal] = useState(false);
  const [selectedProntuario, setSelectedProntuario] = useState(null);

  // Estados de Agendamento em Cascata (RF-03)
  const [selEspec, setSelEspec] = useState('');
  const [selMedicoId, setSelMedicoId] = useState('');
  const [selData, setSelData] = useState(getTomorrowDate());
  const [selHora, setSelHora] = useState('');
  const [obs, setObs] = useState('');
  const [erroAg, setErroAg] = useState('');

  // Busca de médicos (RF-07)
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroEspecBusca, setFiltroEspecBusca] = useState('');

  function getTomorrowDate() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  const medicosFiltradosEspec = medicos.filter(m => !selEspec || m.especialidade === selEspec);
  const medicoSelecionado = medicos.find(m => m.id === Number(selMedicoId));

  const minhasConsultas = consultas.filter(c => c.pacienteId === user.id);
  const agendamentosAtivos = minhasConsultas.filter(c => ['CONFIRMADA', 'AGENDADA'].includes(c.status));
  const historicoConcluido = minhasConsultas.filter(c => ['CONCLUIDA', 'CANCELADA'].includes(c.status));

  async function handleConfirmarAgendamento(e) {
    e.preventDefault();
    setErroAg('');
    if (!selMedicoId || !selData || !selHora) {
      setErroAg('Selecione Médico, Data e Horário.');
      return;
    }
    try {
      await onAgendar({
        pacienteId: user.id,
        medicoId: selMedicoId,
        especialidade: selEspec || medicoSelecionado?.especialidade || 'Clínica Geral',
        data: selData,
        hora: selHora,
        observacao: obs
      });
      setShowModal(false);
      setSelHora('');
      setObs('');
    } catch (err) {
      setErroAg(err.message || 'Erro ao agendar consulta.');
    }
  }

  async function handleTentativaCancelamento(consulta) {
    if (window.confirm(`Confirma o cancelamento da consulta de ${consulta.especialidade} em ${consulta.data} às ${consulta.hora}?\n\nLembrete RF-04: O sistema verifica se faltam mais de 24 horas para o atendimento.`)) {
      try {
        await onCancelar(consulta.id);
      } catch (err) {
        alert(`❌ NÃO FOI POSSÍVEL CANCELAR:\n\n${err.message}`);
      }
    }
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 16px' }}>
      {/* Topo e Boas-Vindas */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3>🧑‍💼 Painel do Paciente — Olá, {user.nome.split(' ')[0]}!</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Gerencie seus agendamentos, pesquise especialistas e acesse laudos médicos.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PlusCircle size={18} />
          + Agendar Nova Consulta (RF-03)
        </button>
      </div>

      {/* Abas de Navegação */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button 
          className={`btn ${activeTab === 'agendamentos' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('agendamentos')}
        >
          📅 Meus Agendamentos ({agendamentosAtivos.length})
        </button>
        <button 
          className={`btn ${activeTab === 'busca' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('busca')}
        >
          🔍 Pesquisar Médicos (RF-07)
        </button>
        <button 
          className={`btn ${activeTab === 'historico' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('historico')}
        >
          📄 Meu Histórico & Prontuários ({historicoConcluido.length})
        </button>
      </div>

      {/* Aba 1: Agendamentos Ativos */}
      {activeTab === 'agendamentos' && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '16px' }}>Consultas Agendadas / Confirmadas</h4>
            <span style={{ fontSize: '12px', color: 'var(--warning)', fontWeight: '600' }}>
              ℹ️ RF-04: Cancelamento permitido apenas com 24h de antecedência
            </span>
          </div>

          {agendamentosAtivos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <Calendar size={48} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
              <p>Você não possui consultas agendadas no momento.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data & Hora</th>
                  <th>Especialidade</th>
                  <th>Médico(a)</th>
                  <th>Observação</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentosAtivos.map(c => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.data}</strong><br />
                      <span style={{ color: 'var(--primary)', fontWeight: '600' }}>⏰ {c.hora}</span>
                    </td>
                    <td>{c.especialidade}</td>
                    <td>{c.medicoNome}</td>
                    <td style={{ maxWidth: '220px', fontSize: '13px', color: 'var(--text-muted)' }}>{c.observacao || '—'}</td>
                    <td>
                      <span className={`badge badge-${c.status}`}>{c.status}</span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => handleTentativaCancelamento(c)}
                      >
                        <XCircle size={14} />
                        Cancelar (RF-04)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Aba 2: Busca de Médicos (RF-07) */}
      {activeTab === 'busca' && (
        <div className="glass-panel">
          <h4 style={{ marginBottom: '16px' }}>Pesquisa de Profissionais Especializados (RF-07)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '14px', marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Busque por nome ou especialidade..." 
                value={termoBusca}
                onChange={e => setTermoBusca(e.target.value)}
                style={{ paddingLeft: '44px' }}
              />
            </div>
            <select value={filtroEspecBusca} onChange={e => setFiltroEspecBusca(e.target.value)}>
              <option value="">Todas as Especialidades</option>
              {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {medicos
              .filter(m => !filtroEspecBusca || m.especialidade === filtroEspecBusca)
              .filter(m => !termoBusca || m.nome.toLowerCase().includes(termoBusca.toLowerCase()) || m.especialidade.toLowerCase().includes(termoBusca.toLowerCase()))
              .map(m => (
                <div key={m.id} style={{ padding: '18px', borderRadius: '16px', background: 'var(--bg-subtle)', border: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h5 style={{ fontSize: '15px' }}>{m.nome}</h5>
                      <span className="badge badge-AGENDADA" style={{ marginTop: '4px' }}>{m.especialidade}</span>
                    </div>
                    <strong style={{ color: 'var(--primary)', fontSize: '14px' }}>R$ {m.valorConsulta?.toFixed(2)}</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>CRM: {m.crm}</p>
                  <div style={{ marginTop: '12px', borderTop: '1px solid var(--card-border)', paddingTop: '10px' }}>
                    <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DIAS ATENDIMENTO:</small>
                    <p style={{ fontSize: '12px', fontWeight: '600' }}>{m.diasAtendimento?.join(', ')}</p>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '14px', padding: '8px' }}
                    onClick={() => {
                      setSelMedicoId(m.id);
                      setSelEspec(m.especialidade);
                      setShowModal(true);
                    }}
                  >
                    Agendar com {m.nome.split(' ')[1] || 'Médico'}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Aba 3: Histórico e Prontuários (RF-11) */}
      {activeTab === 'historico' && (
        <div className="glass-panel">
          <h4 style={{ marginBottom: '16px' }}>Histórico de Consultas Realizadas & Prontuários Digitais (RF-11)</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Especialidade</th>
                <th>Médico</th>
                <th>Status</th>
                <th>Prontuário Médico (RF-06 / RF-11)</th>
              </tr>
            </thead>
            <tbody>
              {historicoConcluido.map(c => (
                <tr key={c.id}>
                  <td>{c.data} às {c.hora}</td>
                  <td>{c.especialidade}</td>
                  <td>{c.medicoNome}</td>
                  <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                  <td>
                    {c.prontuario ? (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                        onClick={() => setSelectedProntuario(c)}
                      >
                        <FileText size={14} />
                        Ver Laudo / Prescrição
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.status === 'CANCELADA' ? 'Cancelada' : 'Sem registro'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Agendamento em Cascata (RF-03) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '18px' }}>📅 Agendar Consulta Médica (RF-03)</h4>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>✖</button>
            </div>

            {erroAg && <div style={{ padding: '10px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '10px', fontSize: '13px', marginBottom: '14px' }}>{erroAg}</div>}

            <form onSubmit={handleConfirmarAgendamento} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>1. Selecione a Especialidade:</label>
                <select value={selEspec} onChange={e => { setSelEspec(e.target.value); setSelMedicoId(''); }}>
                  <option value="">-- Escolha uma especialidade --</option>
                  {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>2. Selecione o Médico Especialista:</label>
                <select value={selMedicoId} onChange={e => setSelMedicoId(e.target.value)} disabled={!selEspec && medicosFiltradosEspec.length > 3}>
                  <option value="">-- Escolha o profissional --</option>
                  {medicosFiltradosEspec.map(m => (
                    <option key={m.id} value={m.id}>{m.nome} — R$ {m.valorConsulta?.toFixed(2)}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>3. Data do Atendimento:</label>
                  <input type="date" value={selData} min={getTomorrowDate()} onChange={e => setSelData(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>4. Horário Livre:</label>
                  <select value={selHora} onChange={e => setSelHora(e.target.value)} required disabled={!selMedicoId}>
                    <option value="">-- Horário --</option>
                    {(medicoSelecionado?.gradeHoraria || ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00']).map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Observações / Sintomas:</label>
                <textarea rows={3} value={obs} onChange={e => setObs(e.target.value)} placeholder="Descreva brevemente o motivo da consulta..." />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Confirmar Agendamento (RF-03)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Leitura de Prontuário (RF-11) */}
      {selectedProntuario && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '18px' }}>🩺 Prontuário Eletrônico Assinado</h4>
              <span className="badge badge-CONCLUIDA">Assinatura Digital ✅</span>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '14px', marginBottom: '16px', fontSize: '13px' }}>
              <p><strong>Paciente:</strong> {selectedProntuario.pacienteNome}</p>
              <p><strong>Médico Responsável:</strong> {selectedProntuario.medicoNome} ({selectedProntuario.especialidade})</p>
              <p><strong>Data da Consulta:</strong> {selectedProntuario.data}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <strong style={{ fontSize: '12px', color: 'var(--primary)' }}>ANAMNESE / QUEIXA RELATADA:</strong>
                <p style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px', fontSize: '13px', marginTop: '4px', whiteSpace: 'pre-line' }}>
                  {selectedProntuario.prontuario.anamnese}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '12px', color: 'var(--primary)' }}>DIAGNÓSTICO (CID-10):</strong>
                <p style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px', fontSize: '13px', marginTop: '4px', fontWeight: '600' }}>
                  {selectedProntuario.prontuario.diagnostico}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '12px', color: 'var(--primary)' }}>PRESCRIÇÃO MÉDICA E RECOMENDAÇÕES:</strong>
                <p style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px', fontSize: '13px', marginTop: '4px', whiteSpace: 'pre-line' }}>
                  {selectedProntuario.prontuario.prescricao}
                </p>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => setSelectedProntuario(null)}>
                Fechar Prontuário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
