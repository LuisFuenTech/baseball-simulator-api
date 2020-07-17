const { db, TABLES } = require('./src/database');
const { shuffleArray, delay, generarSemana } = require('./src/utils');

const start = async () => {
  const equipos = await db.select().from(TABLES.EQUIPOS);

  async function loop(array, fecha) {
    const _equipos = shuffleArray(array);
    const encuentros = arreglarEquipos(_equipos);
    const semana = generarSemana([0, 4], moment(fecha));
    console.log('loop -> semana', fecha, semana);

    for (const [index, item] of encuentros.entries()) {
      try {
        const { encuentros } = item;

        for (const encuentro of encuentros) {
          try {
            let carrerasEquipoA = Math.random() * (15 - 6) + 6;
            let carrerasEquipoB = Math.random() * (15 - 6) + 6;

            while (carrerasEquipoA === carrerasEquipoB) {
              carrerasEquipoA = Math.random() * (15 - 6) + 6;
              carrerasEquipoB = Math.random() * (15 - 6) + 6;
            }

            const homeRunsA = Math.random() * (2 - 0) + 0;
            const homeRunsB = Math.random() * (2 - 0) + 0;

            const resultados = {
              fecha: semana[index].format('YYYY-MM-DD'),
              hora: '16:30:30',
              idEquipoA: encuentro[0].id,
              idEquipoB: encuentro[1].id,
              carrerasEquipoA,
              homeRunsA,
              carrerasEquipoB,
              homeRunsB,
              idGanador:
                carrerasEquipoA > carrerasEquipoB
                  ? encuentro[0].id
                  : encuentro[1].id
            };

            await guardarEncuentros(resultados);
          } catch (error) {
            console.log(error);
          }
        }

        console.log(semana[index].format('YYYY-MM-DD'));
      } catch (error) {
        console.log(error);
      }
    }

    console.log('END OF WEEK');
    await delay(15000);
    const nextWeek = moment(semana[semana.length - 1]).week() + 1;

    loop(_equipos, moment().week(nextWeek).startOf('isoweek'));
  }

  const ultimoEncuentro = await db
    .select('fecha')
    .from(TABLES.ENCUENTROS)
    .orderBy('fecha', 'desc')
    .first();

  let siguienteSemana;
  let fechaActual;

  if (ultimoEncuentro) {
    siguienteSemana = moment(moment(ultimoEncuentro.fecha)).week() + 1;
    fechaActual = moment().week(siguienteSemana).startOf('isoweek');
  } else {
    siguienteSemana = moment(moment()).week() + 1;
    fechaActual = moment().week(siguienteSemana).startOf('isoweek');
  }

  loop(equipos, fechaActual);
};

const arreglarEquipos = (_equipos) => {
  const encuentros = [];

  encuentros.push({
    encuentros: [
      [_equipos[0], _equipos[1]],
      [_equipos[2], _equipos[3]]
    ]
  });
  encuentros.push({
    encuentros: [
      [_equipos[4], _equipos[0]],
      [_equipos[1], _equipos[2]]
    ]
  });
  encuentros.push({
    encuentros: [
      [_equipos[3], _equipos[1]],
      [_equipos[2], _equipos[4]]
    ]
  });
  encuentros.push({
    encuentros: [
      [_equipos[2], _equipos[0]],
      [_equipos[4], _equipos[3]]
    ]
  });
  encuentros.push({
    encuentros: [
      [_equipos[0], _equipos[3]],
      [_equipos[1], _equipos[4]]
    ]
  });

  return encuentros;
};

const guardarEncuentros = async (encuentro) => {
  try {
    await db.insert(encuentro).into(TABLES.ENCUENTROS);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  start
};
