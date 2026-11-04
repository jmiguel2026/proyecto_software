const express = require('express');
const router = express.Router();
const db = require('../db');
 
 
// 1. Obtener todos los salarios (con el nombre del empleado asociado)
router.get('/', (req, res) => {
    const sql = `
        SELECT s.id, s.empleado_id, e.nombre AS empleado_nombre, s.monto, DATE_FORMAT(s.fecha_actualizacion, '%Y-%m-%d') AS fecha_actualizacion
        FROM salario s
        JOIN empleado e ON s.empleado_id = e.id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
 
 
// 2. Registrar salario de un empleado
router.post('/', (req, res) => {
    const { empleado_id, monto, fecha_actualizacion } = req.body;
    const sql = 'INSERT INTO salario (empleado_id, monto, fecha_actualizacion) VALUES (?, ?, ?)';
    
    db.query(sql, [empleado_id, monto, fecha_actualizacion], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            id: result.insertId, 
            empleado_id, 
            monto, 
            fecha_actualizacion 
        });
    });
});
 
 
// 3. Eliminar registro de salario
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM salario WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Registro de salario eliminado' });
    });
});
 
 
module.exports = router;