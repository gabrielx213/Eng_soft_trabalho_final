// Componente DoctorView (Painel do Médico - RF-05 Agenda, RF-06 Prontuário e RF-12 Horários)
// MedAgenda - UFPA 2026.1 - Design Corporativo Limpo (Estilo SIDAMA)
import React, { useState } from 'react';
import { Calendar, Clock, Stethoscope, Settings, CheckCircle2, FileText, User, X } from 'lucide-react';

export default function DoctorView({ user, consultas, onRegistrarProntuario }) {
  const [activeTab, setActiveTab] = useState('agenda'); // 'agenda', 'horarios'
  const [dataFiltro, setDataFiltro] = useState('');
  const [turnoFiltro, setTurnoFiltro] = useState(''); // '', 'manha', 'tarde'
  
  // Modal de Prontuário (RF-06)
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [anamnese, setAnamnese] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [prescricao, setPrescricao] = useState('');
  const [erroPront, setErroPront] = useState('');

  // Gestão de Horários (RF-12)
  const [diasAtendimento, setDiasAtendimento] = useState(user.diasAtendimento || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']);
  const [gradeHorariaStr, setGradeHorariaStr] = useState((user.gradeHoraria || ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00']).join(', '));
  const [sucessoHorarios, setSucessoHorarios] = useState(false);

  const consultasMedico = consultas.filter(c => c.medicoId === user.id);
  
  const consultasFiltradas = consultasMedico.filter(c => {
    if (dataFiltro && c.data !== dataFiltro) return false;
    if (turnoFiltro === 'manha') {
      const hora = parseInt(c.hora.split(':')[0], 10);
      if (hora >= 12) return false;
    }
    if (turnoFiltro === 'tarde') {
      const hora = parseInt(c.hora.split(':')[0], 10);
      if (hora < 12) return false;
    }
    return true;
  });

  async function handleSalvarProntuario(e) {
    e.preventDefault();
    setErroPront('');
    if (!anamnese || !diagnostico || !prescricao) {
      setErroPront('Preencha Anamnese, CID-10 e Prescrição para assinar o laudo.');
      return;
    }
    try {
      await onRegistrarProntuario({
        consultaId: consultaSelecionada.id,
        anamnese,
        diagnostico,
        prescricao
      });
      setConsultaSelecionada(null);
      setAnamnese('');
      setDiagnostico('');
      setPrescricao('');
    } catch (err) {
      setErroPront(err.message || 'Erro ao registrar prontuário.');
    }
  }

  function handleSalvarHorarios(e) {
    e.preventDefault();
    const novaGrade = gradeHorariaStr.split(',').map(h => h.trim()).filter(Boolean);
    user.diasAtendimento = diasAtendimento;
    user.gradeHoraria = novaGrade;
    setSucessoHorarios(true);
    setTimeout(() => setSucessoHorarios(false), 3000);
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 16px' }}>
      {/* Top Banner */}
      <div className="clean-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Stethoscope size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Painel do Médico — Dr(a). {user.nome.split(' ').slice(0, 2).join(' ')}</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Especialidade: <strong style={{ color: 'var(--foreground)' }}>{user.especialidade}</strong> | CRM: <strong style={{ color: 'var(--foreground)' }}>{user.crm}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`btn ${activeTab === 'agenda' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('agenda')}
          >
            <Calendar size={16} /> Agenda Diária (RF-05)
          </button>
          <button 
            className={`btn ${activeTab === 'horarios' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('horarios')}
          >
            <Settings size={16} /> Configurar Horários (RF-12)
          </button>
        </div>
      </div>

      {activeTab === 'agenda' ? (
        <div className="clean-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Atendimentos e Agenda Médica</h4>
            
            {/* Filtros da Agenda */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input 
                type="date" 
                value={dataFiltro} 
                onChange={e => setDataFiltro(e.target.value)} 
                style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
              />
              <select 
                value={turnoFiltro} 
                onChange={e => setTurnoFiltro(e.target.value)}
                style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
              >
                <option value="">Todos os Turnos</option>
                <option value="manha">Turno Manhã (&lt; 12h)</option>
                <option value="tarde">Turno Tarde (≥ 12h)</option>
              </select>
              {(dataFiltro || turnoFiltro) && (
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => { setDataFiltro(''); setTurnoFiltro(''); }}>
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Horário & Data</th>
                  <th>Paciente</th>
                  <th>Motivo / Observação</th>
                  <th>Status</th>
                  <th>Ação Clínica (RF-06)</th>
                </tr>
              </thead>
              <tbody>
                {consultasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted-foreground)' }}>
                      Nenhuma consulta encontrada para o filtro selecionado.
                    </td>
                  </tr>
                ) : (
                  consultasFiltradas.map(c => (
                    <tr key={c.id}>
                      <td>
                        <strong style={{ fontSize: '14px', color: 'var(--foreground)' }}>{c.data}</strong><br />
                        <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Clock size={13} /> {c.hora}
                        </span>
                      </td>
                      <td><strong style={{ fontWeight: '600' }}>{c.pacienteNome}</strong></td>
                      <td style={{ maxWidth: '240px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{c.observacao || '—'}</td>
                      <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                      <td>
                        {c.status === 'CONFIRMADA' || c.status === 'AGENDADA' ? (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '7px 14px', fontSize: '13px' }}
                            onClick={() => {
                              setConsultaSelecionada(c);
                              setAnamnese('');
                              setDiagnostico('');
                              setPrescricao('');
                            }}
                          >
                            <Stethoscope size={15} />
                            Iniciar Prontuário
                          </button>
                        ) : c.status === 'CONCLUIDA' ? (
                          <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={15} /> Prontuário Assinado
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Cancelado</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Aba Configurar Horários (RF-12) */
        <div className="clean-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '14px' }}>Gestão de Horários Disponíveis para Agendamento (RF-12)</h4>
          <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '20px' }}>
            Defina os dias da semana e os intervalos de horários livres que serão disponibilizados no portal dos pacientes.
          </p>

          {sucessoHorarios && (
            <div style={{ padding: '12px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center', fontWeight: '600' }}>
              Grade horária salva com sucesso no sistema!
            </div>
          )}

          <form onSubmit={handleSalvarHorarios} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Dias de Atendimento na Clínica:</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(dia => {
                  const checked = diasAtendimento.includes(dia);
                  return (
                    <button
                      key={dia}
                      type="button"
                      className={`btn ${checked ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 14px', fontSize: '13px' }}
                      onClick={() => {
                        if (checked) setDiasAtendimento(diasAtendimento.filter(d => d !== dia));
                        else setDiasAtendimento([...diasAtendimento, dia]);
                      }}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Grade Horária (Separada por vírgula):</label>
              <input 
                type="text" 
                value={gradeHorariaStr} 
                onChange={e => setGradeHorariaStr(e.target.value)} 
                placeholder="08:00, 09:00, 10:00, 14:00, 15:00, 16:00"
              />
              <small style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px', display: 'block' }}>
                Exemplo: 08:00, 09:30, 11:00, 14:30, 16:00
              </small>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
              Salvar Grade de Atendimento
            </button>
          </form>
        </div>
      )}

      {/* Modal de Registro de Prontuário (RF-06) */}
      {consultaSelecionada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stethoscope size={20} color="var(--primary)" />
                <h4 style={{ fontSize: '16px', fontWeight: '700' }}>Registro de Prontuário Eletrônico (RF-06)</h4>
              </div>
              <button onClick={() => setConsultaSelecionada(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--secondary)', padding: '14px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', border: '1px solid var(--border)' }}>
              <p style={{ marginBottom: '4px' }}><strong>Paciente:</strong> {consultaSelecionada.pacienteNome}</p>
              <p style={{ marginBottom: '4px' }}><strong>Data & Hora:</strong> {consultaSelecionada.data} às {consultaSelecionada.hora}</p>
              <p><strong>Motivo / Observação:</strong> {consultaSelecionada.observacao || '—'}</p>
            </div>

            {erroPront && <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>{erroPront}</div>}

            <form onSubmit={handleSalvarProntuario} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Anamnese / Queixa Principal e Exame Físico:</label>
                <textarea 
                  rows={3} 
                  value={anamnese} 
                  onChange={e => setAnamnese(e.target.value)} 
                  required 
                  placeholder="Relato clínico, tempo de evolução e achados do exame físico..." 
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Diagnóstico Clínico / Código CID-10:</label>
                <input 
                  type="text" 
                  value={diagnostico} 
                  onChange={e => setDiagnostico(e.target.value)} 
                  required 
                  placeholder="ex: I10 - Hipertensão essencial ou J06 - Infecção aguda" 
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Prescrição Médica e Orientações Terapêuticas:</label>
                <textarea 
                  rows={4} 
                  value={prescricao} 
                  onChange={e => setPrescricao(e.target.value)} 
                  required 
                  placeholder="1. Medicamento X 500mg 8/8h por 7 dias&#10;2. Repouso por 3 dias&#10;3. Retorno com exames de laboratório" 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setConsultaSelecionada(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  <CheckCircle2 size={18} />
                  Assinar Prontuário e Concluir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
