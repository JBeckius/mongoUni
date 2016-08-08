var mongodb = require('mongodb');
var movies = require('./movies');
var connect = require('./connect.js');
var insert = require('./interface').insert;
var byDirector = require('./interface').byDirector;

connect(function(error, db) {
  if (error) {
    console.log(error);
    process.exit(1);
  }


})
