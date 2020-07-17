const moment = require('moment');
const _ = require('lodash');

module.exports = () => {
  global.moment = moment;
  global._ = _;
};
