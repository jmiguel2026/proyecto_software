import React, { useState } from 'react';
import Empleados from './components/Empleados';
import Proyectos from './components/Proyectos';
import Salario from './components/Salario';

export default function App() {
  const [modulo, setModulo] = useState('empleados');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* BARRA LATERAL (SIDEBAR BLANCO) */}
      <aside style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px' }}>
        <div>
          {/* Logo Empresa */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px', color: '#ffffff' }}>
              ES
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>EMPRESA TECH</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Panel de Control</div>
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 10px 8px 10px' }}>
              Módulos
            </div>

            <button 
              onClick={() => setModulo('empleados')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '6px', border: modulo === 'empleados' ? '1px solid #cbd5e1' : '1px solid transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: '0.15s',
                background: modulo === 'empleados' ? '#f1f5f9' : 'transparent',
                color: modulo === 'empleados' ? '#0f172a' : '#64748b'
              }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Empleados
            </button>

            <button 
              onClick={() => setModulo('proyectos')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '6px', border: modulo === 'proyectos' ? '1px solid #cbd5e1' : '1px solid transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: '0.15s',
                background: modulo === 'proyectos' ? '#f1f5f9' : 'transparent',
                color: modulo === 'proyectos' ? '#0f172a' : '#64748b'
              }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              Proyectos
            </button>

            <button 
              onClick={() => setModulo('salarios')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '6px', border: modulo === 'salarios' ? '1px solid #cbd5e1' : '1px solid transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: '0.15s',
                background: modulo === 'salarios' ? '#f1f5f9' : 'transparent',
                color: modulo === 'salarios' ? '#0f172a' : '#64748b'
              }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Salarios
            </button>
          </nav>
        </div>

        {/* Tarjeta Inferior de Estado */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Servidor</span>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#0f172a', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>CONECTADO</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>MySQL: localhost:3306</div>
        </div>
      </aside>

      {/* ÁREA DE TRABAJO */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Cabecera Superior */}
        <header style={{ height: '64px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
            {modulo === 'empleados' && 'Gestión de Empleados'}
            {modulo === 'proyectos' && 'Gestión de Proyectos'}
            {modulo === 'salarios' && 'Historial de Salarios'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px' }}>
              JM
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>Jose Miguel</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Administrador</div>
            </div>
          </div>
        </header>

        {/* Contenedor Principal */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {modulo === 'empleados' && <Empleados />}
          {modulo === 'proyectos' && <Proyectos />}
          {modulo === 'salarios' && <Salario />}
        </main>
      </div>

    </div>
  );
}