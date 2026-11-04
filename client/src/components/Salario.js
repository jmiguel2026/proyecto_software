import React, { useState, useEffect } from 'react';
 
 
export default function Salarios() {
    const [salarios, setSalarios] = useState([]);
    const [form, setForm] = useState({
        empleado_id: '',
        monto: '',
        fecha_actualizacion: ''
    });
 
 
    // Cargar salarios desde el backend
    const cargarSalarios = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/salarios');
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
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
 
 
    // Guardar salario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:5000/api/salarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            setForm({ empleado_id: '', monto: '', fecha_actualizacion: '' });
            cargarSalarios();
        } catch (error) {
            console.error('Error al registrar salario:', error);
        }
    };
 
 
    // Eliminar salario
    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este salario?')) {
            try {
                await fetch(`http://localhost:5000/api/salarios/${id}`, {
                    method: 'DELETE'
                });
                cargarSalarios();
            } catch (error) {
                console.error('Error al eliminar salario:', error);
            }
        }
    };
 
 
    return (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', maxWidth: '800px', margin: '20px auto', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#d35400', textAlign: 'center' }}>Módulo de Salarios (Franklin)</h2>
 
 
            {/* Formulario Registrar Salario */}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <input 
                    type="number"
                    name="empleado_id" 
                    placeholder="ID del Empleado" 
                    value={form.empleado_id} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <input 
                    type="number"
                    step="0.01"
                    name="monto" 
                    placeholder="Monto del Salario (S/.)" 
                    value={form.monto} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <input 
                    type="date" 
                    name="fecha_actualizacion" 
                    value={form.fecha_actualizacion} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', gridColumn: 'span 2' }} 
                />
                <button 
                    type="submit" 
                    style={{ gridColumn: 'span 2', background: '#d35400', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Registrar Salario
                </button>
            </form>
 
 
            {/* Tabla de Salarios */}
            <h3>Lista de Salarios Registrados:</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'white' }}>
                <thead>
                    <tr style={{ background: '#d35400', color: 'white' }}>
                        <th style={{ padding: '8px' }}>ID Salario</th>
                        <th style={{ padding: '8px' }}>Empleado</th>
                        <th style={{ padding: '8px' }}>Monto (S/.)</th>
                        <th style={{ padding: '8px' }}>Fecha Actualización</th>
                        <th style={{ padding: '8px' }}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {salarios.length === 0 ? (
                        <tr><td colSpan="5" style={{ padding: '10px', textAlign: 'center' }}>No hay salarios registrados aún.</td></tr>
                    ) : (
                        salarios.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>{s.id}</td>
                                <td style={{ padding: '8px' }}><strong>{s.empleado_nombre}</strong> (ID: {s.empleado_id})</td>
                                <td style={{ padding: '8px', color: '#27ae60', fontWeight: 'bold' }}>S/. {parseFloat(s.monto).toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>{s.fecha_actualizacion}</td>
                                <td style={{ padding: '8px' }}>
                                    <button 
                                        onClick={() => handleEliminar(s.id)} 
                                        style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}