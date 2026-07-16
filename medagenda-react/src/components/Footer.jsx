// Componente Footer (Créditos Acadêmicos e Matrículas)
// MedAgenda - UFPA 2026.1
import React from 'react';

export default function Footer() {
  return (
    <footer className="credits-banner">
      <p>
        <strong>MedAgenda - Trabalho Final (T3) de Engenharia de Software I - UFPA 2026.1</strong><br />
        Tecnologias Implementadas: <em>React.js (SPA Frontend), Node.js/Express (API REST), Prisma ORM & PostgreSQL</em>
      </p>
      <div className="credits-names">
        👨‍🎓 Carlos Eduardo Vitelli da Silva (202406840030) &nbsp;•&nbsp; 
        👨‍🎓 Gabriel Xavier Vieira do Nascimento (202007040030) &nbsp;•&nbsp; 
        👨‍🎓 Kayky Gonçalves Feio (202406840021)
      </div>
      <p style={{ fontSize: '11px', marginTop: '6px', color: 'var(--text-muted)' }}>
        Prof. Me. Julio Leite Azancort Neto • Faculdade de Computação (UFPA)
      </p>
    </footer>
  );
}
