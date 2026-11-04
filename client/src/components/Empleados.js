import React, { useState, useEffect } from 'react';

export default function Empleados() {
    const [empleados, setEmpleados] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        edad: '',
        pais: '',
        cargo: '',
        correo: ''
    });

    // Cargar empleados desde el backend
    const cargarEmpleados = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/empleados');
            const data = await res.json();
            setEmpleados(data);
        } catch (error) {
            console.error('Error al cargar empleados:', error);
        }
    };

    useEffect(() => {
        cargarEmpleados();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Guardar nuevo empleado
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:5000/api/empleados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            // Limpiar formulario y recargar lista
            setForm({ nombre: '', edad: '', pais: '', cargo: '', correo: '' });
            cargarEmpleados();
        } catch (error) {
            console.error('Error al guardar empleado:', error);
        }
    };

    // Eliminar empleado
    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este empleado?')) {
            try {
                await fetch(`http://localhost:5000/api/empleados/${id}`, {
                    method: 'DELETE'
                });
                cargarEmpleados();
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    return (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', maxWidth: '800px', margin: '20px auto', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>Módulo de Empleados (Miguel)</h2>
            
            {/* Formulario de registro */}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <input 
                    name="nombre" 
                    placeholder="Nombre completo" 
                    value={form.nombre} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <input 
                    name="edad" 
                    placeholder="Edad" 
                    type="number" 
                    value={form.edad} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <input 
                    name="pais" 
                    placeholder="País" 
                    value={form.pais} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <input 
                    name="cargo" 
                    placeholder="Cargo (ej: Desarrollador)" 
                    value={form.cargo} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <input 
                    name="correo" 
                    placeholder="Correo electrónico" 
                    type="email" 
                    value={form.correo} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', gridColumn: 'span 2' }} 
                />
                <button 
                    type="submit" 
                    style={{ gridColumn: 'span 2', background: '#27ae60', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Guardar Empleado
                </button>
            </form>

            {/* Tabla de empleados */}
            <h3>Lista de Empleados Registrados:</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'white' }}>
                <thead>
                    <tr style={{ background: '#2c3e50', color: 'white' }}>
                        <th style={{ padding: '8px' }}>ID</th>
                        <th style={{ padding: '8px' }}>Nombre</th>
                        <th style={{ padding: '8px' }}>Edad</th>
                        <th style={{ padding: '8px' }}>País</th>
                        <th style={{ padding: '8px' }}>Cargo</th>
                        <th style={{ padding: '8px' }}>Correo</th>
                        <th style={{ padding: '8px' }}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {empleados.length === 0 ? (
                        <tr><td colSpan="7" style={{ padding: '10px', textAlign: 'center' }}>No hay empleados registrados.</td></tr>
                    ) : (
                        empleados.map(emp => (
                            <tr key={emp.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>{emp.id}</td>
                                <td style={{ padding: '8px' }}>{emp.nombre}</td>
                                <td style={{ padding: '8px' }}>{emp.edad}</td>
                                <td style={{ padding: '8px' }}>{emp.pais}</td>
                                <td style={{ padding: '8px' }}>{emp.cargo}</td>
                                <td style={{ padding: '8px' }}>{emp.correo}</td>
                                <td style={{ padding: '8px' }}>
                                    <button 
                                        onClick={() => handleEliminar(emp.id)} 
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