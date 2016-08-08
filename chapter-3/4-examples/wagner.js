var express = require('express');
var mongoose = require('mongoose');
var wagner = require('wagner-core');
//A wonder dependency injector

setupModels(mongoose, wagner);

var app = express();

setupApp(app, wagner);

app.listen(3000);
console.log('Listening on port 3000!');

function setupModels(mongoose, wagner) {
  mongoose.connect('mongodb://localhost:27017/test');

  var userSchema = new mongoose.Schema({
    name: String
  });
  var User = mongoose.model('User', userSchema);

  //wagner uses services very similar to those found in angular.js
  wagner.factory('User', function() {
    //return the User Mongoose model
    return User;
  });
}

function setupApp(app, wagner) {
  //wagner.invoke behaves like the angular.js invoke.
    //it takes a function and executes it, but pulls in services
    //that match the parameter names. In this case, it injects
    //a mongoose model.
  var routeHandler = wagner.invoke(function(User) {
    //notice that the invoked function returns an express
      //route handler. Because we invoke it, the var routeHandler
      //actually becomes and Express route handler, which we can pass to
      //app.get. Plus, it already has the User model in its scope without
      //pulling from the global space. Genius!
    return function(req, res) {
      User.findOne({ _id: req.params.id }, function(error, user) {
        res.json({ user: user });
      });
    };
  });

  app.get('/user/:id', routeHandler);
}
