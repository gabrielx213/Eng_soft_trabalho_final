// Componente LoginView (RF-02 Autenticação e RF-01 Cadastro de Paciente)
// MedAgenda - UFPA 2026.1
import React, { useState } from 'react';
import { LogIn, UserPlus, Shield, Activity } from 'lucide-react';

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
    <div style={{ maxWidth: '480px', margin: '40px auto' }}>
      <div className="glass-panel">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="logo-icon" style={{ margin: '0 auto 12px', width: '56px', height: '56px' }}>
            <Activity size={32} />
          </div>
          <h3>{isRegistering ? 'Cadastrar Novo Paciente (RF-01)' : 'Acesso à MedAgenda (RF-02)'}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isRegistering 
              ? 'Informe seus dados para criar seu prontuário digital' 
              : 'Faça login ou use os botões rápidos acima do cabeçalho'}
          </p>
        </div>

        {erro && (
          <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
            ⚠️ {erro}
          </div>
        )}

        {!isRegistering ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>E-mail de Acesso:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="ex: paciente@medagenda.com" 
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Senha:</label>
              <input 
                type="password" 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={loading}>
              <LogIn size={18} />
              {loading ? 'Validando...' : 'Entrar no Sistema'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
              <button 
                type="button" 
                onClick={() => setIsRegistering(true)} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <UserPlus size={16} />
                + Cadastrar Novo Paciente (RF-01)
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600' }}>Nome Completo:</label>
              <input type="text" value={cadNome} onChange={e => setCadNome(e.target.value)} required placeholder="ex: Ana Beatriz Gomes" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>E-mail:</label>
                <input type="email" value={cadEmail} onChange={e => setCadEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Senha:</label>
                <input type="password" value={cadSenha} onChange={e => setCadSenha(e.target.value)} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>CPF:</label>
                <input type="text" value={cadCpf} onChange={e => setCadCpf(e.target.value)} required placeholder="000.000.000-00" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Data de Nascimento:</label>
                <input type="date" value={cadNasc} onChange={e => setCadNasc(e.target.value)} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600' }}>Telefone / WhatsApp:</label>
              <input type="text" value={cadTel} onChange={e => setCadTel(e.target.value)} placeholder="(91) 99999-8888" />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600' }}>Endereço:</label>
              <input type="text" value={cadEnd} onChange={e => setCadEnd(e.target.value)} placeholder="Av. Almirante Barroso, 200" />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsRegistering(false)}>
                Voltar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                Confirmar Cadastro (RF-01)
              </button>
            </div>
          </form>
        )}

        {/* Dica do Modo de Avaliação */}
        <div style={{ marginTop: '24px', padding: '14px', borderRadius: '14px', background: 'var(--bg-subtle)', border: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '12px', color: 'var(--primary)' }}>
            <Shield size={16} />
            DICA PARA BANCA EXAMINADORA:
          </div>
          <p style={{ fontSize: '12px', marginTop: '6px', lineHeight: '1.4' }}>
            Você não precisa digitar e-mail e senha! Utilize o seletor <strong>⚡ Modo Avaliação</strong> no topo do cabeçalho para alternar instantaneamente entre o Paciente, o Médico e o Administrador Geral com todos os dados carregados do banco.
          </p>
        </div>
      </div>
    </div>
  );
}
