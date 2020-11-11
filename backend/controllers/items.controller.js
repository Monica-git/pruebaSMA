const { response } = require('express');
const validator = require('validator');

const Item = require('../models/items');
const Asignatura = require('../models/asignaturas');
const Usuario = require('../models/usuarios');
const Curso = require('../models/cursos');


const obtenerItems = async(req, res = repsonse) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    // Id item
    const id = req.query.id;

    try {
        let items, total;
        if (id) {
            [items, total] = await Promise.all([
                Item.findById(id).populate({ path: 'asignatura', populate: { path: 'profesores.usuario', select: '-password' } }).populate({ path: 'asignatura', populate: { path: 'curso' } }),
                Item.countDocuments()
            ]);
        } else {
            [items, total] = await Promise.all([
                Item.find({}).skip(desde).limit(registropp).populate({ path: 'asignatura', populate: { path: 'profesores.usuario', select: '-password' } }).populate({ path: 'asignatura', populate: { path: 'curso' } }),
                Item.countDocuments()
            ]);
        }

        res.status(400).json({
            ok: true,
            msg: 'obtenerItems',
            items,
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
            msg: 'Error al obtener items'
        });
    }
}

/*
post / 
<-- nombre (unico), proyecto?, descripcion?
--> item registrado
*/
const crearItem = async(req, res = response) => {

    const { asignatura, ...object } = req.body;

    try {
        // Comprobar que el asignatura que se va a asignar al item existe
        const existeAsignatura = await Asignatura.findById(asignatura);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: 'La asignatura asignada en el item no existe'
            });
        }

        object.asignatura = asignatura;
        const item = new Item(object);

        // Almacenar en BD
        await item.save();

        res.json({
            ok: true,
            msg: 'Item creado',
            item,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando item'
        });
    }
}

const actualizarItem = async(req, res) => {

    const object = req.body;
    const uid = req.params.id;
    const asignatura = req.body.asignatura;


    try {
        // Comprobar que el asignatura que se va a asignar al item existe
        const existeAsignatura = await Asignatura.findById(asignatura);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: 'La asignatura asignada al item no existe'
            });
        }

        const existeItem = await Item.findById(uid);
        if (!existeItem) {
            return res.status(400).json({
                ok: false,
                msg: 'El item no existe'
            });
        }

        const item = await Item.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Item actualizado',
            item
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando item'
        });
    }
}

const borrarItem = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Comprobamos si existe el item que queremos borrar
        const existeItem = await Item.findById(uid);
        if (!existeItem) {
            return res.status(400).json({
                ok: true,
                msg: 'El item no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Item.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Item eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando item'
        });

    }
}

module.exports = { obtenerItems, crearItem, actualizarItem, borrarItem }