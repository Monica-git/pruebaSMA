const jwt = require('jsonwebtoken');

const generarJWT = (uid, rol) => {


    return new Promise((resolve, reject) => {

        const payload = {
            uid,
            rol
        }

        // firmar el payload con nuestra clave secreta
        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: '24h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }

        });

    });

}

module.exports = { generarJWT }