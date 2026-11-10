import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Salario({ usuario }) {
    const [salarios, setSalarios] = useState([]);
    const [form, setForm] = useState({ empleado_id: '', monto: '', fecha_actualizacion: '' });

    const esAdmin = usuario?.rol === 'admin';

    const cargarSalarios = async () => {
        try {
            // Si es empleado, solicita únicamente su salario
            const url = esAdmin 
                ? 'http://localhost:5000/api/salarios'
                : `http://localhost:5000/api/salarios?empleado_id=${usuario.id}`;

            const res = await fetch(url);
            const data = await res.json();
            setSalarios(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        cargarSalarios();
    }, [usuario]);

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
                Swal.fire({ icon: 'warning', title: 'Atención', text: data.error, confirmButtonColor: '#0f172a' });
                return;
            }

            Swal.fire({ icon: 'success', title: '¡Registrado!', timer: 1800, showConfirmButton: false });
            setForm({ empleado_id: '', monto: '', fecha_actualizacion: '' });
            cargarSalarios();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al conectar con el servidor', confirmButtonColor: '#0f172a' });
        }
    };

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar registro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b'
        });
        if (result.isConfirmed) {
            await fetch(`http://localhost:5000/api/salarios/${id}`, { method: 'DELETE' });
            cargarSalarios();
        }
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

            {/* FORMULARIO: SOLO VISIBLE PARA EL ADMINISTRADOR */}
            {esAdmin ? (
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                        Asignación Salarial (Exclusivo Administrador)
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                        <input type="number" placeholder="ID del Empleado (ej: 2)" value={form.empleado_id} onChange={e => setForm({ ...form, empleado_id: e.target.value })} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 12px', borderRadius: '6px', fontSize: '13px' }} />
                        <input type="number" step="0.01" placeholder="Monto (S/.)" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 12px', borderRadius: '6px', fontSize: '13px' }} />
                        <input type="date" value={form.fecha_actualizacion} onChange={e => setForm({ ...form, fecha_actualizacion: e.target.value })} required style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px 12px', borderRadius: '6px', fontSize: '13px' }} />
                        <button type="submit" style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Registrar Salario</button>
                    </form>
                </div>
            ) : (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px 20px', marginBottom: '24px', color: '#166534', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>ℹ️</span> Estás viendo tu registro salarial confidencial asignado por la administración.
                </div>
            )}

            {/* TABLA DE SALARIOS */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                        {esAdmin ? 'Historial General de Salarios' : `Detalle Salarial de ${usuario.nombre}`}
                    </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Empleado</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Monto Asignado</th>
                            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Fecha Registro</th>
                            {esAdmin && <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'right' }}>Acción</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {salarios.length === 0 ? (
                            <tr><td colSpan={esAdmin ? 5 : 4} style={{ padding: '28px', textAlign: 'center', color: '#94a3b8' }}>No hay registros salariales.</td></tr>
                        ) : (
                            salarios.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 18px', color: '#64748b' }}>#{s.id}</td>
                                    <td style={{ padding: '12px 18px', fontWeight: '600', color: '#0f172a' }}>{s.empleado_nombre}</td>
                                    <td style={{ padding: '12px 18px', fontWeight: '700', color: '#16a34a' }}>S/. {parseFloat(s.monto).toFixed(2)}</td>
                                    <td style={{ padding: '12px 18px', color: '#475569' }}>{s.fecha_actualizacion}</td>
                                    {esAdmin && (
                                        <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                                            <button onClick={() => handleEliminar(s.id)} style={{ background: '#ffffff', border: '1px solid #fecaca', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Eliminar</button>
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