import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function Login({ onLogin }) {
    const [credenciales, setCredenciales] = useState({ usuario: '', password: '' });

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/empleados/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credenciales)
            });

            const data = await res.json();

            if (!res.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso Denegado',
                    text: data.error || 'Credenciales no válidas',
                    confirmButtonColor: '#0c182b'
                });
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: `Sesión iniciada como ${data.nombre}`,
                timer: 1500,
                showConfirmButton: false
            });

            onLogin(data); // Guarda la sesión en App.js
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Servidor',
                text: 'No se pudo conectar con el backend (puerto 5000)',
                confirmButtonColor: '#0c182b'
            });
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a111e', fontFamily: 'Inter, -apple-system, sans-serif' }}>
            <div style={{ width: '100%', maxWidth: '420px', background: '#ffffff', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', textAlign: 'center' }}>
                
                {/* Logo JG */}
                <div style={{ width: '54px', height: '54px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0f172a', borderRadius: '12px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px' }}>TE</span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Bienvenido de nuevo</h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 32px 0' }}>Ingresa tus credenciales para acceder al Panel Administrativo</p>

                <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Usuario o Correo</label>
                        <input 
                            name="usuario" 
                            type="text" 
                            value={credenciales.usuario} 
                            onChange={handleChange} 
                            required 
                            placeholder=""
                            style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Contraseña</label>
                        <input 
                            name="password" 
                            type="password" 
                            value={credenciales.password} 
                            onChange={handleChange} 
                            required 
                            placeholder=""
                            style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={{ width: '100%', padding: '14px', borderRadius: '8px', background: '#0c182b', color: '#e5a93c', border: '1.5px solid #e5a93c', fontSize: '13px', fontWeight: '700', letterSpacing: '0.8px', cursor: 'pointer', marginTop: '10px', transition: '0.2s' }}>
                        INICIAR SESIÓN
                    </button>
                </form>

                <div style={{ marginTop: '36px', fontSize: '11px', fontWeight: '600', color: '#94a3b8', letterSpacing: '1px' }}>
                    TECH © 2026
                </div>
            </div>
        </div>
    );
}