const Entidad = require('./entidad');
const Helper = require('./helper');

const mostrarResultados = async (req, res) => {
  try {
    const { fecha } = req.query;

    const entidad = new Entidad({ fecha });
    const encuentros = await entidad.listarResultados();

    const resultados = await Helper.obtenerPosiciones(encuentros);

    return res.status(200).send(resultados);
  } catch (error) {
    return res.status(200).send({ message: error.message });
  }
};

const mostrarEncuentros = async (req, res) => {
  try {
    const { fecha } = req.query;

    const entidad = new Entidad({ fecha });
    const encuentros = await entidad.listarEncuentros();

    const resultados = await Helper.obtenerResultados({ encuentros, fecha });

    return res.status(200).send(resultados);
  } catch (error) {
    console.log("mostrarEncuentros -> error", error)
    return res.status(200).send({ message: error.message });
  }
};

module.exports = {
  mostrarResultados,
  mostrarEncuentros
};
