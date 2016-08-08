var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('Category API', function() {
  var server;
  var Category;

  before(function() {
    var app = express();

    // Bootstrap server
    //set up rest API server
    models = require('./models')(wagner);
    //include Express subrouter
    app.use(require('./api')(wagner));
    //start server at 3000
    server = app.listen(3000);

    // Make Category model available in tests
    Category = models.Category;
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  //this runs before each test
  beforeEach(function(done) {
    // Make sure categories are empty before each test
    //this deletes all categories
    Category.remove({}, function(error) {
      assert.ifError(error);
      done();
    });
  });

  //basic sanity test for categories by _id route
  it('can load a category by id', function(done) {
    // Create a single category
    Category.create({ _id: 'Electronics' }, function(error, doc) {
      assert.ifError(error);
      var url = URL_ROOT + '/category/id/Electronics';
      // Make an HTTP request to localhost:3000/category/id/Electronics
      //This triggers when it gets back the get request
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        // And make sure we got { _id: 'Electronics' } back
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        //checks to see if true. In this case, present === true
        assert.ok(result.category);
        //checks to see if result id === 'Electronics'
        assert.equal(result.category._id, 'Electronics');
        done();
      });
    });
  });

  //basic sanity test for categories by parent route
  it('can load all categories that have a certain parent', function(done) {
    //first, it defines 4 categories, some of them nested
    var categories = [
      { _id: 'Electronics' },
      { _id: 'Phones', parent: 'Electronics' },
      { _id: 'Laptops', parent: 'Electronics' },
      { _id: 'Bacon' }
    ];

    // Creates the 4 categories
    Category.create(categories, function(error, categories) {
      var url = URL_ROOT + '/category/parent/Electronics';
      // Make an HTTP request to localhost:3000/category/parent/Electronics
      superagent.get(url, function(error, res) {
        //checks for error
        assert.ifError(error);
        var result;
        //if no error is thrown, continue
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        //checks to see if result length is ===2
        assert.equal(result.categories.length, 2);
        // Should be in ascending order by _id
        assert.equal(result.categories[0]._id, 'Laptops');
        assert.equal(result.categories[1]._id, 'Phones');
        //ends mocha tests. Very important.
        done();
      });
    });
  });
});
