// Componente Footer (Minimalista e Elegante — UFPA 2026.1)
// MedAgenda - Sistema de Agendamento e Prontuário Médico
import React from 'react';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--card-bg)',
      borderTop: '1px solid var(--card-border)',
      marginTop: 'auto',
      padding: '24px',
      color: 'var(--muted-foreground)',
      fontSize: '13px'
    }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} color="var(--primary)" />
          <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>MedAgenda</span>
          <span>• UFPA 2026.1 (Engenharia de Software I)</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span>Autores: Carlos Eduardo Vitelli, Gabriel Xavier e Kayky Feio</span>
        </div>
      </div>
    </footer>
  );
}
