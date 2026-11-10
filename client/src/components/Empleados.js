import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Empleados() {
    const [empleados, setEmpleados] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [form, setForm] = useState({ 
        nombre: '', edad: '', pais: '', cargo: '', correo: '', usuario: '', password: '' 
    });

    const cargarEmpleados = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/empleados');
            const data = await res.json();
            setEmpleados(data);
        } catch (error) {
            console.error(error);
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
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar',
                    text: data.error || 'No se pudo guardar el empleado',
                    confirmButtonColor: '#0f172a'
                });
                return;
            }

            Swal.fire({
                icon: 'success',
                title: '¡Empleado Creado!',
                text: `${form.nombre} ahora puede iniciar sesión con el usuario: ${form.usuario}`,
                timer: 2500,
                showConfirmButton: false
            });

            setForm({ nombre: '', edad: '', pais: '', cargo: '', correo: '', usuario: '', password: '' });
            cargarEmpleados();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Sin conexión', text: 'Error con el puerto 5000', confirmButtonColor: '#0f172a' });
        }
    };

    const handleEliminar = async (id, nombre) => {
        const result = await Swal.fire({
            title: `¿Eliminar a ${nombre}?`,
            text: 'Se borrarán sus accesos y salarios asociados.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await fetch(`http://localhost:5000/api/empleados/${id}`, { method: 'DELETE' });
            Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
            cargarEmpleados();
        }
    };

    const filtrados = empleados.filter(e => 
        e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.cargo.toLowerCase().includes(busqueda.toLowerCase()) ||
        (e.usuario && e.usuario.toLowerCase().includes(busqueda.toLowerCase()))
    );

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '10px' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, cargo o usuario..." 
                    value={busqueda} 
                    onChange={e => setBusqueda(e.target.value)} 
                    style={{ background: 'transparent', border: 'none', color: '#0f172a', width: '100%', fontSize: '13px', outline: 'none' }} 
                />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                    Registrar Nuevo Empleado y Credenciales de Acceso
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <input name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                    <input name="edad" placeholder="Edad" type="number" value={form.edad} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                    <input name="pais" placeholder="País" value={form.pais} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                    <input name="cargo" placeholder="Cargo" value={form.cargo} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                    <input name="correo" placeholder="Correo" type="email" value={form.correo} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                    
                    {/* Campos de Login para el Empleado */}
                    <input name="usuario" placeholder="Nombre de Usuario (Login)" value={form.usuario} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                    <input name="password" placeholder="Contraseña de acceso" type="password" value={form.password} onChange={handleChange} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />

                    <button type="submit" style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                        + Guardar y Crear Acceso
                    </button>
                </form>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Personal Registrado</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{filtrados.length} registros</span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Nombre</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Usuario</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Cargo</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Correo</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'right' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.map(emp => (
                            <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px 18px', color: '#64748b' }}>#{emp.id}</td>
                                <td style={{ padding: '12px 18px', fontWeight: '600', color: '#0f172a' }}>{emp.nombre}</td>
                                <td style={{ padding: '12px 18px', color: '#2563eb', fontWeight: '500' }}>@{emp.usuario || 'sin_usuario'}</td>
                                <td style={{ padding: '12px 18px' }}><span style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>{emp.cargo}</span></td>
                                <td style={{ padding: '12px 18px', color: '#64748b' }}>{emp.correo}</td>
                                <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                                    <button onClick={() => handleEliminar(emp.id, emp.nombre)} style={{ background: '#ffffff', border: '1px solid #fecaca', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}