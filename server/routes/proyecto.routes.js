const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. Obtener proyectos (Todos si es Admin, o solo los asignados si es Empleado)
router.get('/', (req, res) => {
    const { empleado_id } = req.query;

    let sql = '';
    const params = [];

    if (empleado_id) {
        // Filtra únicamente los proyectos asignados a este empleado en empleado_proyecto
        sql = `
            SELECT p.id, p.nombre_proyecto, p.descripcion, DATE_FORMAT(p.fecha_entrega, '%Y-%m-%d') AS fecha_entrega
            FROM proyectos p
            JOIN empleado_proyecto ep ON p.id = ep.proyecto_id
            WHERE ep.empleado_id = ?
            ORDER BY p.fecha_entrega ASC
        `;
        params.push(empleado_id);
    } else {
        // Si es admin, muestra todos los proyectos
        sql = `
            SELECT id, nombre_proyecto, descripcion, DATE_FORMAT(fecha_entrega, '%Y-%m-%d') AS fecha_entrega
            FROM proyectos
            ORDER BY id DESC
        `;
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. Crear proyecto con Fecha de Entrega
router.post('/', (req, res) => {
    const { nombre_proyecto, descripcion, fecha_entrega } = req.body;
    const sql = 'INSERT INTO proyectos (nombre_proyecto, descripcion, fecha_entrega) VALUES (?, ?, ?)';
    db.query(sql, [nombre_proyecto, descripcion, fecha_entrega], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, nombre_proyecto, descripcion, fecha_entrega });
    });
});

// 3. Asignar empleado a un proyecto (Tabla empleado_proyecto)
router.post('/asignar', (req, res) => {
    const { empleado_id, proyecto_id } = req.body;
    const sql = 'INSERT INTO empleado_proyecto (empleado_id, proyecto_id) VALUES (?, ?)';
    db.query(sql, [empleado_id, proyecto_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Empleado asignado al proyecto exitosamente' });
    });
});

// 4. Eliminar proyecto
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM proyectos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Proyecto eliminado con éxito' });
    });
});

module.exports = router;