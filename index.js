require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

//database
const database = require("./database/index");

//models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

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
.then(() => console.log("connection established!!!!!"))

/*
Route        /
Description  get all books
Access       Public
Method       GET
*/ 

shapeAI.get("/", (req,res) =>{
    return res.json({ books: database.books })
});

/*
Route        /:isbn
Description  get specific books based on isbn
Access       Public
Method       GET
*/ 

shapeAI.get("/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn );
        if(getSpecificBook.length === 0){
            return res.json({ error: `No book found for the  ISBN of ${req.params.isbn}`});
        }
        return res.json({ books: getSpecificBook})
});

/*
Route        /c
Description  get specific book based on Category
Access       Public
Parameter    category
Method       GET
*/ 

shapeAI.get("/c/:category", (req,res) => {
    const getSpecificBooks = database.books.filter((book) => 
    book.category.includes(req.params.category)
         );
        if(getSpecificBooks.length === 0){
            return res.json({ error: `No book found for the  category of ${req.params.category}`});
        }
        return res.json({ books: getSpecificBooks })


});

/*
Route        /a
Description  get specific book based on author
Access       Public
Parameter    author
Method       GET
*/ 



/*
Route        /a
Description  get all authors
Access       Public
Parameter    NONE
Method       GET
*/ 

shapeAI.get("/author", (req,res) => {
    return res.json({ authors: database.authors });
});

/*
Route        /author
Description  get all authors
Access       Public
Parameter    isbn
Method       GET
*/ 
shapeAI.get("/author/:isbn", (req,res) => {
    const getSpecificAuthors = database.authors.filter((author) => author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthors.length === 0){
        return res.json({ error: `No author found for the book ${ req.params.isbn}`,
    });
    }
   return res.json({getSpecificAuthors });
});


shapeAI.post("/book/new",(req,res) => {
const { newBook } = req.body;
database.books.push(newBook);
return res.json({ books: database.books,message:"book was added!" })    
});

/*
Route        /author/new
Description  add new authors
Access       Public
Parameter    none
Method       POST
*/ 
shapeAI.post("/author/new",(req,res) => {
    const { newAuthor } = req.body;
    database.authors.push(newAuthor);
    return res.json({ books: database.authors,message:"author was added!" })    
    });
    
    /*
Route        /publication/new
Description  add new publication
Access       Public
Parameter    none
Method       POST
*/ 
 shapeAI.post("/publication/new",(req,res) => {
    const { newPublication } = req.body;
    database.publications.push(newPublication);
    return res.json({ books: database.publications,message:"author was added!" })    
    });

/*
Route        /book/update/:title
Description  update title of book
Access       Public
Parameter    title
Method       PUT
*/ 


shapeAI.put("/book/update/:isbn",  (req,res) => {
   database.books.forEach((book) => {
       if(book.ISBN === req.params.isbn) {
           book.title = req.body.bookTitle;
           return;
       }
   
});
   return res.json({ books: database.books });
});
/*
Route        /book/author/update/:isbn
Description  update/ add new author of book
Access       Public
Parameter    title
Method       PUT
*/ 

shapeAI.put("/book/author/update/:isbn",(req,res) => {
    // update book database
  database.books.forEach((book) => {
   if(book.ISBN === req.params.isbn) 
   return book.authors.push(req.body.newAuthor);
  });

  // update author database
  database.authors.forEach((author) => {
      if(author.id === req.body.newAuthor)
      return author.books.push(req.params.isbn);
  });

  return res.json ({
       books: database.books,
       authors:database.authors,
       message:"New Author Was Added"
    });
});  

/*
Route        /publication/update/book
Description  update/ add new author of book
Access       Public
Parameter    isbn
Method       PUT
*/ 
shapeAI.put("/publication/update/book/:isbn", (req,res) => {
    //update publication database
    database.publications.forEach((publication) =>{
        if(publication.id === req.body.pubId){
            return publication.books.push(req.params.isbn);
        }
    });
    //update book database
    database.books.forEach((book) =>{
       if(book.ISBN === req.params.isbn);{
           book.publication = req.body.pubId;
           return;
       }
    });
    return res.json({ books: database.books,
        publications:database.publications,
        message:"successfully updated publication"
    })
});

/*
Route        /book/delete
Description  delete a book
Access       PUBLIC
Parameter    isbn
Method       DELETE
*/ 

shapeAI.delete("/book/delete/:isbn", (req,res) => {
   
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
        );

        database.books = updatedBookDatabase;
        return res.json({ books:database.books });

});

/*
Route        /book/delete/author
Description  delete a author from book
Access       PUBLIC
Parameter    isbn,author
Method       DELETE
*/ 

shapeAI.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    
    //update the book database
    database.books.forEach((book) => {
      if(book.ISBN === req.params.isbn){
          const newAuthorList = book.authors.filter((author) => author !== parseInt(req.params.authorId)
          );
          book.authors = newAuthorList;
          return;
      }
    });

    //update author database
    database.authors.forEach((author) => {
      if(author.id === parseInt(req.params.authorId)){
          const newBooksList = author.books.filter(
              (book) => book !== req.params.isbn
              );

         author.books = newBooksList;
         return;
            }
    });
    return res.json({
        book: database.books, 
        author: database.authors,
        message:"author was deleted",
        });
});

/*
Route        /publication/delete/book
Description  delete a book from publication
Access       PUBLIC
Parameter    isbn,publication id
Method       DELETE
*/ 

shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req,res) => {
    //update publication database
    database.publications.forEach((publication) => {
      if(publication.id === parseInt(req.params.pubId)){
          const newBooksList = publication.books.filter(
              (book) => book !== req.params.isbn);

       publication.books = newBooksList;
       return;
      }
    });
    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = 0;   // no publication available
            return;
        }
    });
     return res.json({books: database.books,
         publications: database.publications,
         message:"author was deleted!!!"});
});


shapeAI.listen(3000 ,() => console.log("server running"));

