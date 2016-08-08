var mongoose = require('mongoose');
//The key principle of dependency injection
  //is to seperate the creation of dependencies
  //from the execution of those dependencies.

mongoose.connect('mongodb://localhost:27017/test');

var userSchema = new mongoose.Schema({
  name: String
});
//We set up the Mongoose model as a variable.
var User = mongoose.model('User', userSchema);

myUserFunction(User);

//Here, we are passing the Mongoose model as a parameter
  //to the myUserFunction.
  //Why? A. It's easy to refactor the myUserFunc out into a seperate file,
  //because all of its dependencies are specified as params.
  //B. It's easy to reinstrument the dependencies in case things change in the future.
  //All you have to do is change the way you inititalize the user model.
function myUserFunction(User) {
  User.create({ name: 'John' }, function(error, doc) {
    console.log(require('util').inspect(doc));
  });
}
