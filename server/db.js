const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',      // tu usuario de MySQL (usualmente root)
    password: '',      // tu contraseña de MySQL (si no tienes, déjalo vacío)
    database: 'botica_novasalud', // el nombre de tu base de datos en MySQL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;