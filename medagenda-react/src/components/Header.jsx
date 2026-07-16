// Componente Header (Cabeçalho com Seletor Rápido Demo, Alertas RF-08 e Modo Dark/Light)
// MedAgenda - UFPA 2026.1 - Design Corporativo Limpo
import React, { useState } from 'react';
import { Activity, Bell, Moon, Sun, Shield, LogOut, User, Stethoscope, Settings } from 'lucide-react';

export default function Header({ user, onSelectProfile, onLogout, theme, onToggleTheme, notificacoes }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const nLidasCount = notificacoes.filter(n => !n.lida && (!user || n.usuarioId === user.id)).length;

  return (
    <header className="app-header">
      <div className="logo-area">
        <div className="logo-icon">
          <Activity size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', lineHeight: '1.2', fontWeight: '700' }}>MedAgenda</h2>
          <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: '500' }}>Sistema de Agendamento e Prontuário</p>
        </div>
      </div>

      {/* Seletor Rápido para Avaliação (RF-02) */}
      <div className="demo-switcher">
        <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginRight: '4px' }}>Modo Avaliação:</span>
        <button 
          className={`demo-btn ${user?.role === 'paciente' ? 'active' : ''}`}
          onClick={() => onSelectProfile('paciente')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <User size={13} /> Paciente (Maria)
          </span>
        </button>
        <button 
          className={`demo-btn ${user?.role === 'medico' ? 'active' : ''}`}
          onClick={() => onSelectProfile('medico')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Stethoscope size={13} /> Médico (Dr. Carlos)
          </span>
        </button>
        <button 
          className={`demo-btn ${user?.role === 'admin' ? 'active' : ''}`}
          onClick={() => onSelectProfile('admin')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Settings size={13} /> Admin Geral
          </span>
        </button>
      </div>

      <div className="header-actions">
        {/* Notificações e Lembretes (RF-08 / RF-11) */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px 10px', position: 'relative' }}
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notificações (RF-08)"
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
              <div className="clean-card" style={{
                position: 'absolute',
                right: 0,
                top: '44px',
                width: '320px',
                maxHeight: '360px',
                overflowY: 'auto',
                zIndex: 1500,
                padding: '16px',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Alertas & Lembretes</h4>
                  <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600' }}>RF-08</span>
                </div>
                {notificacoes.filter(n => !user || n.usuarioId === user.id).length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', textAlign: 'center', padding: '16px 0' }}>
                    Nenhuma notificação no momento.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {notificacoes
                      .filter(n => !user || n.usuarioId === user.id)
                      .map((n) => (
                        <div key={n.id} style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: n.lida ? 'var(--secondary)' : 'var(--success-bg)',
                          borderLeft: '3px solid var(--primary)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong style={{ fontSize: '12px' }}>{n.titulo}</strong>
                            <small style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{n.data}</small>
                          </div>
                          <p style={{ fontSize: '12px', marginTop: '4px', color: 'var(--foreground)' }}>{n.mensagem}</p>
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
          style={{ padding: '8px 10px' }}
          onClick={onToggleTheme}
          title="Alternar Tema Claro/Escuro"
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} />}
        </button>

        {/* Info do Usuário e Logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--secondary)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <User size={15} color="var(--primary)" />
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
          <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Não autenticado</span>
        )}
      </div>
    </header>
  );
}
