var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost:27017/test');
  //Create category model
  var Category =
    mongoose.model('Category', require('./category'), 'categories');
  //create product model
  var Product =
    mongoose.model('Product', require('./product'), 'products');

  var models = {
    Category: Category,
    Product: Product
  };

  // To ensure DRY-ness, register factories in a loop
              //D-R-Y Don't repeat yourself
  //This calls wagner.factory for each of our models
  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });

  return models;
};
