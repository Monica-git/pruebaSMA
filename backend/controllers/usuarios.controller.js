const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios.model');
const Grupo = require('../models/grupos.model');


const obtenerUsuarios = async(req, res) => {

    //encontrar un unico usuario
    const id = req.query.id;

    if (id == undefined) {
        return res.status(400).json({
            ok: false,
            msg: 'Como que undefined',
            id
        });
    }

    // paginacion
    // Number: tipar como numero (por si envian cosas raras)
    let desde = Number(req.query.desde) || 0;
    if (desde < 0)
        desde = 0;
    const registropp = 10;

    try {

        let usuarios, total;

        if (id) {
            if (!validator.isMongoId(id)) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Controller: El id de usuario debe ser valido'
                });
            }

            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [usuarios, total] = await Promise.all([
                Usuario.findById(id).populate('grupo'),
                Usuario.countDocuments()
                /*
                count : deprecated
                countDocuments: centa el numero de documentos, acepta filtros
                estimatedDocumentCount: realiza una estimación, no da e numero concreto, más rapido que el anterior
                */
            ]);

        } else {
            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [usuarios, total] = await Promise.all([
                Usuario.find({}).skip(desde).limit(registropp).populate('grupo'),
                Usuario.countDocuments()
                /*
                count : deprecated
                countDocuments: centa el numero de documentos, acepta filtros
                estimatedDocumentCount: realiza una estimación, no da e numero concreto, más rapido que el anterior
                */
            ])
        }

        res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios,
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
            msg: 'error buscando el usuario'
        });
    }
}

const crearUsuario = async(req, res) => {

    const { email, password, rol } = req.body;

    try {

        const exiteEmail = await Usuario.findOne({ email: email });

        if (exiteEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }
        if (rol && rol != 'ROL_ALUMNO' && rol != 'ROL_PROFESOR' && rol != 'ROL_ADMIN') {
            return res.status(400).json({
                ok: false,
                msg: 'ROL incorrecto'
            });
        }

        // generar cadena aleatoria para el cifrado
        const salt = bcrypt.genSaltSync();
        // hacer un hash de la contraseña
        const cpassword = bcrypt.hashSync(password, salt);

        /* --------------------------------------------------------
            almacenar los datos en la BD */

        // crear objeto
        const usuario = new Usuario(req.body);
        usuario.password = cpassword;

        // almacenarlo en la BD
        await usuario.save();

        res.json({
            ok: true,
            msg: 'crear un usuario',
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error creando el usuario'
        });
    }


}

const actualizarUsuario = async(req, res = response) => {

    // aunque venga el password aqui no se va a cambiar
    // si cambia el email, hay que comprobar que no exista en la BD
    const { password, email, ...object } = req.body;
    const uid = req.params.id;

    try {
        // comprobar que no exista el email
        const existeEmail = await Usuario.findOne({ email: email });

        if (existeEmail) {
            // si existe, miramos que sea el suyo (que no lo esta cambiando)
            if (existeEmail._id != uid) {

                return res.status(400).json({
                    ok: false,
                    msg: "Email ya existe"
                });
            }
        }
        // aqui ya se ha comprobado el email
        object.email = email;
        // new: true -> nos devuelve el usuario actualizado
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'actualizarUsuario',
            usuario
        });

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }



}

const borrarUsuario = async(req, res) => {

    const uid = req.params.id;

    try {

        // comprobamos que el usuario existe
        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: "El usaurio no existe"
            });
        }

        // lo eliminamos y devolvemos el usuario recien eliminado
        // Remove -> se convierte en Modify en la BD
        // Delete -> debería ser el utilizado...?
        /*DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify */
        const resultado = await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: "Usuario eliminado",
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: "no se ha podido eliminar el usuario"
        });
    }

}

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}