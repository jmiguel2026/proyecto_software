const express = require('express');
const router = express.Router();
const db = require('../db');
 
 
// 1. Obtener todos los proyectos
router.get('/', (req, res) => {
    db.query('SELECT * FROM proyectos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
 
 
// 2. Crear un nuevo proyecto
router.post('/', (req, res) => {
    const { nombre_proyecto, descripcion } = req.body;
    const sql = 'INSERT INTO proyectos (nombre_proyecto, descripcion) VALUES (?, ?)';
    db.query(sql, [nombre_proyecto, descripcion], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, nombre_proyecto, descripcion });
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
 
 
// 4. Eliminar un proyecto por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM proyectos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Proyecto eliminado con éxito' });
    });
});
 
 
module.exports = router;