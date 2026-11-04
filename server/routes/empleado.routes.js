const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. Obtener todos los empleados
router.get('/', (req, res) => {
    db.query('SELECT * FROM empleado', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 2. Registrar un nuevo empleado
router.post('/', (req, res) => {
    const { nombre, edad, pais, cargo, correo } = req.body;
    const sql = 'INSERT INTO empleado (nombre, edad, pais, cargo, correo) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [nombre, edad, pais, cargo, correo], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ 
            id: result.insertId, 
            nombre, 
            edad, 
            pais, 
            cargo, 
            correo 
        });
    });
});

// 3. Eliminar un empleado por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM empleado WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Empleado eliminado con éxito' });
    });
});

module.exports = router;