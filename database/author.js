const mongoose = require("mongoose");
// Author Schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: {
      type: String,
      required: true,
      minLength: 8,
      MaxLength: 10,

    },
  });
  
  // Author Model
  const AuthorModel = mongoose.model("authors",AuthorSchema);
  
  module.exports = AuthorModel;
  