// Componente Header (Cabeçalho Limpo, Simples e Elegante)
// MedAgenda - UFPA 2026.1
import React, { useState } from 'react';
import { Activity, Bell, Moon, Sun, LogOut, User, Stethoscope, Settings, CheckCheck } from 'lucide-react';

export default function Header({ user, onSelectProfile, onLogout, theme, onToggleTheme, notificacoes, onMarcarLidas }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const nLidasCount = notificacoes.filter(n => !n.lida && (!user || n.usuarioId === user.id)).length;

  return (
    <header className="app-header">
      <div className="logo-area">
        <div className="logo-icon">
          <Activity size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '17px', fontWeight: '700', color: 'var(--foreground)' }}>MedAgenda</span>
            <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', background: 'var(--secondary)', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>UFPA</span>
          </div>
        </div>
      </div>

      {/* Seletor Minimalista (Modo Avaliação Demo para Professor) */}
      <div className="demo-switcher">
        <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', padding: '0 8px' }}>Perfis Demo:</span>
        <button 
          className={`demo-btn ${user?.role === 'paciente' ? 'active' : ''}`}
          onClick={() => onSelectProfile('paciente')}
        >
          <User size={14} /> Paciente
        </button>
        <button 
          className={`demo-btn ${user?.role === 'medico' ? 'active' : ''}`}
          onClick={() => onSelectProfile('medico')}
        >
          <Stethoscope size={14} /> Médico
        </button>
        <button 
          className={`demo-btn ${user?.role === 'admin' ? 'active' : ''}`}
          onClick={() => onSelectProfile('admin')}
        >
          <Settings size={14} /> Admin
        </button>
      </div>

      <div className="header-actions">
        {/* Notificações (RF-08) */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px', borderRadius: '6px', position: 'relative' }}
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notificações e Avisos (RF-08)"
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
                  width: '16px',
                  height: '16px',
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
              <div className="clean-card animate-fade-in" style={{
                position: 'absolute',
                right: 0,
                top: '44px',
                width: '340px',
                maxHeight: '400px',
                overflowY: 'auto',
                zIndex: 1500,
                padding: '16px',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Central de Avisos (RF-08)</span>
                  {nLidasCount > 0 && (
                    <button 
                      onClick={onMarcarLidas}
                      style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <CheckCheck size={14} /> Ler todas
                    </button>
                  )}
                </div>
                {notificacoes.filter(n => !user || n.usuarioId === user.id).length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', textAlign: 'center', padding: '24px 0' }}>
                    Nenhuma notificação registrada.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notificacoes
                      .filter(n => !user || n.usuarioId === user.id)
                      .map((n) => (
                        <div key={n.id} style={{
                          padding: '12px',
                          borderRadius: '6px',
                          background: n.lida ? 'var(--secondary)' : 'var(--success-bg)',
                          borderLeft: '3px solid var(--primary)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong style={{ fontSize: '12px' }}>{n.titulo}</strong>
                            <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{n.data}</span>
                          </div>
                          <p style={{ fontSize: '12px', marginTop: '4px', color: n.lida ? 'var(--muted-foreground)' : 'var(--foreground)' }}>
                            {n.mensagem}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tema */}
        <button 
          className="btn btn-secondary" 
          style={{ padding: '8px', borderRadius: '6px' }}
          onClick={onToggleTheme}
          title="Alternar Tema Claro/Escuro"
        >
          {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} />}
        </button>

        {/* Usuário logado */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--secondary)', padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--card-border)' }}>
            <User size={14} color="var(--primary)" />
            <span style={{ fontSize: '13px', fontWeight: '500' }}>{user.nome.split(' ')[0]}</span>
            <button 
              onClick={onLogout} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}
              title="Sair do sistema"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Não conectado</span>
        )}
      </div>
    </header>
  );
}
