require('./init')();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const hostname = require('os').hostname;
const { startMatch, dynoJob } = require('./src/jobs');

const routes = require('./router')();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));

//Redirect to HTTPS
app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

// routes
app.use('/', routes);

app.get('/', async (req, res) => {
  try {
    return res.status(200).send({
      service: 'Basesball API',
      database: 'conectado',
      message: 'aplicacion corriendo',
      hostname
    });
  } catch (error) {
    return res
      .status(500)
      .send({ estado: 'aplicacion esta abajo', error: error.message });
  }
});

app.use('/iniciar', async (req, res) => {
  try {
    startMatch.job.start();
    return res.status(200).send({ message: 'partidos iniciados' });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

app.use('/wake-up', async (req, res) => {
  try {
    dynoJob.job.start();
    return res.status(200).send({ message: 'dyno job iniciado' });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = app;
