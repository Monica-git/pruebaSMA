const Usuario = require('../models/usuarios.model');
const { validationResult } = require('express-validator');

const obtenerUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre apellidos');
    res.json({
        ok: true,
        msg: 'getUsuarios',
        usuarios
    });
}

const crearUsuario = async(req, res) => {

    res.json({
        ok: true,
        msg: 'crear un usuario'
    });
}

const actualizarUsuario = async(req, res) => {
    res.json({
        ok: true,
        msg: 'actualizarUsuario'
    });
}

const borrarUsuario = async(req, res) => {
    res.json({
        ok: true,
        msg: 'borrarUsuario'
    });
}

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}