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
            // Si es empleado, solicita únicamente los proyectos asignados a su ID
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
        cargarProyectos();
    }, [usuario]);

    // Crear Proyecto (Solo Admin)
    const handleCrearProyecto = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/proyectos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
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

    // Asignar Empleado (Solo Admin)
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
                if (data.error && data.error.includes('foreign key constraint fails')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'ID No Válido',
                        text: `El ID de Empleado (${asignacion.empleado_id}) o de Proyecto (${asignacion.proyecto_id}) no existe en la base de datos.`,
                        confirmButtonColor: '#0f172a'
                    });
                } else {
                    Swal.fire({ icon: 'error', title: 'Error', text: data.error, confirmButtonColor: '#0f172a' });
                }
                return;
            }

            Swal.fire({ icon: 'success', title: '¡Asignación Exitosa!', text: 'El empleado fue vinculado al proyecto.', timer: 2000, showConfirmButton: false });
            setAsignacion({ empleado_id: '', proyecto_id: '' });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar al servidor.', confirmButtonColor: '#0f172a' });
        }
    };

    // Eliminar Proyecto (Solo Admin)
    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar proyecto?',
            text: 'Esta acción desvinculará a los empleados asignados a este proyecto.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await fetch(`http://localhost:5000/api/proyectos/${id}`, { method: 'DELETE' });
                Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
                cargarProyectos();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const filtrados = proyectos.filter(p => 
        p.nombre_proyecto.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* Mensaje informativo si es Empleado */}
            {!esAdmin && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        📋
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Mis Proyectos y Asignaciones Activas</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Aquí se listan únicamente los proyectos asignados a tu cargo con sus fechas límites de entrega.</div>
                    </div>
                </div>
            )}

            {/* BARRA DE BÚSQUEDA */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '10px' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                    type="text" 
                    placeholder="Buscar por nombre de proyecto o descripción..." 
                    value={busqueda} 
                    onChange={e => setBusqueda(e.target.value)} 
                    style={{ background: 'transparent', border: 'none', color: '#0f172a', width: '100%', fontSize: '13px', outline: 'none' }} 
                />
            </div>

            {/* SECCIÓN EXCLUSIVA DEL ADMINISTRADOR: CREAR PROYECTO + ASIGNAR EMPLEADO */}
            {esAdmin && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                    
                    {/* FORMULARIO 1: CREAR PROYECTO */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                            Registrar Nuevo Proyecto
                        </div>
                        <form onSubmit={handleCrearProyecto} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input 
                                placeholder="Nombre del proyecto" 
                                value={form.nombre} 
                                onChange={e => setForm({ ...form, nombre: e.target.value })} 
                                required 
                                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} 
                            />
                            <textarea 
                                placeholder="Descripción del trabajo a realizar..." 
                                rows="2"
                                value={form.descripcion} 
                                onChange={e => setForm({ ...form, descripcion: e.target.value })} 
                                required 
                                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none', resize: 'vertical' }} 
                            />
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Fecha Límite de Entrega:</label>
                                <input 
                                    type="date"
                                    value={form.fecha_entrega} 
                                    onChange={e => setForm({ ...form, fecha_entrega: e.target.value })} 
                                    required 
                                    style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
                                />
                            </div>
                            <button 
                                type="submit" 
                                style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}>
                                + Crear Proyecto
                            </button>
                        </form>
                    </div>

                    {/* FORMULARIO 2: VINCULAR EMPLEADO A PROYECTO */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                            Asignar Personal a Proyecto
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0' }}>Ingresa identificadores (ID) para asignar el proyecto al empleado.</p>
                        <form onSubmit={handleAsignar} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input 
                                type="number" 
                                placeholder="ID del Empleado (ej: 2)" 
                                value={asignacion.empleado_id} 
                                onChange={e => setAsignacion({ ...asignacion, empleado_id: e.target.value })} 
                                required 
                                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} 
                            />
                            <input 
                                type="number" 
                                placeholder="ID del Proyecto (ej: 1)" 
                                value={asignacion.proyecto_id} 
                                onChange={e => setAsignacion({ ...asignacion, proyecto_id: e.target.value })} 
                                required 
                                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} 
                            />
                            <button 
                                type="submit" 
                                style={{ background: '#334155', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}>
                                Vincular Asignación
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* TABLA DE PROYECTOS */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                        {esAdmin ? 'Directorio General de Proyectos' : 'Mis Proyectos Asignados'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{filtrados.length} registros</span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 18px', fontWeight: '600', width: '60px' }}>ID</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600', width: '220px' }}>Nombre del Proyecto</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Trabajo a Realizar (Descripción)</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600', width: '160px' }}>Fecha de Entrega</th>
                            {esAdmin && <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'right', width: '100px' }}>Acción</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.length === 0 ? (
                            <tr>
                                <td colSpan={esAdmin ? 5 : 4} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                                    {esAdmin ? 'No hay proyectos registrados.' : 'No tienes proyectos asignados actualmente.'}
                                </td>
                            </tr>
                        ) : (
                            filtrados.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 18px', color: '#64748b' }}>#{p.id}</td>
                                    <td style={{ padding: '12px 18px', fontWeight: '600', color: '#0f172a' }}>{p.nombre_proyecto}</td>
                                    <td style={{ padding: '12px 18px', color: '#475569', lineHeight: '1.4' }}>{p.descripcion}</td>
                                    <td style={{ padding: '12px 18px' }}>
                                        <span style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                                            📅 {p.fecha_entrega || 'Sin fecha'}
                                        </span>
                                    </td>
                                    {esAdmin && (
                                        <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                                            <button onClick={() => handleEliminar(p.id)} style={{ background: '#ffffff', border: '1px solid #fecaca', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                                                Eliminar
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}