import React, { useState, useEffect } from 'react';
 
 
export default function Salario() {
    const [salarios, setSalarios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [form, setForm] = useState({
        empleado_id: '',
        monto: '',
        fecha_actualizacion: ''
    });
 
 
    const cargarSalarios = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/salarios');
            if (!res.ok) throw new Error('Error al conectar');
            const data = await res.json();
            setSalarios(data);
        } catch (error) {
            console.error('Error al cargar salarios:', error);
        }
    };
 
 
    useEffect(() => {
        cargarSalarios();
    }, []);
 
 
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
 
 
    // Guardar Salario con alerta
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/salarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
 
 
            const data = await res.json();
 
 
            if (!res.ok) {
                alert('⚠️ Error de MySQL: ' + (data.error || 'Verifica que el ID del Empleado exista'));
                return;
            }
 
 
            alert('✅ Salario registrado exitosamente');
            setForm({ empleado_id: '', monto: '', fecha_actualizacion: '' });
            cargarSalarios();
        } catch (error) {
            alert('❌ Sin conexión con el servidor (Verifica que node index.js esté activo)');
        }
    };
 
 
    // Eliminar Salario
    const handleEliminar = async (id) => {
        if (window.confirm('¿Confirmar eliminación de este registro salarial?')) {
            try {
                await fetch(`http://localhost:5000/api/salarios/${id}`, { method: 'DELETE' });
                cargarSalarios();
            } catch (error) {
                console.error('Error al eliminar salario:', error);
            }
        }
    };
 
 
    const filtrados = salarios.filter(s => 
        (s.empleado_nombre && s.empleado_nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
        s.empleado_id.toString().includes(busqueda)
    );
 
 
    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* BARRA DE BÚSQUEDA */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '10px' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                    type="text" 
                    placeholder="Buscar registro por nombre o ID de empleado..." 
                    value={busqueda} 
                    onChange={e => setBusqueda(e.target.value)} 
                    style={{ background: 'transparent', border: 'none', color: '#0f172a', width: '100%', fontSize: '13px', outline: 'none' }} 
                />
            </div>
 
 
            {/* FORMULARIO DE REGISTRO SALARIAL */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                    Asignación y Registro Salarial
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <input 
                        type="number"
                        name="empleado_id" 
                        placeholder="ID del Empleado (ej: 1)" 
                        value={form.empleado_id} 
                        onChange={handleChange} 
                        required 
                        style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} 
                    />
                    <input 
                        type="number" 
                        step="0.01"
                        name="monto" 
                        placeholder="Monto asignado en S/." 
                        value={form.monto} 
                        onChange={handleChange} 
                        required 
                        style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} 
                    />
                    <input 
                        type="date" 
                        name="fecha_actualizacion" 
                        value={form.fecha_actualizacion} 
                        onChange={handleChange} 
                        required 
                        style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} 
                    />
                    <button 
                        type="submit" 
                        style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: '0.15s' }}>
                        + Registrar Salario
                    </button>
                </form>
            </div>
 
 
            {/* TABLA DE SALARIOS */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Historial de Salarios</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{filtrados.length} registros</span>
                </div>
 
 
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>ID Registro</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Empleado Vinculado</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Monto Salarial</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Fecha Actualización</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'right' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                                    No hay registros de salarios en el sistema.
                                </td>
                            </tr>
                        ) : (
                            filtrados.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 18px', color: '#64748b' }}>#{s.id}</td>
                                    <td style={{ padding: '12px 18px', fontWeight: '600', color: '#0f172a' }}>
                                        {s.empleado_nombre} 
                                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal', marginLeft: '6px' }}>
                                            (ID: {s.empleado_id})
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 18px', fontWeight: '700', color: '#0f172a' }}>
                                        S/. {parseFloat(s.monto).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '12px 18px', color: '#475569' }}>{s.fecha_actualizacion}</td>
                                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                                        <button 
                                            onClick={() => handleEliminar(s.id)} 
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