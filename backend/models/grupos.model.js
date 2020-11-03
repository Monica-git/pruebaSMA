const { Schema, model } = require('mongoose');

const GrupoSchema = Schema({

    nombre: {
        type: String,
        require: true,
        unique: true
    },
    proyecto: {
        type: String
    },
    proyectodes: {
        type: String
    }


}, { collection: 'grupos' });

GrupoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Grupo', GrupoSchema);