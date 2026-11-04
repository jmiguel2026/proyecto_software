import React, { useState, useEffect } from 'react';
 
 
export default function Proyectos() {
    const [proyectos, setProyectos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [asignacion, setAsignacion] = useState({ empleado_id: '', proyecto_id: '' });
 
 
    const cargarProyectos = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/proyectos');
            if (!res.ok) throw new Error('Error al conectar');
            const data = await res.json();
            setProyectos(data);
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
        }
    };
 
 
    useEffect(() => {
        cargarProyectos();
    }, []);
 
 
    // Crear Proyecto con alerta
    const handleCrearProyecto = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/proyectos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_proyecto: nombre, descripcion })
            });
            const data = await res.json();
            if (!res.ok) {
                alert('⚠️ Error de MySQL: ' + (data.error || 'No se pudo crear'));
                return;
            }
            alert('✅ Proyecto registrado exitosamente');
            setNombre('');
            setDescripcion('');
            cargarProyectos();
        } catch (error) {
            alert('❌ Sin conexión con el servidor (Verifica que node index.js esté activo)');
        }
    };
 
 
    // Asignar Empleado con alerta
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
                alert('⚠️ Error: ' + (data.error || 'Verifica que existan el ID de Empleado y de Proyecto'));
                return;
            }
            alert('✅ Empleado vinculado al proyecto con éxito');
            setAsignacion({ empleado_id: '', proyecto_id: '' });
        } catch (error) {
            alert('❌ Sin conexión con el servidor');
        }
    };
 
 
    // Eliminar Proyecto
    const handleEliminar = async (id) => {
        if (window.confirm('¿Confirmar eliminación de este proyecto?')) {
            try {
                await fetch(`http://localhost:5000/api/proyectos/${id}`, { method: 'DELETE' });
                cargarProyectos();
            } catch (error) {
                console.error('Error al eliminar proyecto:', error);
            }
        }
    };
 
 
    const filtrados = proyectos.filter(p => 
        p.nombre_proyecto.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );
 
 
    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
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
 
 
            {/* SECCIÓN EN DOS COLUMNAS: CREAR PROYECTO + ASIGNAR EMPLEADO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                
                {/* FORMULARIO 1: CREAR PROYECTO */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                        Registrar Nuevo Proyecto
                    </div>
                    <form onSubmit={handleCrearProyecto} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input 
                            placeholder="Nombre del proyecto" 
                            value={nombre} 
                            onChange={e => setNombre(e.target.value)} 
                            required 
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} 
                        />
                        <textarea 
                            placeholder="Descripción de objetivos y alcance..." 
                            rows="3"
                            value={descripcion} 
                            onChange={e => setDescripcion(e.target.value)} 
                            required 
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none', resize: 'vertical' }} 
                        />
                        <button 
                            type="submit" 
                            style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: '0.15s' }}>
                            + Crear Proyecto
                        </button>
                    </form>
                </div>
 
 
                {/* FORMULARIO 2: VINCULAR EMPLEADO A PROYECTO */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                        Asignar Personal a Proyecto
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0' }}>
                        Ingresa los identificadores numéricos (ID) generados en la base de datos.
                    </p>
                    <form onSubmit={handleAsignar} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input 
                            type="number"
                            placeholder="ID del Empleado (ej: 1)" 
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
                            style={{ background: '#334155', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: '0.15s' }}>
                            Vincular Asignación
                        </button>
                    </form>
                </div>
 
 
            </div>
 
 
            {/* TABLA DE PROYECTOS */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Directorio de Proyectos</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{filtrados.length} registros</span>
                </div>
 
 
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 18px', fontWeight: '600', width: '80px' }}>ID</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600', width: '260px' }}>Nombre del Proyecto</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Descripción</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'right', width: '100px' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                                    No hay proyectos registrados en el sistema.
                                </td>
                            </tr>
                        ) : (
                            filtrados.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 18px', color: '#64748b' }}>#{p.id}</td>
                                    <td style={{ padding: '12px 18px', fontWeight: '600', color: '#0f172a' }}>{p.nombre_proyecto}</td>
                                    <td style={{ padding: '12px 18px', color: '#475569', lineHeight: '1.4' }}>{p.descripcion}</td>
                                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                                        <button 
                                            onClick={() => handleEliminar(p.id)} 
                                            style={{ background: '#ffffff', border: '1px solid #fecaca', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
 
 
        </div>
    );
}