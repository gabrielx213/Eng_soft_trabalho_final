// Componente LoginView (Acesso Limpo e Minimalista ao Sistema - RF-02 / RF-01)
// MedAgenda - UFPA 2026.1
import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, Activity, CheckCircle2 } from 'lucide-react';

export default function LoginView({ onLogin, onRegister, loading, onShowToast }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('paciente@medagenda.com');
  const [senha, setSenha] = useState('123');
  const [erro, setErro] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');

  // Estados do form de cadastro (RF-01)
  const [cadNome, setCadNome] = useState('');
  const [cadEmail, setCadEmail] = useState('');
  const [cadSenha, setCadSenha] = useState('123');
  const [cadCpf, setCadCpf] = useState('');
  const [cadNasc, setCadNasc] = useState('');
  const [cadTel, setCadTel] = useState('');
  const [cadEnd, setCadEnd] = useState('');

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setErro('');
    setSucessoMsg('');
    try {
      await onLogin(email, senha);
    } catch (err) {
      setErro(err.message || 'Falha na autenticação. Verifique suas credenciais.');
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setErro('');
    setSucessoMsg('');
    if (!cadNome || !cadEmail || !cadCpf) {
      setErro('Preencha pelo menos Nome, E-mail e CPF para concluir o cadastro.');
      return;
    }
    try {
      await onRegister({
        nome: cadNome,
        email: cadEmail,
        senha: cadSenha,
        cpf: cadCpf,
        dataNascimento: cadNasc,
        telefone: cadTel,
        endereco: cadEnd
      });
      setSucessoMsg(`✓ Cadastro concluído com sucesso (RF-01)! Perfil de ${cadNome} criado.`);
    } catch (err) {
      setErro(err.message || 'Erro ao cadastrar paciente.');
    }
  }

  function preencherAcessoRapido(emailDemo, senhaDemo = '123') {
    setEmail(emailDemo);
    setSenha(senhaDemo);
    setIsRegistering(false);
    setErro('');
    onShowToast?.(`Credenciais rápidas preenchidas: ${emailDemo}`, 'info');
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 140px)', padding: '24px' }}>
      
      {/* Cabeçalho Minimalista da Página de Login */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto 12px' }}>
          <Activity size={24} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>MedAgenda</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
          Portal de Prontuário Eletrônico e Agendamento Inteligente
        </p>
      </div>

      {/* Card Minimalista */}
      <div className="clean-card" style={{ width: '100%', maxWidth: '420px', padding: '32px' }}>
        
        <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', marginBottom: '24px' }}>
          <button 
            type="button"
            onClick={() => { setIsRegistering(false); setErro(''); setSucessoMsg(''); }}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: !isRegistering ? '600' : '400',
              color: !isRegistering ? 'var(--primary)' : 'var(--muted-foreground)',
              borderBottom: !isRegistering ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              marginBottom: '-1px'
            }}
          >
            Entrar no Sistema
          </button>
          <button 
            type="button"
            onClick={() => { setIsRegistering(true); setErro(''); setSucessoMsg(''); }}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: isRegistering ? '600' : '400',
              color: isRegistering ? 'var(--primary)' : 'var(--muted-foreground)',
              borderBottom: isRegistering ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              marginBottom: '-1px'
            }}
          >
            Cadastrar Paciente (RF-01)
          </button>
        </div>

        {/* Banners Inline de Erro e Sucesso */}
        {erro && (
          <div style={{
            padding: '12px 14px',
            borderRadius: '6px',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            fontSize: '13px',
            marginBottom: '16px',
            border: '1px solid var(--danger)',
            fontWeight: '500'
          }}>
            {erro}
          </div>
        )}

        {sucessoMsg && (
          <div style={{
            padding: '12px 14px',
            borderRadius: '6px',
            background: 'var(--success-bg)',
            color: 'var(--success)',
            fontSize: '13px',
            marginBottom: '16px',
            border: '1px solid var(--success)',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} />
            {sucessoMsg}
          </div>
        )}

        {!isRegistering ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px', color: 'var(--foreground)' }}>
                E-mail de Acesso
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="paciente@medagenda.com" 
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px', color: 'var(--foreground)' }}>
                Senha
              </label>
              <input 
                type="password" 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ marginTop: '4px', height: '42px', fontSize: '14px' }} 
              disabled={loading}
            >
              {loading ? 'Validando Acesso...' : 'Entrar na Plataforma →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>Nome Completo *</label>
              <input type="text" value={cadNome} onChange={e => setCadNome(e.target.value)} required placeholder="Sua identificação completa" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>E-mail *</label>
                <input type="email" value={cadEmail} onChange={e => setCadEmail(e.target.value)} required placeholder="email@exemplo.com" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>Senha *</label>
                <input type="password" value={cadSenha} onChange={e => setCadSenha(e.target.value)} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>CPF *</label>
                <input type="text" value={cadCpf} onChange={e => setCadCpf(e.target.value)} required placeholder="000.000.000-00" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>Nascimento</label>
                <input type="date" value={cadNasc} onChange={e => setCadNasc(e.target.value)} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>Telefone / WhatsApp</label>
              <input type="text" value={cadTel} onChange={e => setCadTel(e.target.value)} placeholder="(91) 99999-8888" />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsRegistering(false)}>
                Voltar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                Concluir Cadastro
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Acesso rápido demo e instruções limpas */}
      <div style={{ marginTop: '24px', textAlign: 'center', maxWidth: '420px' }}>
        <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '10px' }}>
          Atalhos de preenchimento instantâneo (Teste da Banca):
        </span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => preencherAcessoRapido('paciente@medagenda.com')}
          >
            🧑 Paciente Demo
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => preencherAcessoRapido('medico@medagenda.com')}
          >
            🩺 Médico Demo
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => preencherAcessoRapido('admin@medagenda.com')}
          >
            ⚙️ Admin Demo
          </button>
        </div>
      </div>

    </div>
  );
}
