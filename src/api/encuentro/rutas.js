const router = require('express').Router();
const controlador = require('./controlador');

router.get('/resultados', controlador.mostrarResultados);
router.get('/partidos', controlador.mostrarEncuentros);

module.exports = router;