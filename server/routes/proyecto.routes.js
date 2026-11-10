const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. Obtener proyectos (Admin ve el empleado asignado; Empleado ve solo los suyos)
router.get('/', (req, res) => {
    const { empleado_id } = req.query;

    if (empleado_id) {
        // Para el Empleado: solo proyectos donde su ID esté vinculado
        const sql = `
            SELECT 
                p.id, 
                p.nombre_proyecto, 
                p.descripcion, 
                DATE_FORMAT(p.fecha_entrega, '%d/%m/%Y') AS fecha_entrega
            FROM proyectos p
            INNER JOIN empleado_proyecto ep ON p.id = ep.proyecto_id
            WHERE ep.empleado_id = ?
            ORDER BY p.id DESC
        `;
        db.query(sql, [empleado_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    } else {
        // Para el Administrador: muestra el proyecto y el NOMBRE del empleado asignado
        const sql = `
            SELECT 
                p.id, 
                p.nombre_proyecto, 
                p.descripcion, 
                DATE_FORMAT(p.fecha_entrega, '%d/%m/%Y') AS fecha_entrega,
                COALESCE(GROUP_CONCAT(e.nombre SEPARATOR ', '), 'Sin asignar') AS empleado_asignado
            FROM proyectos p
            LEFT JOIN empleado_proyecto ep ON p.id = ep.proyecto_id
            LEFT JOIN empleado e ON ep.empleado_id = e.id
            GROUP BY p.id
            ORDER BY p.id DESC
        `;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
});

// 2. Crear proyecto con fecha de entrega
router.post('/', (req, res) => {
    const nombre_proyecto = req.body.nombre_proyecto || req.body.nombre;
    const descripcion = req.body.descripcion;
    const fecha_entrega = req.body.fecha_entrega;

    if (!nombre_proyecto) {
        return res.status(400).json({ error: 'El nombre del proyecto es obligatorio' });
    }

    const sql = 'INSERT INTO proyectos (nombre_proyecto, descripcion, fecha_entrega) VALUES (?, ?, ?)';
    db.query(sql, [nombre_proyecto, descripcion, fecha_entrega || null], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, nombre_proyecto, descripcion, fecha_entrega });
    });
});

// 3. Asignar empleado a un proyecto
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