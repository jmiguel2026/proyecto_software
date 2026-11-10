const express = require('express');
const router = express.Router();
const db = require('../db');

// RUTA DE LOGIN
router.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    if (usuario === 'ADMINTECH' && password === 'EmpresaTech123') {
        return res.json({
            rol: 'admin',
            nombre: 'TECH ADMINISTRADOR',
            usuario: 'ADMINTECH'
        });
    }

    const sql = 'SELECT id, nombre, cargo, usuario FROM empleado WHERE (usuario = ? OR correo = ?) AND password = ?';
    db.query(sql, [usuario, usuario, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            const emp = results[0];
            return res.json({
                rol: 'empleado',
                id: emp.id,
                nombre: emp.nombre,
                cargo: emp.cargo,
                usuario: emp.usuario
            });
        } else {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
    });
});

// Listar empleados
router.get('/', (req, res) => {
    db.query('SELECT id, nombre, edad, pais, cargo, correo, usuario FROM empleado ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Guardar empleado
router.post('/', (req, res) => {
    const { nombre, edad, pais, cargo, correo, usuario, password } = req.body;
    const sql = 'INSERT INTO empleado (nombre, edad, pais, cargo, correo, usuario, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [nombre, edad, pais, cargo, correo, usuario, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, nombre, cargo, usuario });
    });
});

// ACTUALIZAR CREDENCIALES (Usuario o Contraseña por el Administrador)
router.put('/:id/credenciales', (req, res) => {
    const { id } = req.params;
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const sql = 'UPDATE empleado SET usuario = ?, password = ? WHERE id = ?';
    db.query(sql, [usuario, password, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Credenciales actualizadas exitosamente' });
    });
});

// Eliminar empleado
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM empleado WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Empleado eliminado' });
    });
});

module.exports = router;