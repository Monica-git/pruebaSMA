const { response } = require('express');
const Grupo = require('../models/grupos.model');

const obtenerGrupos = async(req, res = response) => {

    // Paginacion
    const desde = Number(req.query.desde) || 0;
    if (desde < 0)
        desde = 0;

    const registropp = Number(process.env.DOCSPERPAGE);

    try {

        const [grupos, total] = await Promise.all([
            Grupo.find({}).skip(desde).limit(registropp),
            Grupo.countDocuments()
        ]);
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

    const nombre = String(req, body.nombre).trim();

    try {
        // Ccomprobar que no existe un grupo con ese nombre
        const existeGrupo = await Grupo.findOne({ nombre: nombre });

        if (existeGrupo) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo ya existe'
            });
        }

        const grupo = new Grupo(req.body);
        grupo.nombre = nombre;
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
            msg: 'Error al obtener grupos'
        });
    }
}

const actualizarGrupo = async(req, res = response) => {

    const nombre = String(req.body.nombre).trim();
    const object = req.body;
    const uid = req.params.id;

    try {
        // Si han enviado el nombre, comprobar que no exista otro en BD con el mismo nombre
        if (nombre) {
            const existeGrupo = await Grupo.findOne({ nombre });
            if (existeGrupo) {
                if (existeGrupo._id != uid) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El grupo ya existe'
                    });
                }
            }
            object.nombre = nombre;
        }

        const grupo = await Grupo.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Usuario actualizado',
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
        // Comprobamos si existe el usuario que queremos borrar
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