var mongoose = require('mongoose');
var Category = require('./category');
var fx = require('./fx');

var postSchema = {
  name: { type: String, required: true },
                              //requires start w/ http://
                              //might need https://
  url: { type: String, match: /^http:\/\//i, required: true },
  category: Category.categorySchema
};

var schema = new mongoose.Schema(postSchema);

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = schema;
module.exports.postSchema = postSchema;
