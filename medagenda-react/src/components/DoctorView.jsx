// Componente DoctorView (Painel Minimalista do Médico - RF-05, RF-06 e RF-12)
// MedAgenda - UFPA 2026.1
import React, { useState } from 'react';
import { Calendar, Clock, Stethoscope, Settings, CheckCircle2, FileText, User } from 'lucide-react';

export default function DoctorView({ user, consultas, onRegistrarProntuario, onShowToast }) {
  const [activeTab, setActiveTab] = useState('agenda'); // 'agenda', 'horarios'
  const [dataFiltro, setDataFiltro] = useState('');
  const [turnoFiltro, setTurnoFiltro] = useState(''); // '', 'manha', 'tarde'
  
  // Confirmação Inline
  const [msgSucessoInline, setMsgSucessoInline] = useState('');

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
    setMsgSucessoInline('');
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
      setMsgSucessoInline(`✓ Prontuário de ${consultaSelecionada.pacienteNome} assinado e registrado com sucesso no histórico da clínica (RF-06)!`);
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
    onShowToast?.('Grade de horários atualizada com sucesso (RF-12)!', 'success');
    setTimeout(() => setSucessoHorarios(false), 4000);
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1040px', margin: '24px auto', padding: '0 24px' }}>
      
      {/* Cabeçalho Minimalista */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)' }}>
            Painel do Médico — {user.nome}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginTop: '2px' }}>
            {user.especialidade} • Registro CRM: {user.crm}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${activeTab === 'agenda' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('agenda')}
          >
            <Calendar size={15} /> Agenda Médica (RF-05)
          </button>
          <button 
            className={`btn ${activeTab === 'horarios' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('horarios')}
          >
            <Settings size={15} /> Horários de Atendimento (RF-12)
          </button>
        </div>
      </div>

      {/* Alerta Inline de Sucesso (Prontuário assinado) */}
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

      {activeTab === 'agenda' ? (
        <div className="clean-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>Fila de Atendimentos e Pacientes ({consultasFiltradas.length})</span>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input 
                type="date" 
                value={dataFiltro} 
                onChange={e => setDataFiltro(e.target.value)} 
                style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
              />
              <select 
                value={turnoFiltro} 
                onChange={e => setTurnoFiltro(e.target.value)}
                style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
              >
                <option value="">Todos os Turnos</option>
                <option value="manha">Manhã (&lt; 12h)</option>
                <option value="tarde">Tarde (≥ 12h)</option>
              </select>
              {(dataFiltro || turnoFiltro) && (
                <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => { setDataFiltro(''); setTurnoFiltro(''); }}>
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Horário / Data</th>
                  <th>Paciente</th>
                  <th>Motivo / Queixa</th>
                  <th>Status</th>
                  <th>Ação Clínica (RF-06)</th>
                </tr>
              </thead>
              <tbody>
                {consultasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted-foreground)' }}>
                      Nenhuma consulta agendada encontrada com esses filtros.
                    </td>
                  </tr>
                ) : (
                  consultasFiltradas.map(c => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.data}</strong><br />
                        <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{c.hora}</span>
                      </td>
                      <td>
                        <strong style={{ fontSize: '15px' }}>{c.pacienteNome}</strong>
                      </td>
                      <td style={{ maxWidth: '240px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
                        {c.observacao || 'Consulta eletiva normal'}
                      </td>
                      <td>
                        <span className={`badge badge-${c.status}`}>{c.status}</span>
                      </td>
                      <td>
                        {c.status === 'CONCLUIDA' && c.prontuario ? (
                          <span style={{ fontSize: '13px', color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={15} /> Prontuário Assinado
                          </span>
                        ) : c.status === 'CANCELADA' ? (
                          <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Consulta Cancelada</span>
                        ) : (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '6px 14px', fontSize: '13px', fontWeight: '600' }}
                            onClick={() => {
                              setConsultaSelecionada(c);
                              setAnamnese(c.observacao ? `Relato e queixa informada pelo paciente: ${c.observacao}\n\nEvolução clínica: ` : 'Paciente compareceu ao consultório relatando...');
                            }}
                          >
                            Registrar Laudo / CID-10 →
                          </button>
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
        <div className="clean-card" style={{ maxWidth: '640px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>Configurar Grade e Dias de Atendimento (RF-12)</span>
          </div>

          {sucessoHorarios && (
            <div className="animate-fade-in" style={{ padding: '12px 14px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', border: '1px solid var(--success)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              ✓ Horários de atendimento e dias da semana salvos e sincronizados com sucesso!
            </div>
          )}

          <form onSubmit={handleSalvarHorarios} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                Selecione os Dias da Semana Disponíveis:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(dia => {
                  const ativo = diasAtendimento.includes(dia);
                  return (
                    <button
                      type="button"
                      key={dia}
                      onClick={() => {
                        if (ativo) setDiasAtendimento(diasAtendimento.filter(d => d !== dia));
                        else setDiasAtendimento([...diasAtendimento, dia]);
                      }}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        fontWeight: '500',
                        fontSize: '13px',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: ativo ? 'var(--primary)' : 'var(--card-border)',
                        background: ativo ? 'var(--primary)' : 'transparent',
                        color: ativo ? '#ffffff' : 'var(--foreground)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {dia} {ativo && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                Horários Disponíveis para Marcação (Separados por vírgula):
              </label>
              <input 
                type="text" 
                value={gradeHorariaStr} 
                onChange={e => setGradeHorariaStr(e.target.value)} 
                placeholder="08:00, 09:30, 11:00, 14:00, 15:30, 17:00"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', fontWeight: '600' }}>
              Salvar Nova Grade de Horários →
            </button>
          </form>
        </div>
      )}

      {/* Modal Prontuário */}
      {consultaSelecionada && (
        <div className="modal-overlay animate-fade-in" onClick={() => setConsultaSelecionada(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Assinar Prontuário Digital (RF-06)</h3>
              <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setConsultaSelecionada(null)}>✕</button>
            </div>

            {erroPront && (
              <div style={{ padding: '10px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '6px', fontSize: '13px', marginBottom: '14px' }}>
                {erroPront}
              </div>
            )}

            <form onSubmit={handleSalvarProntuario} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Anamnese e Exame Clínico *</label>
                <textarea rows={3} value={anamnese} onChange={e => setAnamnese(e.target.value)} required placeholder="Relate o histórico, sintomas relatados e evolução..." />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Diagnóstico / Código CID-10 *</label>
                <input type="text" value={diagnostico} onChange={e => setDiagnostico(e.target.value)} required placeholder="ex: I10 - Hipertensão essencial" />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Prescrição Médica e Orientações *</label>
                <textarea rows={3} value={prescricao} onChange={e => setPrescricao(e.target.value)} required placeholder="Prescrição de medicamentos, repouso e exames recomendados..." />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setConsultaSelecionada(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, fontWeight: '600' }}>
                  Assinar Laudo e Anexar →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
