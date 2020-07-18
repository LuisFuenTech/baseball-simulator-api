const mostrarResultados = async (req, res) => {
  try {
    return res.render('resultados');
  } catch (error) {
    return res.status(200).send({
      error: error.message
    });
  }
};

const mostrarPartidos = async (req, res) => {
  try {
    return res.render('partidos');
  } catch (error) {
    return res.status(200).send({
      error: error.message
    });
  }
};

module.exports = {
  mostrarResultados,
  mostrarPartidos
};
