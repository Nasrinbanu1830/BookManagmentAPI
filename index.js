require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");




//initializing Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");



//initializing express
const shapeAI = express();
//Configuration
shapeAI.use(express.json());

//Establishing database connection
mongoose
.connect(process.env.MONGO_URL, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  
})
.then(() => console.log("connection established!!!!!"));


//initializing Microservices
shapeAI.use("/book",Books);
shapeAI.use("/author",Authors);
shapeAI.use("/publication",Publications);








shapeAI.listen(3000 ,() => console.log("server running"));

