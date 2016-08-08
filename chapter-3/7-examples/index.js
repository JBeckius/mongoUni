//uses new dependency, body-parser.
//this package parses http request bodies.
//Include it!! It helps you get the most important data from
  //the http request body.
var express = require('express');
var wagner = require('wagner-core');

require('./models')(wagner);

var app = express();

/*
wagner.invoke(function(service) {
  return function(req, res, *add params*) {
    //inner stuff
  };
})
*/

app.use(wagner.invoke(function(User) {
  return function(req, res, next) {
    User.findOne({}, function(error, user) { req.user = user; next(); });
  };
}));
//attach Express subrouter
app.use('/api/v1', require('./api')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');
