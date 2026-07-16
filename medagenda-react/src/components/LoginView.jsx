// Componente LoginView (RF-02 Autenticação e RF-01 Cadastro de Paciente)
// MedAgenda - UFPA 2026.1 - Design Corporativo Limpo (Estilo SIDAMA)
import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, Activity, Shield } from 'lucide-react';

export default function LoginView({ onLogin, onRegister, loading }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('paciente@medagenda.com');
  const [senha, setSenha] = useState('123');
  const [erro, setErro] = useState('');

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
    try {
      await onLogin(email, senha);
    } catch (err) {
      setErro(err.message || 'Falha na autenticação.');
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setErro('');
    if (!cadNome || !cadEmail || !cadCpf) {
      setErro('Preencha pelo menos Nome, E-mail e CPF.');
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
    } catch (err) {
      setErro(err.message || 'Erro ao cadastrar.');
    }
  }

  return (
    <div style={{ maxWidth: '440px', margin: '48px auto', padding: '0 16px' }}>
      <div className="clean-card" style={{ padding: '32px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            padding: '12px',
            borderRadius: '50%',
            marginBottom: '16px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={24} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>
            {isRegistering ? 'Cadastrar Novo Paciente' : 'Acesso ao Sistema'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginTop: '6px' }}>
            {isRegistering 
              ? 'Preencha seus dados para criar seu cadastro no prontuário eletrônico' 
              : 'Digite suas credenciais de acesso para entrar na plataforma'}
          </p>
        </div>

        {erro && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            fontSize: '13px',
            marginBottom: '18px',
            textAlign: 'center',
            border: '1px solid var(--danger)'
          }}>
            {erro}
          </div>
        )}

        {!isRegistering ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px', color: 'var(--foreground)' }}>
                E-mail
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="nome@medagenda.com" 
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px', color: 'var(--foreground)' }}>
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
              style={{ marginTop: '8px', width: '100%', height: '44px', fontSize: '15px' }} 
              disabled={loading}
            >
              <LogIn size={18} />
              {loading ? 'Autenticando...' : 'Entrar'}
            </button>

            <div style={{
              textAlign: 'center',
              marginTop: '16px',
              borderTop: '1px solid var(--border)',
              paddingTop: '16px'
            }}>
              <button 
                type="button" 
                onClick={() => setIsRegistering(true)} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <UserPlus size={16} />
                Criar nova conta de paciente (RF-01)
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Nome Completo:</label>
              <input type="text" value={cadNome} onChange={e => setCadNome(e.target.value)} required placeholder="ex: Ana Beatriz Gomes" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>E-mail:</label>
                <input type="email" value={cadEmail} onChange={e => setCadEmail(e.target.value)} required placeholder="ana@email.com" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Senha:</label>
                <input type="password" value={cadSenha} onChange={e => setCadSenha(e.target.value)} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>CPF:</label>
                <input type="text" value={cadCpf} onChange={e => setCadCpf(e.target.value)} required placeholder="000.000.000-00" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Data de Nascimento:</label>
                <input type="date" value={cadNasc} onChange={e => setCadNasc(e.target.value)} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Telefone / WhatsApp:</label>
              <input type="text" value={cadTel} onChange={e => setCadTel(e.target.value)} placeholder="(91) 99999-8888" />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Endereço:</label>
              <input type="text" value={cadEnd} onChange={e => setCadEnd(e.target.value)} placeholder="Av. Almirante Barroso, 200" />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsRegistering(false)}>
                Voltar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                <UserPlus size={16} />
                Cadastrar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
