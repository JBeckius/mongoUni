var mongoose = require('mongoose');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost:27017/test');
  //connects to mongodb server

  var Category =
    //creates mongoose model by including the schema
    mongoose.model('Category', require('./category'), 'categories');

  wagner.factory('Category', function() {
    //registers category service with wagner
    return Category;
  });

  return {
    Category: Category
  };
};
