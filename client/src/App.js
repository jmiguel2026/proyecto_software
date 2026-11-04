import React, { useState } from 'react';
import Empleados from './components/Empleados';
import Proyectos from './components/Proyectos';
import Salario from './components/Salario';

function App() {
  const [pestana, setPestana] = useState('empleados');

  return (
    <div style={{ minHeight: '100vh', background: '#eef2f5', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Encabezado */}
      <header style={{ background: '#2c3e50', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>Sistema de Gestión - Empresa de Software</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>Proyecto Grupal: Miguel, Robert y Franklin</p>
      </header>

      {/* Barra de Navegación */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '15px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
        <button 
          onClick={() => setPestana('empleados')} 
          style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: pestana === 'empleados' ? '#27ae60' : '#ddd', color: pestana === 'empleados' ? 'white' : '#333' }}>
          👨‍💻 Empleados (Miguel)
        </button>

        <button 
          onClick={() => setPestana('proyectos')} 
          style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: pestana === 'proyectos' ? '#2980b9' : '#ddd', color: pestana === 'proyectos' ? 'white' : '#333' }}>
          📂 Proyectos (Robert)
        </button>

        <button 
          onClick={() => setPestana('salarios')} 
          style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: pestana === 'salarios' ? '#d35400' : '#ddd', color: pestana === 'salarios' ? 'white' : '#333' }}>
          💰 Salarios (Franklin)
        </button>
      </div>

      {/* Contenido según la pestaña */}
      <main style={{ padding: '20px' }}>
        {pestana === 'empleados' && <Empleados />}
        {pestana === 'proyectos' && <Proyectos />}
        {pestana === 'salarios' && <Salario />}
      </main>
    </div>
  );
}

export default App;