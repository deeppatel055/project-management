// config/constants.js
require('dotenv').config();

const BASE_URL = process.env.BASE_URL 
console.log('base',process.env.BASE_URL);

module.exports = {
  BASE_URL,
  DEFAULT_PROFILE_PIC: `${BASE_URL}/public/images/default-profile.png`,
};
