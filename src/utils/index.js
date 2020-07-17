const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generarSemana = (exclusions, currentDate) => {
  let fisrtDayWeek = moment(currentDate).startOf('isoweek');
  let lastDayWeek = moment(currentDate).endOf('isoweek');

  const daysRange = Math.abs(lastDayWeek.diff(fisrtDayWeek, 'days'));
  const ascendingDate = lastDayWeek.diff(fisrtDayWeek) > 0;

  let datesRange = [];

  for (let i = 0; i <= daysRange; i++) {
    ascendingDate
      ? datesRange.push(
          moment(fisrtDayWeek).set({ hour: 16, minute: 30, second: 0 })
        )
      : datesRange.push(
          moment(lastDayWeek).set({ hour: 16, minute: 30, second: 0 })
        );

    ascendingDate ? fisrtDayWeek.add(1, 'days') : lastDayWeek.add(1, 'days');
  }

  return datesRange.filter((item) => !exclusions.includes(item.days()));
};

module.exports = {
  shuffleArray,
  delay,
  generarSemana
};
