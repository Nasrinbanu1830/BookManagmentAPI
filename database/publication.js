const mongoose = require("mongoose");

// Publication Schema
const PublicationSchema = mongoose.Schema({
  id: Number,
  name: String,
  books: {
    type: String,
    required: true,
    minLength: 8,
    MaxLength: 10,

  },
});

// Publication Model
const PublicationModel = mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;
