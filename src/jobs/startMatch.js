const { CronJob } = require('cron');
const { db, TABLES } = require('../../src/database');
const { shuffleArray, generarSemana } = require('../../src/utils');

const job = new CronJob(`0 */30 * * * *`, async () => {
  console.log('HEEEyyy');
  const equipos = await db.select().from(TABLES.EQUIPOS);

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

  const _equipos = shuffleArray(equipos);
  const encuentros = arreglarEquipos(_equipos);
  const semana = generarSemana([0, 4], moment(fechaActual));
  console.log('loop -> semana', fechaActual, semana);

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
});

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
  job
};
