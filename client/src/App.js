import React, { useState } from 'react';
import Login from './components/Login';
import Empleados from './components/Empleados';
import Proyectos from './components/Proyectos';
import Salario from './components/Salario';

export default function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [modulo, setModulo] = useState('proyectos'); // Si entra empleado, empieza en proyectos

  // Si no ha iniciado sesión, muestra la pantalla de Login
  if (!usuarioLogueado) {
    return <Login onLogin={(user) => {
      setUsuarioLogueado(user);
      setModulo(user.rol === 'admin' ? 'empleados' : 'proyectos');
    }} />;
  }

  const esAdmin = usuarioLogueado.rol === 'admin';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px', color: '#ffffff' }}>
              ES
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>EMPRESA TECH</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Panel {esAdmin ? 'Administrativo' : 'Empleado'}</div>
            </div>
          </div>

          <nav style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 10px 8px 10px' }}>
              Módulos Disponibles
            </div>

            {/* Solo el Administrador ve el botón de Empleados */}
            {esAdmin && (
              <button 
                onClick={() => setModulo('empleados')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '6px', border: modulo === 'empleados' ? '1px solid #cbd5e1' : '1px solid transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                  background: modulo === 'empleados' ? '#f1f5f9' : 'transparent', color: modulo === 'empleados' ? '#0f172a' : '#64748b'
                }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Gestión de Empleados
              </button>
            )}

            <button 
              onClick={() => setModulo('proyectos')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '6px', border: modulo === 'proyectos' ? '1px solid #cbd5e1' : '1px solid transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                background: modulo === 'proyectos' ? '#f1f5f9' : 'transparent', color: modulo === 'proyectos' ? '#0f172a' : '#64748b'
              }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              Proyectos
            </button>

            <button 
              onClick={() => setModulo('salarios')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '6px', border: modulo === 'salarios' ? '1px solid #cbd5e1' : '1px solid transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                background: modulo === 'salarios' ? '#f1f5f9' : 'transparent', color: modulo === 'salarios' ? '#0f172a' : '#64748b'
              }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              {esAdmin ? 'Gestión de Salarios' : 'Mi Salario Asignado'}
            </button>
          </nav>
        </div>

        {/* Botón Cerrar Sesión */}
        <button 
          onClick={() => setUsuarioLogueado(null)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '64px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
            {modulo === 'empleados' && 'Gestión de Personal'}
            {modulo === 'proyectos' && 'Directorio de Proyectos'}
            {modulo === 'salarios' && (esAdmin ? 'Historial General de Salarios' : 'Detalle de Mi Salario')}
          </div>

          {/* PERFIL SUPERIOR DERECHO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: esAdmin ? '#0f172a' : '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px' }}>
              {esAdmin ? 'AD' : 'EM'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>
                {esAdmin ? 'TECH ADMINISTRADOR' : usuarioLogueado.nombre}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {esAdmin ? 'Acceso Total' : `Empleado (${usuarioLogueado.cargo || 'Personal'})`}
              </div>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {modulo === 'empleados' && esAdmin && <Empleados />}
          {modulo === 'proyectos' && <Proyectos usuario={usuarioLogueado} />}
          {modulo === 'salarios' && <Salario usuario={usuarioLogueado} />}
        </main>
      </div>

    </div>
  );
}