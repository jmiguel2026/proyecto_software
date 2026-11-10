# 🏢 Sistema de Gestión - Empresa de Software

> **Versión:** `v1.2.0` (Release Final - Control de Acceso y Roles)  
> Sistema integral de administración empresarial con arquitectura cliente-servidor (React + Node.js/Express + MySQL). Incluye autenticación con roles diferenciados (**Administrador** y **Empleado**), control de asignaciones, plazos de entrega, gestión salarial y modales interactivos con SweetAlert2.

---

## 🔑 Credenciales de Acceso al Sistema

Para evaluar y navegar por las distintas vistas y restricciones de la plataforma:

| Rol | Usuario | Contraseña | Nivel de Acceso |
| :--- | :--- | :--- | :--- |
| **Administrador** | `ADMINTECH` | `EmpresaTech123` | **Total:** Crear/eliminar empleados, resetear contraseñas, crear proyectos, fijar fechas de entrega, asignar personal y autorizar aumentos de sueldo. |
| **Empleado** | *(Creado por el Admin)* | *(Definida por el Admin)* | **Restringido:** Solo visualiza sus propios proyectos asignados (con su fecha de entrega) y su propio salario confidencial. Sin permisos de edición ni borrado. |

---

## 👥 Equipo de Desarrollo y Módulos

El proyecto fue desarrollado de manera colaborativa utilizando **GitKraken** bajo la metodología **Git Flow**:

| Desarrollador | Rama Git | Módulo Principal | Responsabilidades |
| :--- | :--- | :--- | :--- |
| **Jose Miguel (Líder)** | `developM` | **Autenticación y Personal (`Login` / `empleado`)** | Arquitectura general, sistema de login con roles, reseteo de credenciales, diseño UI en blanco ejecutivo e integración de SweetAlert2. |
| **Robert** | `developR` | **Control de Proyectos (`proyectos` / `empleado_proyecto`)** | Registro de proyectos con fecha límite de entrega, vinculación relacional y visualización filtrada por empleado. |
| **Franklin** | `developF` | **Gestión Financiera (`salario`)** | Historial de nómina, actualización de salarios (aumentos), vista confidencial por empleado y claves foráneas. |

---

## 🔐 Matriz de Permisos por Rol

| Funcionalidad | Administrador | Empleado |
| :--- | :---: | :---: |
| Iniciar y cerrar sesión con confirmación | ✅ | ✅ |
| Ver Directorio de Usuarios activos | ✅ | ✅ |
| Registrar y eliminar empleados | ✅ | ❌ *(Pestaña oculta)* |
| Modificar credenciales (usuario/contraseña) | ✅ | ❌ |
| Crear proyectos y fijar fechas de entrega | ✅ | ❌ |
| Asignar empleados a proyectos | ✅ | ❌ |
| Ver proyectos asignados y trabajo a realizar | ✅ *(Todos)* | ✅ *(Solo los suyos)* |
| Registrar salarios y aplicar aumentos | ✅ | ❌ |
| Consultar monto salarial confidencial | ✅ *(Todos)* | ✅ *(Solo el propio)* |

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React.js, JavaScript moderno (ES6+), SweetAlert2 (Modales y alertas), CSS3 (Clean Executive White Theme).
* **Backend:** Node.js, Express.js, CORS, Middleware JSON.
* **Base de Datos:** MySQL (XAMPP) con integridad referencial (`ON DELETE CASCADE`).
* **Control de Versiones:** Git, GitHub, GitKraken.

---

## 🌿 Flujo de Trabajo en Git (Git Flow)

* **`main`:** Rama de producción final etiquetada con las versiones **`v1.0.0`** y **`v1.2.0`**.
* **`developer`:** Rama centralizadora donde se integraron los módulos del equipo.
* **Ramas Feature individuales:**
  * `developM` (Módulo Empleados y Auth)
  * `developR` (Módulo Proyectos y Plazos)
  * `developF` (Módulo Salarios y Aumentos)

---

## 🗄️ Modelo de Base de Datos (`empresa_software`)

El sistema cuenta con 4 tablas relacionales normalizadas:

1. **`empleado`**: `id (PK)`, `nombre`, `edad`, `pais`, `cargo`, `correo`, `usuario (UNIQUE)`, `password`.
2. **`proyectos`**: `id (PK)`, `nombre_proyecto`, `descripcion`, `fecha_entrega`.
3. **`empleado_proyecto`**: `empleado_id (FK)`, `proyecto_id (FK)` *(Tabla intermedia M:N)*.
4. **`salario`**: `id (PK)`, `empleado_id (FK)`, `monto`, `fecha_actualizacion`.

---

## 🚀 Instalación y Puesta en Marcha

### 1. Requisitos Previos
* [Node.js](https://nodejs.org/) instalado.
* [XAMPP](https://www.apachefriends.org/) con los servicios de **Apache** y **MySQL** iniciados.

### 2. Configurar la Base de Datos
1. Ingresar a phpMyAdmin en `http://localhost/phpmyadmin`.
2. Ir a la pestaña **SQL** y ejecutar el siguiente script completo:

```sql
CREATE DATABASE IF NOT EXISTS empresa_software;
USE empresa_software;

-- Tabla Empleado
CREATE TABLE IF NOT EXISTS empleado (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT(11) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    usuario VARCHAR(50) UNIQUE,
    password VARCHAR(100)
);

-- Tabla Proyectos
CREATE TABLE IF NOT EXISTS proyectos (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre_proyecto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_entrega DATE
);

-- Tabla Intermedia Empleado_Proyecto
CREATE TABLE IF NOT EXISTS empleado_proyecto (
    empleado_id INT(11),
    proyecto_id INT(11),
    PRIMARY KEY (empleado_id, proyecto_id),
    FOREIGN KEY (empleado_id) REFERENCES empleado(id) ON DELETE CASCADE,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
);

-- Tabla Salario
CREATE TABLE IF NOT EXISTS salario (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT(11),
    monto DECIMAL(10,2) NOT NULL,
    fecha_actualizacion DATE NOT NULL,
    FOREIGN KEY (empleado_id) REFERENCES empleado(id) ON DELETE CASCADE
);
3. Iniciar el Backend (Servidor)
En una terminal en la raíz del proyecto:
Bash
cd server
npm install
node index.js
El servidor arrancará en el puerto http://localhost:5000.
4. Iniciar el Frontend (React)
En una segunda terminal:
Bash
cd client
npm install
npm start
La aplicación web abrirá automáticamente en http://localhost:3000.
✨ Características y Experiencia de Usuario
🔒 Autenticación con Vistas Condicionales: La interfaz cambia dinámicamente según quién inicie sesión.
📅 Control de Entregas: Plazos claros por cada proyecto con tarjetas ampliadas para lectura cómoda de instrucciones.
💼 Gestión Integral de Nómina: Aumentos salariales inmediatos y reseteo de contraseñas olvidadas por el Administrador.
🎨 Diseño Ejecutivo: Paleta limpia en blanco, gris slate y negro con bordes definidos y alertas interactivas SweetAlert2.
