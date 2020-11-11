const { response } = require('express');
const validator = require('validator');

const Grupo = require('../models/grupos.model');
const Curso = require('../models/cursos.model');
const Usuario = require('../models/usuarios.model');

const obtenerGrupos = async(req, res = response) => {

    const id = req.query.id;
    // Paginacion
    const desde = Number(req.query.desde) || 0;
    if (desde < 0)
        desde = 0;

    const registropp = Number(process.env.DOCSPERPAGE);

    try {
        let grupos, total;

        if (id) {
            [grupos, total] = await Promise.all([
                Grupo.findById(id).populate('curso', '-__v').populate('alumnos.usuario', '-password -alta -__v'),
                Grupo.countDocuments()
            ]);
        } else {
            [grupos, total] = await Promise.all([
                Grupo.find({}).skip(desde).limit(registropp).populate('curso', '-__v').populate('alumnos.usuario', '-password -alta -__v'),
                Grupo.countDocuments()
            ]);
        }

        res.json({
            ok: true,
            msg: 'obtenerGrupos',
            grupos,
            page: {
                desde,
                registropp,
                total
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener grupos'
        });
    }
}

const crearGrupo = async(req, res = respose) => {

    const { nombre, alumnos, curso } = req.body;

    try {
        // Comprobar que existe el curso
        const existeCurso = await Curso.findById(curso);

        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso no existe'
            });
        }

        // Comprobar que no existe un grupo con ese nombre
        const existeGrupo = await Grupo.findOne({ nombre, curso });

        if (existeGrupo) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo ya existe en el mismo curso'
            });
        }

        let listaalumnosinsertar = [];

        if (alumnos) {
            let listaalumnosbusqueda = [];

            const listaalu = alumnos.map(registro => {
                if (registro.usuario) {
                    listaalumnosbusqueda.push(registro.usuario);
                    listaalumnosinsertar.push(registro);
                }
            });

            const existeAlumnos = await Usuario.find().where('_id').in(listaalunnosbusqueda);

            if (existeAlumnos.length != listaalunnosbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los alumnos no existe o están repetidos',
                })
            }
        }




        const grupo = new Grupo(req.body);
        grupo.alumnos = listaalumnosinsertar;
        // Almaccenar en BD
        await grupo.save();

        res.json({
            ok: true,
            msg: 'Grupo creado',
            grupo,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear grupo'
        });
    }
}

const actualizarGrupo = async(req, res = response) => {


    const { nombre, alumnos, curso } = req.body;
    const uid = req.params.id;

    try {
        // Comprobar que existe el curso
        const existeCurso = await Curso.findById(curso);

        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso no existe'
            });
        }
        // Comprobar que no existe un grupo con ese nombre
        const existeGrupo = await Grupo.findById(id);

        if (!existeGrupo) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo no existe'
            });
        }

        // Comprobar que no existe un grupo con ese nombre
        const existeGrupo = await Grupo.findOne({ nombre, curso });

        if (existeGrupo && (existeGrupo._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo ya existe en el mismo curso'
            });
        }

        let listaalumnosinsertar = [];

        if (alumnos) {
            let listaalumnosbusqueda = [];

            const listaalu = alumnos.map(registro => {
                if (registro.usuario) {
                    listaalumnosbusqueda.push(registro.usuario);
                    listaalumnosinsertar.push(registro);
                }
            });

            const existeAlumnos = await Usuario.find().where('_id').in(listaalunnosbusqueda);

            if (existeAlumnos.length != listaalunnosbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los alumnos no existe o están repetidos',
                })
            }
        }

        let object = req.body;
        object.alumnos = listaalumnosinsertar;

        const grupo = await Grupo.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Grupo actualizado',
            grupo
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error modificando grupo'
        });
    }
}

const borrarGrupo = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Comprobamos si existe el grupo que queremos borrar
        const existeGrupo = await Grupo.findById(uid);

        if (!existeGrupo) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo no existe'
            });
        }
        // lo eliminamos y devolvemos el usuario recien eliminado
        const resultado = await Grupo.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Grupo eliminado',
            resultado,
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando grupo'
        });
    }
}

module.exports = { obtenerGrupos, crearGrupo, actualizarGrupo, borrarGrupo }