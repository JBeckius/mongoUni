//require node.js mongodb driver
var mongodb = require('mongodb');

//path to database
var uri = 'mongodb://localhost:27017/example';
mongodb.MongoClient.connect(uri, function(error, db) {
  //Takes a string (uri) that tells mongo what db to connect to.
  //Also takes a callback function.

  //check for error and end connection if present.
  if (error) {
    console.log(error);
    process.exit(1);
  }

  //specifies a collection to access in the db
  db.collection('sample')
  //inserts a document into the db
  .insert({ x: 1 }, function(error, result) {
    //checks for error on insertion
    if (error) {
      console.log(error);
      process.exit(1);
    }

    db.collection('sample')
    //.find() searches through collection for files .
    //since no search parameter is specified, it returns all .
    //param looks like {'property': value}
    .find({ x: 1})
    //.find() returns a cursor, which points to a single doc in the collection.
    //to see all of the found docs, we use toArray.
    //inside toArray(), use forEach to iterate through the array.
    .toArray(function(error, docs) {
      if (error) {
        console.log(error);
        process.exit(1);
      }

      console.log('Found docs:');

      //inside toArray(), use forEach to iterate through the array.
      docs.forEach(function(doc) {
        console.log(JSON.stringify(doc));
      });
      process.exit(0);
    });
  });
});
