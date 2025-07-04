// config/constants.js
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

module.exports = {
  BASE_URL,
  DEFAULT_PROFILE_PIC: `${BASE_URL}/public/images/default-profile.png`,
};
