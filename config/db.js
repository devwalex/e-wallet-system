require('dotenv/config');

const environment = process.env.NODE_ENV || 'development';   
const configuration = require('../knexfile')[environment];   
const db = require('knex')(configuration);

module.exports = db