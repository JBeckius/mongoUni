var express = require('express');
var wagner = require('wagner-core');
//wagner allows for services and factories like angular.js

//uses models.js to bootstrap mongoose models
require('./models')(wagner);

var app = express();

//uses api.js file to bootstrap application
//app.use is very complex
  //we are currently using it for Express subrouter functionality
  //in other words, the api.js function is going to return an Express subrouter.
  //Express will default to the subrouter every time someone visits
  //a URL that starts with /api/v1
app.use('/api/v1', require('./api')(wagner));

//starts http server on port 3000
app.listen(3000);
console.log('Listening on port 3000!');
