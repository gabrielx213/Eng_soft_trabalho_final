// Componente Footer (Créditos Acadêmicos e Matrículas)
// MedAgenda - UFPA 2026.1 - Design Corporativo Limpo
import React from 'react';

export default function Footer() {
  return (
    <footer className="credits-banner">
      <p style={{ fontWeight: '600', color: 'var(--foreground)' }}>
        MedAgenda — Trabalho Final (T3) de Engenharia de Software I — UFPA 2026.1
      </p>
      <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
        Arquitetura: React.js (SPA Frontend) • Node.js/Express (API REST) • Prisma ORM & PostgreSQL
      </p>
      
      <div className="credits-names" style={{ marginTop: '14px', fontSize: '13px' }}>
        <span>Carlos Eduardo Vitelli da Silva (202406840030)</span>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span>Gabriel Xavier Vieira do Nascimento (202007040030)</span>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span>Kayky Gonçalves Feio (202406840021)</span>
      </div>

      <p style={{ fontSize: '12px', marginTop: '10px' }}>
        <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>Repositório GitHub:</span>{' '}
        <a 
          href="https://github.com/gabrielx213/Eng_soft_trabalho_final" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}
        >
          github.com/gabrielx213/Eng_soft_trabalho_final
        </a>
      </p>

      <p style={{ fontSize: '11px', marginTop: '6px', color: 'var(--muted-foreground)' }}>
        Prof. Me. Julio Leite Azancort Neto • Instituto de Ciências Exatas e Naturais — Faculdade de Computação (UFPA)
      </p>
    </footer>
  );
}
