const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener salarios (todos o solo del empleado logueado)
router.get('/', (req, res) => {
    const { empleado_id } = req.query;

    let sql = `
        SELECT s.id, s.empleado_id, e.nombre AS empleado_nombre, s.monto, DATE_FORMAT(s.fecha_actualizacion, '%Y-%m-%d') AS fecha_actualizacion
        FROM salario s
        JOIN empleado e ON s.empleado_id = e.id
    `;
    const params = [];

    if (empleado_id) {
        sql += ' WHERE s.empleado_id = ?';
        params.push(empleado_id);
    }

    sql += ' ORDER BY s.id DESC';

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Registrar nuevo salario
router.post('/', (req, res) => {
    const { empleado_id, monto, fecha_actualizacion } = req.body;
    const sql = 'INSERT INTO salario (empleado_id, monto, fecha_actualizacion) VALUES (?, ?, ?)';
    db.query(sql, [empleado_id, monto, fecha_actualizacion], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, empleado_id, monto, fecha_actualizacion });
    });
});

// ACTUALIZAR SALARIO (Aumento de Sueldo por el Administrador)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { monto, fecha_actualizacion } = req.body;

    if (!monto || !fecha_actualizacion) {
        return res.status(400).json({ error: 'Monto y fecha son requeridos' });
    }

    const sql = 'UPDATE salario SET monto = ?, fecha_actualizacion = ? WHERE id = ?';
    db.query(sql, [monto, fecha_actualizacion, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Salario actualizado exitosamente' });
    });
});

// Eliminar salario
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM salario WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Registro eliminado' });
    });
});

module.exports = router;