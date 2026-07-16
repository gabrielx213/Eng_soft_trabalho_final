// Componente PatientView (Painel do Paciente - RF-03, RF-04, RF-07 e RF-11)
// MedAgenda - UFPA 2026.1 - Design Corporativo Limpo (Estilo SIDAMA)
import React, { useState } from 'react';
import { Calendar, Clock, Search, XCircle, FileText, PlusCircle, CheckCircle2, AlertCircle, User, X } from 'lucide-react';

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
    if (window.confirm(`Confirma o cancelamento da consulta de ${consulta.especialidade} em ${consulta.data} às ${consulta.hora}?\n\nRegra do Requisito RF-04: O cancelamento só é autorizado com mais de 24 horas de antecedência do horário marcado.`)) {
      try {
        await onCancelar(consulta.id);
      } catch (err) {
        alert(`Não foi possível cancelar: ${err.message}`);
      }
    }
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 16px' }}>
      {/* Top Banner */}
      <div className="clean-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <User size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Painel do Paciente — Olá, {user.nome.split(' ')[0]}!</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Gerencie seus agendamentos, pesquise especialistas e acesse laudos médicos digitais.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PlusCircle size={18} />
          Agendar Nova Consulta
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'agendamentos' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('agendamentos')}
        >
          <Calendar size={16} /> Meus Agendamentos ({agendamentosAtivos.length})
        </button>
        <button 
          className={`btn ${activeTab === 'busca' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('busca')}
        >
          <Search size={16} /> Pesquisar Médicos (RF-07)
        </button>
        <button 
          className={`btn ${activeTab === 'historico' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('historico')}
        >
          <FileText size={16} /> Histórico & Prontuários ({historicoConcluido.length})
        </button>
      </div>

      {/* Tab 1: Agendamentos */}
      {activeTab === 'agendamentos' && (
        <div className="clean-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Consultas Agendadas / Confirmadas</h4>
            <span style={{ fontSize: '12px', color: 'var(--warning)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} /> RF-04: Cancelamento permitido apenas com 24h de antecedência
            </span>
          </div>

          {agendamentosAtivos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted-foreground)' }}>
              <Calendar size={40} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
              <p style={{ fontSize: '14px', fontWeight: '500' }}>Você não possui consultas agendadas no momento.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data & Hora</th>
                    <th>Especialidade</th>
                    <th>Médico(a)</th>
                    <th>Observação</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentosAtivos.map(c => (
                    <tr key={c.id}>
                      <td>
                        <strong style={{ color: 'var(--foreground)' }}>{c.data}</strong><br />
                        <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Clock size={13} /> {c.hora}
                        </span>
                      </td>
                      <td style={{ fontWeight: '500' }}>{c.especialidade}</td>
                      <td>{c.medicoNome}</td>
                      <td style={{ maxWidth: '220px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{c.observacao || '—'}</td>
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
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Busca */}
      {activeTab === 'busca' && (
        <div className="clean-card">
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Pesquisa de Profissionais Especializados (RF-07)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '14px', marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--muted-foreground)' }} />
              <input 
                type="text" 
                placeholder="Busque por nome ou especialidade..." 
                value={termoBusca}
                onChange={e => setTermoBusca(e.target.value)}
                style={{ paddingLeft: '42px' }}
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
                <div key={m.id} style={{ padding: '18px', borderRadius: '12px', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h5 style={{ fontSize: '15px', fontWeight: '700' }}>{m.nome}</h5>
                      <span className="badge badge-CONFIRMADA" style={{ marginTop: '6px' }}>{m.especialidade}</span>
                    </div>
                    <strong style={{ color: 'var(--primary)', fontSize: '15px' }}>R$ {m.valorConsulta?.toFixed(2)}</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '10px' }}>CRM: {m.crm}</p>
                  <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                    <small style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: '600' }}>DIAS DE ATENDIMENTO:</small>
                    <p style={{ fontSize: '12px', fontWeight: '600', marginTop: '2px', color: 'var(--foreground)' }}>{m.diasAtendimento?.join(', ')}</p>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '14px', padding: '9px' }}
                    onClick={() => {
                      setSelMedicoId(m.id);
                      setSelEspec(m.especialidade);
                      setShowModal(true);
                    }}
                  >
                    Agendar com Dr(a). {m.nome.split(' ')[1] || m.nome.split(' ')[0]}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 3: Histórico e Prontuários */}
      {activeTab === 'historico' && (
        <div className="clean-card">
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Histórico de Consultas Realizadas & Prontuários Digitais (RF-11)</h4>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data & Hora</th>
                  <th>Especialidade</th>
                  <th>Médico</th>
                  <th>Status</th>
                  <th>Prontuário Médico (RF-06 / RF-11)</th>
                </tr>
              </thead>
              <tbody>
                {historicoConcluido.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '600' }}>{c.data} às {c.hora}</td>
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
                          Ver Laudo & Prescrição
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                          {c.status === 'CANCELADA' ? 'Consulta cancelada' : 'Registro não disponível'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Agendamento */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700' }}>Agendar Consulta Médica (RF-03)</h4>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                <X size={20} />
              </button>
            </div>

            {erroAg && <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>{erroAg}</div>}

            <form onSubmit={handleConfirmarAgendamento} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>1. Selecione a Especialidade:</label>
                <select value={selEspec} onChange={e => { setSelEspec(e.target.value); setSelMedicoId(''); }}>
                  <option value="">-- Escolha uma especialidade --</option>
                  {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>2. Selecione o Médico Especialista:</label>
                <select value={selMedicoId} onChange={e => setSelMedicoId(e.target.value)} disabled={!selEspec && medicosFiltradosEspec.length > 3}>
                  <option value="">-- Escolha o profissional --</option>
                  {medicosFiltradosEspec.map(m => (
                    <option key={m.id} value={m.id}>{m.nome} — R$ {m.valorConsulta?.toFixed(2)}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>3. Data do Atendimento:</label>
                  <input type="date" value={selData} min={getTomorrowDate()} onChange={e => setSelData(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>4. Horário Livre:</label>
                  <select value={selHora} onChange={e => setSelHora(e.target.value)} required disabled={!selMedicoId}>
                    <option value="">-- Horário --</option>
                    {(medicoSelecionado?.gradeHoraria || ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00']).map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Observações / Sintomas:</label>
                <textarea rows={3} value={obs} onChange={e => setObs(e.target.value)} placeholder="Descreva brevemente o motivo da consulta..." />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Confirmar Agendamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Prontuário */}
      {selectedProntuario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--primary)" />
                <h4 style={{ fontSize: '16px', fontWeight: '700' }}>Prontuário Eletrônico Assinado</h4>
              </div>
              <span className="badge badge-CONCLUIDA">Assinatura Digital Verificada</span>
            </div>

            <div style={{ backgroundColor: 'var(--secondary)', padding: '14px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', border: '1px solid var(--border)' }}>
              <p style={{ marginBottom: '4px' }}><strong>Paciente:</strong> {selectedProntuario.pacienteNome}</p>
              <p style={{ marginBottom: '4px' }}><strong>Médico Responsável:</strong> {selectedProntuario.medicoNome} ({selectedProntuario.especialidade})</p>
              <p><strong>Data do Atendimento:</strong> {selectedProntuario.data}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <strong style={{ fontSize: '12px', color: 'var(--primary)', letterSpacing: '0.03em' }}>ANAMNESE / QUEIXA RELATADA:</strong>
                <p style={{ backgroundColor: 'var(--secondary)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginTop: '4px', whiteSpace: 'pre-line', border: '1px solid var(--border)' }}>
                  {selectedProntuario.prontuario.anamnese}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '12px', color: 'var(--primary)', letterSpacing: '0.03em' }}>DIAGNÓSTICO (CID-10):</strong>
                <p style={{ backgroundColor: 'var(--secondary)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginTop: '4px', fontWeight: '600', border: '1px solid var(--border)' }}>
                  {selectedProntuario.prontuario.diagnostico}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '12px', color: 'var(--primary)', letterSpacing: '0.03em' }}>PRESCRIÇÃO MÉDICA & RECOMENDAÇÕES:</strong>
                <p style={{ backgroundColor: 'var(--secondary)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginTop: '4px', whiteSpace: 'pre-line', border: '1px solid var(--border)' }}>
                  {selectedProntuario.prontuario.prescricao}
                </p>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
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
