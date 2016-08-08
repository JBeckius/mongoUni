var obj = { a: 1 };

//pass two params with test.bind.
//obj become the function's 'this'
//'first parameter' becomes the first argument in any calls to the
//testWithP1 function
var testWithP1 = test.bind(obj, 'first parameter');

//whenever you call testWithP1 again,
//the first parameter that gets passed to it will
//actually be the second.
testWithP1('second parameter');

function test(p1, p2) {
  //You will see the json object passed as 'this' with .bind
  //in this case, it is { a: 1 }
  console.log('This = ' + require('util').inspect(this));
  //p1 = first parameter
  console.log('p1 = ' + p1);
  //p2 = second parameter
  console.log('p2 = ' + p2);
}
