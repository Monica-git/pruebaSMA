const { response } = require('express');
const validator = require('validator');

const Curso = require('../models/cursos.model');


const obtenerCursos = async(req, res = response) => {

    //encontrar un unico curso
    const id = req.query.id;

    // paginacion
    // Number: tipar como numero (por si envian cosas raras)
    let desde = Number(req.query.desde) || 0;
    if (desde < 0)
        desde = 0;
    const registropp = Number(process.env.DOCSPERPAGES);

    try {

        let cursos, total;

        if (id) {

            [cursos, total] = await Promise.all([
                Curso.findById(id),
                Curso.countDocuments()
            ]);

        } else {
            [cursos, total] = await Promise.all([
                Curso.find({}).skip(desde).limit(registropp),
                Curso.countDocuments()
            ])
        }

        res.json({
            ok: true,
            msg: 'getCursos',
            cursos,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error buscando el curso'
        });
    }
}

const crearCurso = async(req, res = response) => {

    const { nombre, nombrecorto } = req.body;

    try {

        const exiteCurso = await Curso.findOne({ nombre });

        if (exiteCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'Existe un curso con el mismo nombre'
            });
        }

        const exiteCursoc = await Curso.findOne({ nombrecorto });

        if (exiteCursoc) {
            return res.status(400).json({
                ok: false,
                msg: 'Existe un curso con el mismo nombre corto'
            });
        }



        /* --------------------------------------------------------
            almacenar los datos en la BD */

        // crear objeto
        const curso = new Curso(req.body);

        // almacenarlo en la BD
        await curso.save();

        res.json({
            ok: true,
            msg: 'crear un curso',
            curso
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error creando el curso'
        });
    }


}

const actualizarCurso = async(req, res = response) => {

    // aunque venga el password aqui no se va a cambiar
    // si cambia el email, hay que comprobar que no exista en la BD
    const { nombre, nombrecorto } = req.body;
    const uid = req.params.id;

    try {
        // comprobar si existe o no existe el curso
        const existeCurso = await Curso.findOne(uid);

        if (!existeCurso) {

            return res.status(400).json({
                ok: false,
                msg: "El curso no existe"
            });
        }
        // comprobar si existe otro curso con ese nombre
        const existeCursoN = await Curso.findOne({ nombre });

        if (existeCursoN && (existeCursoN._id != uid)) {

            return res.status(400).json({
                ok: false,
                msg: "No se puede cambiar el nombre porque existe un curso con el mismo nombre"
            });
        }
        // comprobar si existe otro curso con ese nombre corto
        const existeCursoNC = await Curso.findOne({ nombrecorto });

        if (existeCursoNC && (existeCursoN._id != uid)) {

            return res.status(400).json({
                ok: false,
                msg: "No se puede cambiar el nombre corto porque existe un curso con el mismo nombre"
            });
        }


        const curso = await Curso.findByIdAndUpdate(uid, req.body, { new: true });

        res.json({
            ok: true,
            msg: 'actualizarCurso',
            curso
        });

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'Error actualizando curso'
        });
    }



}

const borrarCurso = async(req, res = response) => {

    const uid = req.params.id;

    try {

        // comprobamos que el usuario existe
        const existeCurso = await Curso.findById(uid);

        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: "El curso no existe"
            });
        }

        // lo eliminamos y devolvemos el usuario recien eliminado
        // Remove -> se convierte en Modify en la BD
        // Delete -> debería ser el utilizado...?
        /*DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify */
        const resultado = await Curso.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: "Curso eliminado",
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: "no se ha podido eliminar el curso"
        });
    }

}

module.exports = {
    obtenerCursos,
    crearCurso,
    actualizarCurso,
    borrarCurso
}