const { Schema, model } = require('mongoose');

const CursoSchema = Schema({

    nombre: {
        type: String,
        require: true,
        unique: true
    },
    nombrecorto: {
        type: String,
        require: true,
        unique: true
    },
    activo: {
        type: String,
        require: true
    }


}, { collection: 'cursos' });

GrupoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Curso', GrupoSchema);