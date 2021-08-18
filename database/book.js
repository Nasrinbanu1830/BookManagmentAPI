const mongoose = require("mongoose");

// creating schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        minLength: 8,
        MaxLength: 10,
    },
    title: {
        type: String,
        required: true,
        minLength: 8,
        MaxLength: 10,
      },
    authors: {
        type:Number,
        required: true,
 },
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number,

});

//create a book model

const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;
