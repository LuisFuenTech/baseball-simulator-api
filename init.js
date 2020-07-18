const moment = require('moment');
const _ = require('lodash');
const axios = require('axios');

module.exports = () => {
  global.moment = moment;
  global._ = _;
  global.axios = axios;
};
