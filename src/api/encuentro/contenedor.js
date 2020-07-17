const { db, TABLES } = require('../../database');

const listarResultados = async ({ fecha }) => {
  const inicioDeSemana = moment(fecha).startOf('isoweek').format('YYYY-MM-DD');
  const finDeSemana = moment(fecha).endOf('isoweek').format('YYYY-MM-DD');
  console.log(
    'listarResultados -> inicioDeSemana',
    inicioDeSemana,
    finDeSemana
  );

  return await db
    .select(
      db.raw(
        `*, date_format(fecha, '%Y-%m-%d') as fecha, time_format(hora, '%r') as hora`
      )
    )
    .from(TABLES.ENCUENTROS)
    .whereRaw(
      `
    fecha >= '${inicioDeSemana}' and fecha <= '${finDeSemana}'
    `
    )
    .orderBy('fecha', 'asc');
};

const listarEncuentros = async ({ fecha }) => {
  const inicioDeSemana = moment(fecha).startOf('isoweek').format('YYYY-MM-DD');
  const finDeSemana = moment(fecha).endOf('isoweek').format('YYYY-MM-DD');

  return await db
    .select(
      db.raw(
        `encuentros.*, 
        date_format(fecha, '%Y-%m-%d') as fecha, 
        time_format(hora, '%r') as hora,
        equipoA.nombre as equipoA,
        equipoB.nombre as equipoB
        `
      )
    )
    .from(TABLES.ENCUENTROS)
    .joinRaw(`inner join equipos equipoA on equipoA.id = encuentros.idEquipoA`)
    .joinRaw(`inner join equipos equipoB on equipoB.id = encuentros.idEquipoB`)
    .whereRaw(
      `
  fecha >= '${inicioDeSemana}' and fecha <= '${finDeSemana}'
  `
    )
    .orderBy('fecha', 'asc');
};

module.exports = { listarResultados, listarEncuentros };
