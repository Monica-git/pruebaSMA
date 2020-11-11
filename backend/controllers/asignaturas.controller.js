const { response } = require('express');
const validator = require('validator');

const Asignatura = require('../models/asignaturas.model');
const Curso = require('../models/cursos.model');


const obtenerAsignaturas = async(req, res = response) => {

    //encontrar un unico curso
    const id = req.query.id;

    // paginacion
    // Number: tipar como numero (por si envian cosas raras)
    let desde = Number(req.query.desde) || 0;
    if (desde < 0)
        desde = 0;
    const registropp = Number(process.env.DOCSPERPAGES);

    try {

        let asignaturas, total;

        if (id) {

            [asignaturas, total] = await Promise.all([
                Asignatura.findById(id).populate('curso').populate('profesores.usuario', '-password -alta -__v'),
                Asignatura.countDocuments()
            ]);

        } else {
            [asignaturas, total] = await Promise.all([
                Asignatura.find({}).skip(desde).limit(registropp).populate('curso').populate('profesores.usuario', '-password -alta -__v'),
                Asignatura.countDocuments()
            ])
        }

        res.json({
            ok: true,
            msg: 'getAsignaturas',
            asignaturas,
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
            msg: 'error buscando la asignatura'
        });
    }
}

const crearAsignatura = async(req, res = response) => {

    const { curso, profesores } = req.body;

    try {

        const exiteCurso = await Curso.findById(curso);
        if (!exiteCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado a la asignatura no existe'
            });
        }

        let listaprofesoresinsertar = [];

        if (profesores) {
            let listaprofesoresbusqueda = [];

            const listaprof = profesores.map(registro => {
                if (registro.usuario) {
                    listaprofesoresbusqueda.push(registro.usuario);
                    listaprofesoresinsertar.push(registro);
                }
            });

            const existeProfesores = await Usuario.find().where('_id').in(listaprofesoresbusqueda);

            if (existeProfesores.length != listaprofesoresbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores no existe o están repetidos',
                })
            }
        }

        /* --------------------------------------------------------
            almacenar los datos en la BD */

        // crear objeto
        const asignatura = new Asignatura(req.body);
        asignatura.profesores = listaprofesoresinsertar;

        // almacenarlo en la BD
        await asignatura.save();

        res.json({
            ok: true,
            msg: 'crear una asignatura',
            asignatura
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error creando la asignatura'
        });
    }


}

const actualizarAsignatura = async(req, res = response) => {

    const { curso, profesores } = req.body;
    const uid = req.params.id;

    try {

        const existeAsignatura = await Asignatura.findById(uid);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: 'La asignatura no existe'
            });
        }

        const exiteCurso = await Curso.findById(curso);
        if (!exiteCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado a la asignatura no existe'
            });
        }

        let listaprofesoresinsertar = [];

        if (profesores) {
            let listaprofesoresbusqueda = [];

            const listaprof = profesores.map(registro => {
                if (registro.usuario) {
                    listaprofesoresbusqueda.push(registro.usuario);
                    listaprofesoresinsertar.push(registro);
                }
            });

            const existeProfesores = await Usuario.find().where('_id').in(listaprofesoresbusqueda);

            if (existeProfesores.length != listaprofesoresbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores no existe o están repetidos',
                })
            }
        }

        /* --------------------------------------------------------
            almacenar los datos en la BD */

        // crear objeto
        const asignatura = new Asignatura(req.body);
        asignatura.profesores = listaprofesoresinsertar;

        // almacenarlo en la BD
        await asignatura.save();

        res.json({
            ok: true,
            msg: 'crear una asignatura',
            asignatura
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error creando la asignatura'
        });
    }



}

const borrarAsignatura = async(req, res = response) => {

    const uid = req.params.id;

    try {

        // comprobamos que el usuario existe
        const existeAsignatura = await Asignatura.findById(uid);

        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: "La asignatura no existe"
            });
        }

        // lo eliminamos y devolvemos el usuario recien eliminado
        // Remove -> se convierte en Modify en la BD
        // Delete -> debería ser el utilizado...?
        /*DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify */
        const resultado = await Asignatura.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: "Asignatura eliminada",
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: "no se ha podido eliminar la asignatura"
        });
    }

}

module.exports = {
    obtenerAsignaturas,
    crearAsignatura,
    actualizarAsignatura,
    borrarAsignatura
}