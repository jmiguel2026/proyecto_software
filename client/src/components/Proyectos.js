import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Proyectos({ usuario }) {
    const [proyectos, setProyectos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [form, setForm] = useState({ nombre: '', descripcion: '', fecha_entrega: '' });
    const [asignacion, setAsignacion] = useState({ empleado_id: '', proyecto_id: '' });

    const esAdmin = usuario?.rol === 'admin';

    const cargarProyectos = async () => {
        try {
            // Si es empleado, pide estrictamente sus proyectos por ID
            const url = esAdmin 
                ? 'http://localhost:5000/api/proyectos'
                : `http://localhost:5000/api/proyectos?empleado_id=${usuario.id}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error('Error al conectar');
            const data = await res.json();
            setProyectos(data);
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
        }
    };

    useEffect(() => {
        if (usuario) {
            cargarProyectos();
        }
    }, [usuario]);

    // Crear Proyecto (Admin)
    const handleCrearProyecto = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/proyectos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_proyecto: form.nombre,
                    descripcion: form.descripcion,
                    fecha_entrega: form.fecha_entrega
                })
            });
            const data = await res.json();

            if (!res.ok) {
                Swal.fire({ icon: 'error', title: 'Error', text: data.error, confirmButtonColor: '#0f172a' });
                return;
            }

            Swal.fire({ icon: 'success', title: '¡Proyecto Creado!', timer: 1800, showConfirmButton: false });
            setForm({ nombre: '', descripcion: '', fecha_entrega: '' });
            cargarProyectos();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Sin conexión', text: 'Verifica el servidor en el puerto 5000', confirmButtonColor: '#0f172a' });
        }
    };

    // Asignar Empleado (Admin)
    const handleAsignar = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/proyectos/asignar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(asignacion)
            });
            const data = await res.json();

            if (!res.ok) {
                Swal.fire({
                    icon: 'warning',
                    title: 'ID No Válido',
                    text: 'Verifica que el ID del Empleado y del Proyecto existan en el sistema.',
                    confirmButtonColor: '#0f172a'
                });
                return;
            }

            Swal.fire({ icon: 'success', title: '¡Asignado!', text: 'El empleado ya puede ver este proyecto en su panel.', timer: 2000, showConfirmButton: false });
            setAsignacion({ empleado_id: '', proyecto_id: '' });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar al servidor.', confirmButtonColor: '#0f172a' });
        }
    };

    // Eliminar Proyecto (Admin)
    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar proyecto?',
            text: 'Se eliminará el proyecto y las asignaciones de los empleados.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await fetch(`http://localhost:5000/api/proyectos/${id}`, { method: 'DELETE' });
            Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
            cargarProyectos();
        }
    };

    const filtrados = proyectos.filter(p => 
        (p.nombre_proyecto && p.nombre_proyecto.toLowerCase().includes(busqueda.toLowerCase())) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
    );

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* Buscador */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '10px' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                    type="text" 
                    placeholder="Buscar por nombre de proyecto o palabras de la descripción..." 
                    value={busqueda} 
                    onChange={e => setBusqueda(e.target.value)} 
                    style={{ background: 'transparent', border: 'none', color: '#0f172a', width: '100%', fontSize: '13px', outline: 'none' }} 
                />
            </div>

            {/* SECCIÓN SOLO ADMINISTRADOR: FORMULARIOS */}
            {esAdmin && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                    
                    {/* Crear Proyecto con Caja Grande */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>
                            Registrar Nuevo Proyecto
                        </div>
                        <form onSubmit={handleCrearProyecto} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input 
                                placeholder="Nombre del proyecto" 
                                value={form.nombre} 
                                onChange={e => setForm({ ...form, nombre: e.target.value })} 
                                required 
                                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} 
                            />
                            
                            {/* CAJA GRANDE PARA DESCRIPCIÓN DETALLADA */}
                            <textarea 
                                placeholder="Escribe aquí todas las instrucciones y detalles completos del proyecto..." 
                                rows="5"
                                value={form.descripcion} 
                                onChange={e => setForm({ ...form, descripcion: e.target.value })} 
                                required 
                                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none', resize: 'vertical', lineHeight: '1.5' }} 
                            />

                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Fecha Límite de Entrega:</label>
                                <input 
                                    type="date"
                                    value={form.fecha_entrega} 
                                    onChange={e => setForm({ ...form, fecha_entrega: e.target.value })} 
                                    required 
                                    style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
                                />
                            </div>

                            <button type="submit" style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}>
                                + Crear Proyecto
                            </button>
                        </form>
                    </div>

                    {/* Asignar Personal */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>
                            Asignar Proyecto a Empleado
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0' }}>El proyecto solo será visible para el empleado que ingreses aquí.</p>
                        
                        <form onSubmit={handleAsignar} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input 
                                type="number" 
                                placeholder="ID del Empleado (ej: 2)" 
                                value={asignacion.empleado_id} 
                                onChange={e => setAsignacion({ ...asignacion, empleado_id: e.target.value })} 
                                required 
                                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} 
                            />
                            <input 
                                type="number" 
                                placeholder="ID del Proyecto (ej: 1)" 
                                value={asignacion.proyecto_id} 
                                onChange={e => setAsignacion({ ...asignacion, proyecto_id: e.target.value })} 
                                required 
                                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} 
                            />
                            <button type="submit" style={{ background: '#334155', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                                Vincular Asignación
                            </button>
                        </form>
                    </div>

                </div>
            )}

            {/* VISTA DEL EMPLEADO: TARJETAS AMPLIAS Y CÓMODAS PARA LEER */}
            {!esAdmin ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                        Mis Tareas Asignadas ({filtrados.length})
                    </div>

                    {filtrados.length === 0 ? (
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '40px', textAlign: 'center', color: '#64748b' }}>
                            No tienes proyectos asignados a tu cuenta actualmente.
                        </div>
                    ) : (
                        filtrados.map(p => (
                            <div key={p.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                                    <div>
                                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>PROYECTO #{p.id}</span>
                                        <h3 style={{ margin: '4px 0 0 0', color: '#0f172a', fontSize: '18px' }}>{p.nombre_proyecto}</h3>
                                    </div>
                                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                                        📅 Entrega: {p.fecha_entrega || 'Por definir'}
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginTop: '10px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        📋 Trabajo a Realizar (Instrucciones del Administrador):
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#1e293b', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                        {p.descripcion}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* TABLA GENERAL PARA EL ADMINISTRADOR */
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Directorio General de Proyectos</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{filtrados.length} registros</span>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '12px 18px', width: '50px' }}>ID</th>
                                <th style={{ padding: '12px 18px', width: '200px' }}>Nombre</th>
                                <th style={{ padding: '12px 18px' }}>Descripción</th>
                                <th style={{ padding: '12px 18px', width: '140px' }}>Fecha Entrega</th>
                                <th style={{ padding: '12px 18px', textAlign: 'right', width: '80px' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 18px', color: '#64748b' }}>#{p.id}</td>
                                    <td style={{ padding: '12px 18px', fontWeight: '600', color: '#0f172a' }}>{p.nombre_proyecto}</td>
                                    <td style={{ padding: '12px 18px', color: '#475569', lineHeight: '1.5' }}>{p.descripcion}</td>
                                    <td style={{ padding: '12px 18px', fontWeight: '600', color: '#0f172a' }}>{p.fecha_entrega || 'Sin fecha'}</td>
                                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                                        <button onClick={() => handleEliminar(p.id)} style={{ background: '#ffffff', border: '1px solid #fecaca', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}