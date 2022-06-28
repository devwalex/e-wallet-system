require('dotenv/config');

const environment = process.env.NODE_ENV || 'development';   
const configuration = require('../knexfile')[environment];   
const db = require('knex')(configuration);
const { attachPaginate } = require('knex-paginate');
attachPaginate();
module.exports = db