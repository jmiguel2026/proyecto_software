# 🏢 Sistema de Gestión - Empresa de Software

> **Versión:** `v1.0.0` (Release Final)  
> Sistema integral de administración empresarial para la gestión de nómina, control de proyectos, asignación de personal e historial salarial, desarrollado bajo una arquitectura cliente-servidor con base de datos relacional MySQL.

---

## 👥 Equipo de Desarrollo y Módulos

El proyecto fue desarrollado de manera colaborativa utilizando **GitKraken** y el flujo de trabajo **Git Flow**, dividiendo responsabilidades por ramas independientes para evitar conflictos:

| Desarrollador | Rama Git | Módulo Asignado | Responsabilidades |
| :--- | :--- | :--- | :--- |
| **Jose Miguel (Líder)** | `developM` | **Gestión de Personal (`empleado`)** | Arquitectura general, integración de API, UI/UX (Clean White Theme) y modales con SweetAlert2. |
| **Robert** | `developR` | **Control de Proyectos (`proyectos` / `empleado_proyecto`)** | Registro de proyectos, vinculación relacional de empleados a proyectos y gestión de asignaciones. |
| **Franklin** | `developF` | **Gestión Financiera (`salario`)** | Registro de historial de salarios, validación de integridad referencial y visualización de nómina. |

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React.js, JavaScript (ES6+), SweetAlert2, CSS3 / Modern Inline UI.
* **Backend:** Node.js, Express.js, CORS.
* **Base de Datos:** MySQL (XAMPP).
* **Control de Versiones:** Git, GitHub, GitKraken.

---

## 🌿 Flujo de Trabajo en Git (Git Flow)

* **`main`:** Rama protegida de producción y entrega final (etiquetada como `v1.0.0`).
* **`developer`:** Rama de integración continua donde se consolidaron los cambios del equipo.
* **Ramas de Funcionalidad:**
  * `developM` (Módulo Empleados)
  * `developR` (Módulo Proyectos)
  * `developF` (Módulo Salarios)

---

## 🗄️ Modelo de Base de Datos (`empresa_software`)

El sistema cuenta con 4 entidades normalizadas con claves foráneas e integridad referencial (`ON DELETE CASCADE`):

1. **`empleado`**: `id (PK)`, `nombre`, `edad`, `pais`, `cargo`, `correo`.
2. **`proyectos`**: `id (PK)`, `nombre_proyecto`, `descripcion`.
3. **`empleado_proyecto`**: `empleado_id (FK)`, `proyecto_id (FK)` (Tabla intermedia M:N).
4. **`salario`**: `id (PK)`, `empleado_id (FK)`, `monto`, `fecha_actualizacion`.

---

## 🚀 Instalación y Puesta en Marcha

### 1. Requisitos Previos
* Tener instalado [Node.js](https://nodejs.org/) (v18 o superior).
* Tener instalado [XAMPP](https://www.apachefriends.org/) con los servicios de **Apache** y **MySQL** activos.

### 2. Configurar Base de Datos
1. Abrir phpMyAdmin en `http://localhost/phpmyadmin`.
2. Ir a la pestaña **SQL** y ejecutar el siguiente script:

```sql
CREATE DATABASE IF NOT EXISTS empresa_software;
USE empresa_software;

CREATE TABLE IF NOT EXISTS empleado (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT(11) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS proyectos (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre_proyecto VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS empleado_proyecto (
    empleado_id INT(11),
    proyecto_id INT(11),
    PRIMARY KEY (empleado_id, proyecto_id),
    FOREIGN KEY (empleado_id) REFERENCES empleado(id) ON DELETE CASCADE,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS salario (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT(11),
    monto DECIMAL(10,2) NOT NULL,
    fecha_actualizacion DATE NOT NULL,
    FOREIGN KEY (empleado_id) REFERENCES empleado(id) ON DELETE CASCADE
);
3. Iniciar el Servidor (Backend)
En una terminal en la raíz del proyecto:
Bash
cd server
npm install
node index.js
El servidor iniciará en el puerto http://localhost:5000.
4. Iniciar el Cliente (Frontend)
En una segunda terminal:
Bash
cd client
npm install
npm start
La aplicación se abrirá automáticamente en http://localhost:3000.
✨ Características Principales
📊 Panel Unificado: Navegación modular limpia en diseño blanco empresarial.
🛡️ Validación de Integridad: Captura amigable de errores de MySQL (Foreign Keys) mediante modales de SweetAlert2.
🔍 Búsqueda Dinámica: Filtros en tiempo real para empleados, proyectos y salarios.
🗑️ Confirmación de Eliminación: Modales interactivos para prevenir pérdida accidental de registros.
