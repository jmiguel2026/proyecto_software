import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Login from './components/Login';
import Empleados from './components/Empleados';
import Proyectos from './components/Proyectos';
import Salario from './components/Salario';

export default function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [modulo, setModulo] = useState('proyectos');
  
  // Estados para el menú de usuarios superior
  const [menuUsuariosAbierto, setMenuUsuariosAbierto] = useState(false);
  const [listaEmpleados, setListaEmpleados] = useState([]);

  // Cargar lista de empleados para el directorio
  const cargarUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/empleados');
      const data = await res.json();
      setListaEmpleados(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
    if (usuarioLogueado) {
      cargarUsuarios();
    }
  }, [usuarioLogueado]);

  // Si no hay sesión iniciada, muestra el Login
  if (!usuarioLogueado) {
    return <Login onLogin={(user) => {
      setUsuarioLogueado(user);
      setModulo(user.rol === 'admin' ? 'empleados' : 'proyectos');
    }} />;
  }

  const esAdmin = usuarioLogueado.rol === 'admin';

  // 1. Confirmación de Cierre de Sesión con SweetAlert2
  const handleCerrarSesion = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tendrás que ingresar tus credenciales nuevamente para acceder.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      setUsuarioLogueado(null);
      setMenuUsuariosAbierto(false);
      Swal.fire({
        icon: 'success',
        title: 'Sesión finalizada',
        timer: 1200,
        showConfirmButton: false
      });
    }
  };

  // Lista unificada: Administrador + Empleados de la BD
  const todosLosUsuarios = [
    { id: 0, nombre: 'TECH ADMINISTRADOR', usuario: 'ADMINTECH', cargo: 'Administrador del Sistema', rol: 'admin' },
    ...listaEmpleados
  ];

  // Primeros 3 usuarios para la vista previa
  const usuariosVistaPrevia = todosLosUsuarios.slice(0, 3);

  // 2. Modal de SweetAlert2 con TODOS los usuarios
  const handleMostrarTodos = () => {
    setMenuUsuariosAbierto(false);

    const tablaHtml = `
      <div style="max-height: 320px; overflow-y: auto; text-align: left; font-size: 13px; font-family: sans-serif;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #e2e8f0; color: #475569; background: #f8fafc;">
              <th style="padding: 10px;">Nombre</th>
              <th style="padding: 10px;">Usuario</th>
              <th style="padding: 10px;">Rol / Cargo</th>
            </tr>
          </thead>
          <tbody>
            ${todosLosUsuarios.map(u => `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px; font-weight: 600; color: #0f172a;">${u.nombre}</td>
                <td style="padding: 10px; color: #2563eb;">@${u.usuario || 'N/A'}</td>
                <td style="padding: 10px;">
                  <span style="background: ${u.rol === 'admin' ? '#0f172a' : '#f1f5f9'}; color: ${u.rol === 'admin' ? '#ffffff' : '#334155'}; padding: 3px 8px; borderRadius: 4px; fontSize: 11px;">
                    ${u.cargo || (u.rol === 'admin' ? 'Administrador' : 'Empleado')}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    Swal.fire({
      title: 'Directorio Completo de Usuarios',
      html: tablaHtml,
      width: '640px',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#0f172a'
    });
  };

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

        {/* Botón Cerrar Sesión con SweetAlert2 */}
        <button 
          onClick={handleCerrarSesion}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: '0.15s' }}>
          Cerrar Sesión
        </button>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Cabecera Superior con Menú Interactivo */}
        <header style={{ height: '64px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'relative' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
            {modulo === 'empleados' && 'Gestión de Personal'}
            {modulo === 'proyectos' && 'Directorio de Proyectos'}
            {modulo === 'salarios' && (esAdmin ? 'Historial General de Salarios' : 'Detalle de Mi Salario')}
          </div>

          {/* PERFIL SUPERIOR DERECHO (CLICKEABLE) */}
          <div 
            onClick={() => setMenuUsuariosAbierto(!menuUsuariosAbierto)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', background: menuUsuariosAbierto ? '#f1f5f9' : 'transparent', transition: '0.15s' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: esAdmin ? '#0f172a' : '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px' }}>
              {esAdmin ? 'AD' : 'EM'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {esAdmin ? 'TECH ADMINISTRADOR' : usuarioLogueado.nombre}
                <span style={{ fontSize: '10px', color: '#64748b' }}>▼</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {esAdmin ? 'Acceso Total' : `Empleado (${usuarioLogueado.cargo || 'Personal'})`}
              </div>
            </div>
          </div>

          {/* MENÚ DESPLEGABLE DE USUARIOS (TIPO POPOVER) */}
          {menuUsuariosAbierto && (
            <div style={{
              position: 'absolute', top: '68px', right: '32px', width: '310px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>Usuarios del Sistema</span>
                <span style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{todosLosUsuarios.length} activos</span>
              </div>

              {/* Lista de los primeros usuarios */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {usuariosVistaPrevia.map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '6px', background: u.usuario === usuarioLogueado.usuario ? '#f8fafc' : 'transparent', border: u.usuario === usuarioLogueado.usuario ? '1px solid #e2e8f0' : 'none' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: u.rol === 'admin' ? '#0f172a' : '#e2e8f0', color: u.rol === 'admin' ? '#ffffff' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                      {u.rol === 'admin' ? 'AD' : 'EM'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.nombre} {u.usuario === usuarioLogueado.usuario && <span style={{ fontSize: '10px', color: '#16a34a' }}>(Tú)</span>}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>@{u.usuario || 'admin'} • {u.cargo || 'Admin'}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón de Mostrar Todos */}
              <button 
                onClick={handleMostrarTodos}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: '0.15s' }}>
                Mostrar todos los usuarios ({todosLosUsuarios.length})
              </button>
            </div>
          )}

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