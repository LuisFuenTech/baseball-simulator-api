const router = require('express').Router();
const routes = require('./src/api');

module.exports = () => {
  router.use('/encuentro', routes.encuentro);
  router.use('/cliente', routes.cliente);

  return router;
};
