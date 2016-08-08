var express = require('express');
var status = require('http-status');
//makes server responses easier to read

module.exports = function(wagner) {
  //creates a new Express router.
    //We return it at the end of the function.
    //this allows higher level apps to include the router using app.use
  var api = express.Router();
  //we have two routes in the router

  //This first route loads categories by their _id field.
    //for instance, if we navigate, in the browser, to
    //localhost:3000/api/v1/category/id/Electronics
    //We will get the details for the electronics category.
  api.get('/category/id/:id', wagner.invoke(function(Category) {
    return function(req, res) {
      //takes category model.
      //finds one category by its _id as provided in the route parameter

      Category.findOne({ _id: req.params.id }, function(error, category) {
        if (error) {
          //if error, return HTTP internal server error
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            //and send back error string as JSON
            json({ error: error.toString() });
        }
        if (!category) {
          //if query returns, but (!category) no results
          return res.
                  //equivalent to 404
            status(status.NOT_FOUND).
            json({ error: 'Not found' });
        }
        //if success, send back the category as JSON
        res.json({ category: category });
      });
    };
  }));

  //Looks up categories whose parent is a given category
  //localhost:3000/api/v1/category/parent/Electronics
  //will load all categories whose parent category is Electronics
  api.get('/category/parent/:id', wagner.invoke(function(Category) {
    return function(req, res) {
      Category.
      //does find on categories whose parent matches the route param id
        find({ parent: req.params.id }).
        //it sorts them by their id
        sort({ _id: 1 }).
        exec(function(error, categories) {
          //if error occurs
          if (error) {
            return res.
            //send bak HTTP internal server error
              status(status.INTERNAL_SERVER_ERROR).
              //and error as string
              json({ error: error.toString() });
          }
          //if successful, return all of the categories we found
          res.json({ categories: categories });
        });
    };
  }));
  //We now return the Express router.
  return api;
};
