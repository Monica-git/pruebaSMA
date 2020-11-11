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
    grupo: {
        type: Schema.Types.ObjectId,
        ref: 'Grupo'
    },
    alta: {
        type: Date,
        default: Date.now
    },
    activo: {
        type: Boolean,
        default: true
    }

}, { collection: 'Usuarios' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

UsuarioSchema.method('toJSON', function() {

    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('Usuario', UsuarioSchema);