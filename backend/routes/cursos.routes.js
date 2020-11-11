/*
    Ruta base: /api/cursos
*/

const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const {
    obtenerCursos,
    crearCurso,
    actualizarCurso,
    borrarCurso

} = require('../controllers/cursos.controller');




router.get('/', [
    validarJWT,
    // campos opcionales, si vienen, los validamos
    check('id', 'El id de usuario ha de ser valido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,

], obtenerCursos);


router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('activo', 'El estado debe ser true/false').optional().isBoolean(),
    validarCampos,
], crearCurso);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('activo', 'El estado debe ser true/false').optional().isBoolean(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], actualizarCurso);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarCurso);

module.exports = router;