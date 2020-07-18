const { db, TABLES } = require('../../database');
const { generarSemana } = require('../../utils');

const obtenerPosiciones = async (encuentros) => {
  const equipos = await db.select().from(TABLES.EQUIPOS);
  let resultados = [];

  for (const [index, equipo] of equipos.entries()) {
    let carreras = 0,
      partidosGanados = 0,
      homeRuns = 0,
      partidosPerdidos = 0;

    encuentros.map((item) => {
      if (item.idEquipoA === equipo.id) {
        carreras += item.carrerasEquipoA;
        partidosGanados += item.idGanador === equipo.id ? 1 : 0;
        partidosPerdidos += item.idGanador !== equipo.id ? 1 : 0;
        homeRuns += item.homeRunsA;
      }

      if (item.idEquipoB === equipo.id) {
        carreras += item.carrerasEquipoB;
        partidosGanados += item.idGanador === equipo.id ? 1 : 0;
        partidosPerdidos += item.idGanador !== equipo.id ? 1 : 0;
        homeRuns += item.homeRunsB;
      }
    });

    resultados.push({
      id: equipo.id,
      nombre: equipo.nombre,
      carreras,
      partidosGanados,
      homeRuns,
      partidosPerdidos
    });
  }

  return _.orderBy(
    resultados,
    ['partidosGanados', 'carreras', 'homeRuns'],
    ['desc', 'desc', 'desc']
  );
};

const obtenerResultados = async ({ encuentros, fecha }) => {
  const semana = generarSemana([0, 4], moment(fecha));
  let resultados = [];

  for (const [index, dia] of semana.entries()) {
    try {
      const partidos = encuentros.filter(
        (item) => item.fecha === dia.format('YYYY-MM-DD')
      );

      const grupos = partidos.map((item) => {
        return {
          equipoA: {
            nombre: item.equipoA,
            carreras: item.carrerasEquipoA,
            homeRuns: item.homeRunsA,
            ganador: item.idGanador === item.idEquipoA
          },
          equipoB: {
            nombre: item.equipoB,
            carreras: item.carrerasEquipoB,
            homeRuns: item.homeRunsB,
            ganador: item.idGanador === item.idEquipoB
          }
        };
      });

      resultados.push({
        fecha: dia.format('YYYY-MM-DD'),
        hora: partidos[0].hora,
        encuentros: grupos
      });
    } catch (error) {
      console.log(error);
    }
  }

  return _.orderBy(resultados, ['fecha'], ['asc']);
};

module.exports = {
  obtenerPosiciones,
  obtenerResultados
};
