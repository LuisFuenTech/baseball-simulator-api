const router = require('express').Router();
const controlador = require('./controlador');

router.get('/posiciones', controlador.mostrarResultados);
router.get('/partidos', controlador.mostrarPartidos);

module.exports = router;