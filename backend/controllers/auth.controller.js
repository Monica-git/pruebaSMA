const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios.model');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // comprobar que existe el usuario
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }
        // comprobar la contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }
        // usuario y contraseña correctos

        const { _id, rol } = usuarioDB;
        // creamos el token
        const token = await generarJWT(usuarioDB._id, usuarioDB.rol);

        res.json({
            ok: true,
            msg: 'login',
            id: _id,
            rol,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }



}
module.exports = { login }