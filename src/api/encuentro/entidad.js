const Contenedor = require('./contenedor');

class Encuentro {
  constructor(params) {
    this.id = params.id;
    this.fecha = params.fecha;
  }

  async listarResultados() {
    const { fecha } = this;
    return await Contenedor.listarResultados({ fecha });
  }

  async listarEncuentros() {
    const { fecha } = this;
    return await Contenedor.listarEncuentros({ fecha });
  }
}

module.exports = Encuentro;
