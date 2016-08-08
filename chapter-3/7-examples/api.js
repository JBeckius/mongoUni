var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
  var api = express.Router();
  //.use can also attach all sort of middleware to our Express routers
  //Here, we are attaching a bodyparser that parses json
  //so, before any of our route handlers run,
  //this bodyparser middleware parses json from the http request body,
  //and exposes the parsed data to our route handlers
  //as the req.body property
  api.use(bodyparser.json());

  api.put('/me/cart', wagner.invoke(function(User) {
    return function(req, res) {
      try {
        //
                  //we get req.body because of bodyparser
        var cart = req.body.data.cart;
      } catch(e) {
        //if no data.cart field, return bad request
        return res.
          status(status.BAD_REQUEST).
          json({ error: 'No cart specified!' });
      }
      //once data.cart is gotten, sets data.cart to user's cart.
      req.user.data.cart = cart;
      //and then saves the user
      //You might be worried about malicious users.
      //luckily, Mongoose handles casting invalidation under the hood.
      //It's why Mongoose is so important!!
      req.user.save(function(error, user) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        return res.json({ user: user });
      });
    };
  }));

  //this route loads the current user's cart
  //remember that we defined the user's cart in the user schema
  api.get('/me', function(req, res) {
    if (!req.user) {
      return res.
        status(status.UNAUTHORIZED).
        json({ error: 'Not logged in' });
    }
    //we defined the cart as an array that contains object _ids corresponging
      //to the user-chosen products
    //We have to resolve a one-to-many relationship!

    //.populate behaves like an SQL join operation.
    //when called, Mongoose will replace the product ID
    //with the corresponding product from the database.
    //It will execute a query to get all of the products
    //pointed to the user's cart.
    req.user.populate(
      { path: 'data.cart.product', model: 'Product' },
      handleOne.bind(null, 'user', res));
  });

  return api;
};

function handleOne(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }
  if (!result) {
    return res.
      status(status.NOT_FOUND).
      json({ error: 'Not found' });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}
