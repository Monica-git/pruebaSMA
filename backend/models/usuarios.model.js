const { Schema, model } = require('mongoose');
/* SIMILAR A LO DE ARRIBA
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;
const model = mongoose.model;
*/

// esquema de la base de datos
const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    imagen: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'ROL_ALUMNO'
    },

}, { collection: 'Usuarios' });

module.exports = model('Usuario', UsuarioSchema);