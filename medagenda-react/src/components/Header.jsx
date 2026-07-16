// Componente Header (Cabeçalho com Seletor Rápido Demo, Alertas RF-08 e Modo Dark/Light)
// MedAgenda - UFPA 2026.1
import React, { useState } from 'react';
import { Activity, Bell, Moon, Sun, Zap, LogOut, CheckCircle, User } from 'lucide-react';

export default function Header({ user, onSelectProfile, onLogout, theme, onToggleTheme, notificacoes }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const nLidasCount = notificacoes.filter(n => !n.lida && (!user || n.usuarioId === user.id)).length;

  return (
    <header className="app-header">
      <div className="logo-area">
        <div className="logo-icon">
          <Activity size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '20px', lineHeight: '1.1' }}>MedAgenda</h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SPA React • Node/Express • PostgreSQL/Prisma</p>
        </div>
      </div>

      {/* Seletor Rápido para Avaliação do Professor (RF-02 Demo) */}
      <div className="demo-switcher">
        <Zap size={14} color="var(--warning)" />
        <span>Modo Avaliação:</span>
        <button 
          className={`demo-btn ${user?.role === 'paciente' ? 'active' : ''}`}
          onClick={() => onSelectProfile('paciente')}
        >
          🧑‍💼 Paciente (Maria)
        </button>
        <button 
          className={`demo-btn ${user?.role === 'medico' ? 'active' : ''}`}
          onClick={() => onSelectProfile('medico')}
        >
          👨‍⚕️ Médico (Dr. Carlos)
        </button>
        <button 
          className={`demo-btn ${user?.role === 'admin' ? 'active' : ''}`}
          onClick={() => onSelectProfile('admin')}
        >
          ⚙️ Admin Geral
        </button>
      </div>

      <div className="header-actions">
        {/* Notificações e Lembretes (RF-08 / RF-11) */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px 12px', position: 'relative' }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              {nLidasCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--danger)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {nLidasCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="glass-panel" style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '340px',
                maxHeight: '380px',
                overflowY: 'auto',
                zIndex: 1500,
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px' }}>🔔 Alertas & Lembretes</h4>
                  <span style={{ fontSize: '11px', color: 'var(--primary)' }}>RF-08 / RF-11</span>
                </div>
                {notificacoes.filter(n => !user || n.usuarioId === user.id).length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                    Nenhuma notificação no momento.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {notificacoes
                      .filter(n => !user || n.usuarioId === user.id)
                      .map((n) => (
                        <div key={n.id} style={{
                          padding: '10px',
                          borderRadius: '12px',
                          background: n.lida ? 'var(--bg-subtle)' : 'var(--success-bg)',
                          borderLeft: '4px solid var(--primary)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong style={{ fontSize: '12px' }}>{n.titulo}</strong>
                            <small style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{n.data}</small>
                          </div>
                          <p style={{ fontSize: '12px', marginTop: '4px' }}>{n.mensagem}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Botão de Tema */}
        <button 
          className="btn btn-secondary" 
          style={{ padding: '8px 12px' }}
          onClick={onToggleTheme}
          title="Alternar Tema Claro/Escuro"
        >
          {theme === 'dark' ? <Sun size={18} color="#FFD700" /> : <Moon size={18} />}
        </button>

        {/* Info do Usuário e Logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-subtle)', padding: '6px 14px', borderRadius: '40px', border: '1px solid var(--card-border)' }}>
            <User size={16} color="var(--primary)" />
            <span style={{ fontSize: '13px', fontWeight: '600' }}>{user.nome.split(' ')[0]}</span>
            <button 
              onClick={onLogout} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', display: 'flex', alignItems: 'center' }}
              title="Sair (Logout)"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Não autenticado</span>
        )}
      </div>
    </header>
  );
}
