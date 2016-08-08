var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: { type: String, required: true },
  courses: [{ type: String, ref: 'Course' }]
});

/* Returns the student's first name, which we will define
 * to be everything up to the first space in the student's name.
 * For instance, "William Bruce Bailey" -> "William" */
schema.virtual('firstName').get(function() {
  for (var i = 0; i < this.name.length; ++i) {
    if(this.name[i] === " ") {
      return this.name.slice(0, i);
    }
  }
});

/* Returns the student's last name, which we will define
 * to be everything after the last space in the student's name.
 * For instance, "William Bruce Bailey" -> "Bailey" */
schema.virtual('lastName').get(function() {
  for(var i = this.name.length ; i > 0; --i) {
    if(this.name[i] === " ") {
      return this.name.slice(i + 1);
    }
  }
});

module.exports = schema;
