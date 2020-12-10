/* eslint-disable no-undef */
const mysql = require('mysql');
const Promise = require('bluebird');
const database = 'CatwalkRatings';
const connect = mysql.createPool({
  connectionLimit: 10,
  host: '3.15.209.217',
  user: 'root',
  password: 'BM0football',
  database: 'CatwalkRatings',
  dialect: 'mysql'
});

const db = Promise.promisifyAll(connect, {multiArgs: true});

db.connectAsync()
  .then(() => console.log('CONNECTION ESTABLISHED'))
  .error(error => {
    console.log('CONNECTION ERROR', error);
  });

module.exports = db;



