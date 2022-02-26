require('dotenv/config');

const jwtConfig = {
  appKey: process.env.APP_SECRET_KEY || 'secret',
};

module.exports = jwtConfig
