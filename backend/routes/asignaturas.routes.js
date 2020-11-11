/*
    Ruta base: /api/asignaturas
*/

const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const {
    obtenerAsignaturas,
    crearAsignatura,
    actualizarAsignatura,
    borrarAsignatura

} = require('../controllers/asignaturas.controller');




router.get('/', [
    validarJWT,
    // campos opcionales, si vienen, los validamos
    check('id', 'El id de la asignatura ha de ser valido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,

], obtenerAsignaturas);


router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('curso', 'El curso no es válido').isMongoId(),

    check('profesores.*.usuario', 'El identificador de profesor no es válido').optional().isMongoId(),

    validarCampos,
], crearAsignatura);

router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('curso', 'El curso no es válido').isMongoId(),

    check('profesores.*.usuario', 'El identificador de profesor no es válido').optional().isMongoId(),

    validarCampos,
], actualizarAsignatura);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarAsignatura);

module.exports = router;