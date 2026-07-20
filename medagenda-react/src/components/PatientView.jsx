// Componente PatientView (Painel Minimalista do Paciente - RF-03, RF-04, RF-07 e RF-11)
// MedAgenda - UFPA 2026.1 - Design Simples e Elegante
import React, { useState } from 'react';
import { Calendar, Clock, Search, XCircle, FileText, PlusCircle, CheckCircle2, AlertCircle, User, Stethoscope } from 'lucide-react';

export default function PatientView({ user, consultas, medicos, especialidades, onAgendar, onCancelar, onShowToast }) {
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

  // Confirmação inline
  const [msgSucessoInline, setMsgSucessoInline] = useState('');

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
    setMsgSucessoInline('');
    if (!selMedicoId || !selData || !selHora) {
      setErroAg('Selecione Médico, Data e Horário.');
      return;
    }
    try {
      const novaConsulta = await onAgendar({
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
      setActiveTab('agendamentos');
      setMsgSucessoInline(`✓ Consulta de ${novaConsulta.especialidade} agendada para ${novaConsulta.data} às ${novaConsulta.hora} com ${novaConsulta.medicoNome}! (RF-03 e RF-08 confirmados)`);
    } catch (err) {
      setErroAg(err.message || 'Erro ao agendar consulta.');
    }
  }

  async function handleTentativaCancelamento(consulta) {
    setMsgSucessoInline('');
    if (window.confirm(`Confirma o cancelamento da consulta de ${consulta.especialidade} em ${consulta.data} às ${consulta.hora}?\n\nRegra do Requisito RF-04: O cancelamento só é autorizado com mais de 24 horas de antecedência do horário marcado.`)) {
      try {
        await onCancelar(consulta.id);
        setMsgSucessoInline(`✓ Consulta com ${consulta.medicoNome} cancelada com sucesso. Regra de antecedência verificada (RF-04).`);
      } catch (err) {
        onShowToast?.(err.message, 'danger');
        alert(`Não foi possível cancelar: ${err.message}`);
      }
    }
  }

  // Lista para busca de médicos com filtro (RF-07)
  const medicosParaExibir = medicos.filter(m => {
    if (filtroEspecBusca && m.especialidade !== filtroEspecBusca) return false;
    if (termoBusca && !m.nome.toLowerCase().includes(termoBusca.toLowerCase()) && !m.especialidade.toLowerCase().includes(termoBusca.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1040px', margin: '24px auto', padding: '0 24px' }}>
      
      {/* Cabeçalho Limpo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)' }}>
            Minhas Consultas e Prontuários
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginTop: '2px' }}>
            Olá, {user.nome.split(' ')[0]}. Gerencie seus atendimentos de forma simples e segura.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => {
            setSelEspec('');
            setSelMedicoId('');
            setShowModal(true);
          }}
        >
          <PlusCircle size={16} />
          Agendar Nova Consulta (RF-03)
        </button>
      </div>

      {/* Alerta de Confirmação Inline */}
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

      {/* Tabs Minimalistas */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'agendamentos' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('agendamentos')}
        >
          <Calendar size={15} /> Agendamentos Ativos ({agendamentosAtivos.length})
        </button>
        <button 
          className={`btn ${activeTab === 'busca' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('busca')}
        >
          <Search size={15} /> Especialistas e Clínicas (RF-07)
        </button>
        <button 
          className={`btn ${activeTab === 'historico' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('historico')}
        >
          <FileText size={15} /> Histórico e Laudos ({historicoConcluido.length})
        </button>
      </div>

      {/* Tab 1: Agendamentos */}
      {activeTab === 'agendamentos' && (
        <div className="clean-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Consultas Confirmadas</span>
            <span style={{ fontSize: '12px', color: 'var(--warning)', fontWeight: '500' }}>
              ℹ️ Cancelamento autorizado somente com &gt; 24h de antecedência (RF-04)
            </span>
          </div>

          {agendamentosAtivos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted-foreground)' }}>
              <p style={{ fontSize: '15px', fontWeight: '500' }}>Você não possui consultas agendadas no momento.</p>
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '14px', fontSize: '13px' }}
                onClick={() => setShowModal(true)}
              >
                + Marcar primeira consulta agora
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {agendamentosAtivos.map(c => (
                <div key={c.id} style={{
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius)',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  background: 'var(--card-bg)'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className={`badge badge-${c.status}`}>{c.status}</span>
                      <strong style={{ fontSize: '15px' }}>{c.especialidade}</strong>
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--foreground)' }}>
                      <strong>{c.medicoNome}</strong> • Data: <strong>{c.data}</strong> às <strong>{c.hora}</strong>
                    </div>
                    {c.observacao && (
                      <div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                        Anotação: {c.observacao}
                      </div>
                    )}
                  </div>

                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '7px 14px', fontSize: '13px' }}
                    onClick={() => handleTentativaCancelamento(c)}
                  >
                    Cancelar Consulta
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Busca de Médicos */}
      {activeTab === 'busca' && (
        <div className="clean-card">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Pesquisar por nome de especialista ou especialidade clínica..." 
              value={termoBusca}
              onChange={e => setTermoBusca(e.target.value)}
              style={{ flex: 1, minWidth: '220px' }}
            />
            <select 
              value={filtroEspecBusca} 
              onChange={e => setFiltroEspecBusca(e.target.value)}
              style={{ width: '220px' }}
            >
              <option value="">Todas as Especialidades ({especialidades.length})</option>
              {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          {medicosParaExibir.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted-foreground)' }}>
              <p style={{ fontSize: '14px' }}>Nenhum médico encontrado com esse filtro.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {medicosParaExibir.map(m => (
                <div key={m.id} style={{
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{m.nome}</h4>
                    <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '500' }}>{m.especialidade}</span>
                    <div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginTop: '8px', lineHeight: '1.5' }}>
                      <div>Registro CRM: {m.crm}</div>
                      <div>Valor Consulta: <strong style={{ color: 'var(--foreground)' }}>R$ {m.valorConsulta?.toFixed(2)}</strong></div>
                    </div>
                  </div>

                  <button 
                    className="btn btn-secondary" 
                    style={{ width: '100%', marginTop: '4px', fontWeight: '600', color: 'var(--primary)' }}
                    onClick={() => {
                      setSelEspec(m.especialidade);
                      setSelMedicoId(m.id);
                      setShowModal(true);
                    }}
                  >
                    Marcar Consulta →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Histórico e Prontuários */}
      {activeTab === 'historico' && (
        <div className="clean-card">
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Histórico de Atendimentos e Laudos (RF-11)</span>
          </div>

          {historicoConcluido.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted-foreground)' }}>
              <p style={{ fontSize: '14px' }}>Nenhum prontuário registrado no seu histórico até o momento.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {historicoConcluido.map(c => (
                <div key={c.id} style={{
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius)',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className={`badge badge-${c.status}`}>{c.status}</span>
                      <strong style={{ fontSize: '14px' }}>{c.especialidade} com {c.medicoNome}</strong>
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
                      Atendido em: {c.data} às {c.hora}
                    </span>
                  </div>

                  {c.prontuario ? (
                    <button 
                      className="btn btn-secondary" 
                      style={{ fontWeight: '600', color: 'var(--primary)' }}
                      onClick={() => setSelectedProntuario({ ...c.prontuario, consulta: c })}
                    >
                      <FileText size={15} /> Ver Prontuário & Laudo
                    </button>
                  ) : (
                    <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Sem laudo emitido</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Agendamento */}
      {showModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Agendar Consulta Médica (RF-03)</h3>
              <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setShowModal(false)}>✕</button>
            </div>

            {erroAg && (
              <div style={{ padding: '10px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '6px', fontSize: '13px', marginBottom: '14px' }}>
                {erroAg}
              </div>
            )}

            <form onSubmit={handleConfirmarAgendamento} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Especialidade Médica *</label>
                <select value={selEspec} onChange={e => { setSelEspec(e.target.value); setSelMedicoId(''); }} required>
                  <option value="">Selecione a especialidade...</option>
                  {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Médico(a) Responsável *</label>
                <select value={selMedicoId} onChange={e => setSelMedicoId(e.target.value)} required disabled={!selEspec && medicosFiltradosEspec.length === 0}>
                  <option value="">Selecione o profissional...</option>
                  {medicosFiltradosEspec.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nome} ({m.especialidade}) — R$ {m.valorConsulta?.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Data da Consulta *</label>
                  <input type="date" value={selData} min={getTomorrowDate()} onChange={e => setSelData(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Horário *</label>
                  <select value={selHora} onChange={e => setSelHora(e.target.value)} required disabled={!selMedicoId}>
                    <option value="">Selecione o horário</option>
                    {(medicoSelecionado?.gradeHoraria || ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00']).map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Observações (Sintomas ou motivo do agendamento)</label>
                <textarea rows={2} placeholder="Descreva brevemente seus sintomas..." value={obs} onChange={e => setObs(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, fontWeight: '600' }}>
                  Confirmar Agendamento →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal do Prontuário */}
      {selectedProntuario && (
        <div className="modal-overlay animate-fade-in" onClick={() => setSelectedProntuario(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Prontuário e Laudo Digital (RF-11)</h3>
              <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setSelectedProntuario(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: 'var(--foreground)' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '2px' }}>ANAMNESE E HISTÓRICO CLÍNICO</span>
                <p style={{ background: 'var(--secondary)', padding: '12px', borderRadius: '6px' }}>{selectedProntuario.anamnese}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '2px' }}>DIAGNÓSTICO OFICIAL (CID-10)</span>
                <p style={{ fontWeight: '600', color: 'var(--primary)', background: 'var(--primary-light)', padding: '10px 12px', borderRadius: '6px' }}>{selectedProntuario.diagnostico}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '2px' }}>PRESCRIÇÃO CLÍNICA / TRATAMENTO</span>
                <p style={{ whiteSpace: 'pre-line', background: 'var(--secondary)', padding: '12px', borderRadius: '6px' }}>{selectedProntuario.prescricao}</p>
              </div>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid var(--card-border)', paddingTop: '12px', fontSize: '12px', color: 'var(--muted-foreground)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🩺 Assinado por: <strong style={{ color: 'var(--foreground)' }}>{selectedProntuario.consulta?.medicoNome}</strong></span>
              <span>Emitido em: {selectedProntuario.dataRegistro}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
