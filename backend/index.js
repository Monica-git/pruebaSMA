/*
Importación de módulos
*/
const express = require('express');
// intercambio de recursos de origen cruzado
const cors = require('cors');
const { dbConnection } = require('./database/configdb');
// para guardar variables de entorno en un archivo de variables
require('dotenv').config();

// Crear una aplicación de express
const app = express();

// llamar a nuestra cadena de conexion
dbConnection();

app.use(cors());

// para manejar los argumentos en la peticion (body, cabeceras, url, ...)
app.use(express.json());
/* 
req.body
req.cookies
req.headers
req.params
req.query
*/

app.use('/api/usuarios', require('./routers/usuarios.routes'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});