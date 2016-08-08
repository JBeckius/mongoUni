var express = require('express');

module.exports = function() {
  var app = express();

  app.get('/', function(req, res) {
    //req contains information about the incoming request.
    //res includes utilities for crafting a response.

    //Sends a plain HTTP response
    res.send('Hello, world!');
  });
//:user is route parameter
//gives access to whatever string is in this :user
  app.get('/user/:user', function(req, res) {
    res.send('Page for user ' + req.params.user + ' with option ' +
      req.query.option);
      //contains key: value pairs representing the URL's query string
      //The query string is anything that comes after the question mark
        //in the URL. ex. LH:3000/user/mongodb/?option=test
        //would set the option to equal test.
  });

  return app;
};
