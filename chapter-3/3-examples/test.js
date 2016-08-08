var app = require('./server');
var assert = require('assert');
var superagent = require('superagent');
//superagent is a popular node.js HTTP client
  //comes with some sweet functions

//event driven IO makes it possible to start
  //an HTTP server and make requests to that same
  //server in the same thread.

describe('server', function() {
  var server;

  beforeEach(function() {
    //call the server.js file with app()
    server = app().listen(3000);
  });

  afterEach(function() {
    server.close();
  });

  it('prints out "Hello, world" when user goes to /', function(done) {
    //Things are a little tricky here. This is a Mocha asynchronous test.
      //Mocha inspects the parameters of the function you pass to the
      //it function. If the function takes an argument, Mocha assumes that
      //this test is asynchronous, and calling done is how you tell Mocha
      //that your test is completed.

    //a superagent .get function. Makes a server request on 3000
      //returns the response as res in the callback
    superagent.get('http://localhost:3000/', function(error, res) {
      assert.ifError(error);
      //assert that server query was successful
      assert.equal(res.status, 200);
      //assert that server returned "Hello, world!"
      assert.equal(res.text, "Hello, world!");
      //done() ends the mocha test. It is important!
      done();
    });
  });
});
