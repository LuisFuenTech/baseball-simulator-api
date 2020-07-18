require('./init')();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const expHbs = require('express-handlebars');
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
app.use(redirectToHTTPS([/(localhost):(\d{4})/], [], 301));

//Settings
app.set('views', path.join(__dirname, 'src', 'views'));
app.engine(
  '.hbs',
  expHbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
  })
);
app.set('view engine', '.hbs');

//Statics files
app.use(express.static(path.join(__dirname, 'src', 'public')));

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
    dynoJob.start();
    return res.status(200).send({ message: 'dyno job iniciado' });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send({ error: error.message });
  }
});

app.use('/main', async (req, res) => {
  try {
    dynoJob.start();
    return res.render('index');
  } catch (error) {
    console.log('error', error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = app;
