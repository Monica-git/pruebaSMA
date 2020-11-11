/*
Ruta base: /api/grupos
*/

const { Router } = require('express');
const { obtenerGrupos, crearGrupo, actualizarGrupo, borrarGrupo } = require('../controllers/grupos.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    check('id', 'El identificador no es válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,

], obtenerGrupos);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('curso', 'El argumento curso no es valido').isMongoId(),

    check('alumnos.*.usuario', 'El identificador de alumno no es valido').optional.isMongoId(),
    check('proyecto').optional().trim(),
    check('proyectodes').optional().trim(),
    validarCampos,
], crearGrupo);

router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('curso', 'El argumento curso no es valido').isMongoId(),

    check('alumnos.*.usuario', 'El identificador de alumno no es valido').optional.isMongoId(),
    check('proyecto').optional().trim(),
    check('proyectodes').optional().trim(),
    validarCampos,
], actualizarGrupo);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], borrarGrupo);

module.exports = router;