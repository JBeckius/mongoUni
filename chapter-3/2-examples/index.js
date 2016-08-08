var server = require('./server');
//imports express instantiation and get requests

//Sets express to listen at port 3000
server().listen(3000);
console.log('Server listening on port 3000!');
