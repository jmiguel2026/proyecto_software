import React, { useState, useEffect } from 'react';
 
 
export default function Proyectos() {
    const [proyectos, setProyectos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [asignacion, setAsignacion] = useState({ empleado_id: '', proyecto_id: '' });
 
 
    // Cargar proyectos desde el backend
    const cargarProyectos = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/proyectos');
            const data = await res.json();
            setProyectos(data);
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
        }
    };
 
 
    useEffect(() => {
        cargarProyectos();
    }, []);
 
 
    // Crear un proyecto
    const handleCrearProyecto = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:5000/api/proyectos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_proyecto: nombre, descripcion })
            });
            setNombre('');
            setDescripcion('');
            cargarProyectos();
        } catch (error) {
            console.error('Error al crear proyecto:', error);
        }
    };
 
 
    // Asignar empleado a proyecto
    const handleAsignar = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/proyectos/asignar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(asignacion)
            });
            const data = await res.json();
            alert(data.message || 'Empleado asignado');
            setAsignacion({ empleado_id: '', proyecto_id: '' });
        } catch (error) {
            console.error('Error al asignar:', error);
        }
    };
 
 
    // Eliminar proyecto
    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este proyecto?')) {
            try {
                await fetch(`http://localhost:5000/api/proyectos/${id}`, {
                    method: 'DELETE'
                });
                cargarProyectos();
            } catch (error) {
                console.error('Error al eliminar proyecto:', error);
            }
        }
    };
 
 
    return (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', maxWidth: '800px', margin: '20px auto', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#2980b9', textAlign: 'center' }}>Módulo de Proyectos (Robert)</h2>
 
 
            {/* Formulario Crear Proyecto */}
            <form onSubmit={handleCrearProyecto} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <input 
                    placeholder="Nombre del Proyecto" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <input 
                    placeholder="Descripción breve" 
                    value={descripcion} 
                    onChange={e => setDescripcion(e.target.value)} 
                    required 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <button 
                    type="submit" 
                    style={{ gridColumn: 'span 2', background: '#2980b9', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Crear Proyecto
                </button>
            </form>
 
 
            {/* Formulario Asignar Empleado a Proyecto */}
            <div style={{ background: '#eaf2f8', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1b4f72' }}>Asignar Empleado a Proyecto:</h4>
                <form onSubmit={handleAsignar} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="number"
                        placeholder="ID Empleado" 
                        value={asignacion.empleado_id} 
                        onChange={e => setAsignacion({ ...asignacion, empleado_id: e.target.value })} 
                        required 
                        style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                    <input 
                        type="number"
                        placeholder="ID Proyecto" 
                        value={asignacion.proyecto_id} 
                        onChange={e => setAsignacion({ ...asignacion, proyecto_id: e.target.value })} 
                        required 
                        style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                    <button 
                        type="submit" 
                        style={{ background: '#34495e', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Asignar
                    </button>
                </form>
            </div>
 
 
            {/* Tabla de Proyectos */}
            <h3>Lista de Proyectos:</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'white' }}>
                <thead>
                    <tr style={{ background: '#2980b9', color: 'white' }}>
                        <th style={{ padding: '8px' }}>ID</th>
                        <th style={{ padding: '8px' }}>Nombre Proyecto</th>
                        <th style={{ padding: '8px' }}>Descripción</th>
                        <th style={{ padding: '8px' }}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {proyectos.length === 0 ? (
                        <tr><td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>No hay proyectos registrados.</td></tr>
                    ) : (
                        proyectos.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>{p.id}</td>
                                <td style={{ padding: '8px' }}><strong>{p.nombre_proyecto}</strong></td>
                                <td style={{ padding: '8px' }}>{p.descripcion}</td>
                                <td style={{ padding: '8px' }}>
                                    <button 
                                        onClick={() => handleEliminar(p.id)} 
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