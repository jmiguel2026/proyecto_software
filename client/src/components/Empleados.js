import React, { useState, useEffect } from 'react';

export default function Empleados() {
    const [empleados, setEmpleados] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [form, setForm] = useState({ nombre: '', edad: '', pais: '', cargo: '', correo: '' });

    const cargarEmpleados = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/empleados');
            if (!res.ok) throw new Error('Error al conectar con el servidor');
            const data = await res.json();
            setEmpleados(data);
        } catch (error) {
            console.error('Error al cargar empleados:', error);
        }
    };

    useEffect(() => {
        cargarEmpleados();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/empleados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                // Si la base de datos da error, te saldrá este aviso:
                alert('⚠️ Error de MySQL: ' + (data.error || 'No se pudo guardar'));
                return;
            }

            alert('✅ ¡Empleado guardado con éxito!');
            setForm({ nombre: '', edad: '', pais: '', cargo: '', correo: '' });
            cargarEmpleados();
        } catch (error) {
            alert('❌ No hay conexión con el servidor (¿Está corriendo "node index.js" en el puerto 5000?)');
            console.error(error);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Confirmar eliminación del registro?')) {
            try {
                await fetch(`http://localhost:5000/api/empleados/${id}`, { method: 'DELETE' });
                cargarEmpleados();
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const filtrados = empleados.filter(e => 
        e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.cargo.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* BARRA DE BÚSQUEDA */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '10px' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, cargo o correo..." 
                    value={busqueda} 
                    onChange={e => setBusqueda(e.target.value)} 
                    style={{ background: 'transparent', border: 'none', color: '#0f172a', width: '100%', fontSize: '13px', outline: 'none' }} 
                />
            </div>

            {/* FORMULARIO */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                    Registrar Nuevo Empleado
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
                    <input name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                    <input name="edad" placeholder="Edad" type="number" value={form.edad} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                    <input name="pais" placeholder="País" value={form.pais} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                    <input name="cargo" placeholder="Cargo asignado" value={form.cargo} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                    <input name="correo" placeholder="Correo electrónico" type="email" value={form.correo} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                    <button type="submit" style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                        + Guardar
                    </button>
                </form>
            </div>

            {/* TABLA */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Lista de Empleados</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{filtrados.length} registros</span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Nombre</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Cargo</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Ubicación</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Correo</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'right' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                                    No hay empleados registrados.
                                </td>
                            </tr>
                        ) : (
                            filtrados.map(emp => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 18px', color: '#64748b' }}>#{emp.id}</td>
                                    <td style={{ padding: '12px 18px', fontWeight: '600', color: '#0f172a' }}>{emp.nombre}</td>
                                    <td style={{ padding: '12px 18px' }}>
                                        <span style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>
                                            {emp.cargo}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 18px', color: '#475569' }}>{emp.pais} ({emp.edad} años)</td>
                                    <td style={{ padding: '12px 18px', color: '#64748b' }}>{emp.correo}</td>
                                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                                        <button onClick={() => handleEliminar(emp.id)} style={{ background: '#ffffff', border: '1px solid #fecaca', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
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