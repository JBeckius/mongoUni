var express = require('express');
var wagner = require('wagner-core');

//loading product by id.
//if product._id === "00001"
//we can access it at LH:3000/api/v1/product/id/00001
//Tada!

//requires models.js
require('./models')(wagner);

var app = express();

//requires api.js
app.use('/api/v1', require('./api')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');
