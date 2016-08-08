var assert = require('assert');
var express = require('express');
var status = require('http-status');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';
var PRODUCT_ID = '000000000000000000000001';

describe('Product API', function() {
  var server;
  var Category;
  var Product;
  var User;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('./models')(wagner);

    // Make models available in tests
    Category = models.Category;
    Product = models.Product;
    User = models.User;

    //define our own middleware that sets the req.user field
    //to the only user document in our mongo db.
    app.use(function(req, res, next) {
      User.findOne({}, function(error, user) {
        assert.ifError(error);
        req.user = user;
        next();
      });
    });

    app.use(require('./api')(wagner));

    server = app.listen(3000);
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure categories are empty before each test
    Category.remove({}, function(error) {
      assert.ifError(error);
      Product.remove({}, function(error) {
        assert.ifError(error);
        User.remove({}, function(error) {
          assert.ifError(error);
          done();
        });
      });
    });
  });

  beforeEach(function(done) {
    var categories = [
      { _id: 'Electronics' },
      { _id: 'Phones', parent: 'Electronics' },
      { _id: 'Laptops', parent: 'Electronics' },
      { _id: 'Bacon' }
    ];

    var products = [
      {
        name: 'LG G4',
        category: { _id: 'Phones', ancestors: ['Electronics', 'Phones'] },
        price: {
          amount: 300,
          currency: 'USD'
        }
      },
      {
        //sets the _id to the product _id we want to search for
        _id: PRODUCT_ID,
        name: 'Asus Zenbook Prime',
        category: { _id: 'Laptops', ancestors: ['Electronics', 'Laptops'] },
        price: {
          amount: 2000,
          currency: 'USD'
        }
      },
      {
        name: 'Flying Pigs Farm Pasture Raised Pork Bacon',
        category: { _id: 'Bacon', ancestors: ['Bacon'] },
        price: {
          amount: 20,
          currency: 'USD'
        }
      }
    ];

    var users = [{
      profile: {
        username: 'vkarpov15',
        picture: 'http://pbs.twimg.com/profile_images/550304223036854272/Wwmwuh2t.png'
      },
      data: {
        oauth: 'invalid',
        cart: []
      }
    }];

    Category.create(categories, function(error) {
      assert.ifError(error);
      Product.create(products, function(error) {
        assert.ifError(error);
        User.create(users, function(error) {
          assert.ifError(error);
          done();
        });
      });
    });
  });

  it('can save users cart', function(done) {
    //sends put request to this /me/cart route
    //we are sending a cart that contains one element, the asus zen laptop
    var url = URL_ROOT + '/me/cart';
    superagent.
      put(url).
      send({
        data: {
          //cart with single item
          cart: [{ product: PRODUCT_ID, quantity: 1 }]
        }
      }).
      end(function(error, res) {
        //check for error
        assert.ifError(error);
        //check for success
        assert.equal(res.status, status.OK);
        //find user (only one, so no search params necessary)
        //and check cart for updated items
        User.findOne({}, function(error, user) {
          assert.ifError(error);
          assert.equal(user.data.cart.length, 1);
          assert.equal(user.data.cart[0].product, PRODUCT_ID);
          assert.equal(user.data.cart[0].quantity, 1);
          done();
        });
      });
  });
  //more or less inverse operation to above
  it('can load users cart', function(done) {
    var url = URL_ROOT + '/me';
    //find the user (only one, so no params necessary)
    User.findOne({}, function(error, user) {
      assert.ifError(error);
      //modify the user's cart
      user.data.cart = [{ product: PRODUCT_ID, quantity: 1 }];
      //save the user
      user.save(function(error) {
        assert.ifError(error);
        //make get request to /me route
        superagent.get(url, function(error, res) {
          assert.ifError(error);

          assert.equal(res.status, 200);
          var result;
          assert.doesNotThrow(function() {
            result = JSON.parse(res.text).user;
          });
          //assert that the get request correctly populated the document.
          assert.equal(result.data.cart.length, 1);
          assert.equal(result.data.cart[0].product.name, 'Asus Zenbook Prime');
          assert.equal(result.data.cart[0].quantity, 1);
          //call done in mocha or else...
          done();
        });
      });
    });
  });
});
