const { CronJob } = require('cron');
const axios = require('axios');
const { DYNO_API_URL } = process.env;

const job = new CronJob(`0 */25 * * * *`, async () => {
  const urls = [DYNO_API_URL];
  try {
    console.log(`setTimeout called.`);
    // HTTP GET request to the dyno's url
    urls.map(url => {
      axios.get(url).then(() => console.log(`Fetching ${url}.`));
    });
  } catch (err) {
    // catch fetch errors
    console.log(`Error fetching ${urls}: ${err.message} Will try again...`);
  }
});

module.exports = job;