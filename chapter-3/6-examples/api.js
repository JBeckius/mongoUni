var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
  var api = express.Router();

//loads product by id
  api.get('/product/id/:id', wagner.invoke(function(Product) {
    return function(req, res) {
      //finds a product with matching _id
      Product.findOne({ _id: req.params.id },
        //.bind is powerful javascript tool for reusing code
        //we define the handleOne function down below
        //handleOne.bind returns a function
        //the first param is the value of the "this" variable in handleOne
        //we aren't using 'this' so we pass null
        //instead, the second two params to handleOne.bind
        //become the first two params passed into the handleOne function
        handleOne.bind(null, 'product', res));
    };
  }));

  //returns all products that belong to a given category,
    //including its subcategories
  //for instance, if you ask for all products within the category Electronics
    //you will get phones as well as laptops
  //As per out schema design, we will get these products by searching
    //for all products whose category ancestors array contains the given category.
  //the caveat is that users can ask to sort by price.
  api.get('/product/category/:id', wagner.invoke(function(Product) {
    return function(req, res) {
      var sort = { name: 1 };
      //checks to see if user requested price sort.
      if (req.query.price === "1") {
        //sorts by price, with lowest price first :1
        //remember, we keep approxPriceUsd with a custom setter
          //this allows consistent sort
        sort = { 'internal.approximatePriceUSD': 1 };
      } else if (req.query.price === "-1") {
        //sorts by price, with highest price first :-1
        sort = { 'internal.approximatePriceUSD': -1 };
      }

      Product.
        find({ 'category.ancestors': req.params.id }).
        sort(sort).
        exec(handleMany.bind(null, 'products', res));
    };
  }));

  return api;
};

//takes 4 params.
//the error and result fields come from a findOne call
function handleOne(property, res, error, result) {
  //'this' === null because of .bind
  //property === 'product'
  //res === res of api.get('/product/id/:id'
  if (error) {
    //if error, return error
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }
  if (!result) {
    //if no result, return status 404
    return res.
      status(status.NOT_FOUND).
      json({ error: 'Not found' });
  }
  //if found, return property
  var json = {};
  json[property] = result;
  res.json(json);
}

function handleMany(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}
