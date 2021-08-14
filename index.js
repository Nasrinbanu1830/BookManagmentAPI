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

shapeAI.get("/", async (req,res) =>{
    const getAllBooks = await BookModel.find();
    return res.json({ books: getAllBooks })
});

/*
Route        /:isbn
Description  get specific books based on isbn
Access       Public
Method       GET
*/ 

shapeAI.get("/is/:isbn", async (req,res) => {
     const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn });

        if(!getSpecificBook) {
            return res.json({
                 error: `No book found for the  ISBN of ${req.params.isbn}`,
        });
    }
        return res.json({ book: getSpecificBook});
});


/*
Route        /c
Description  get specific book based on Category
Access       Public
Parameter    category
Method       GET
*/ 

shapeAI.get("/c/:category", async (req,res) => {
    const getSpecificBooks = await BookModel.findOne({ 
        category: req.params.category,
     });
        if(!getSpecificBooks){
            return res.json({ error: `No book found for the  category of ${req.params.category}`});
        }
        return res.json({ books: getSpecificBooks })


});

/* 
Route: "/lang:/la"
Description: to get all the books based on language
Access: Public
Parameter: None
Method: Get
*/

//Build an api for the books based on language
shapeAI.get("/lang/:la", async(req, res)=>{
    const language= await BookModel.findOne({Language: req.params.la});

    if(!language){
        return res.json({error: `No Book found based on category ${req.params.la}`});
    }

   return res.json({books: language});
});


/*
Route        /author
Description  get all authors
Access       Public
Parameter    isbn
Method       GET
*/ 
shapeAI.get("/author/:isbn", async (req,res) => {
    const getAllAuthors = awaitAuthorModel.find();
   return res.json({ getAllAuthors });
});


/* 
Route: "/author/id"
Description: to get all the specific author
Access: Public
Parameter: None
Method: Get
*/

shapeAI.get("/specific/:ISBN", async(req, res)=> {

    const getSpecificPublication= await AuthorModel.findOne({books: req.params.ISBN});

    if(!getSpecificPublication){
        return res.json({error: `No Book Found for the requested ISBN ${req.params.ISBN}`});
    }
    // const getSpecificPublication= database.authors.filter((author)=> author.books.includes(req.params.ISBN));


    // if(getSpecificPublication.length=== 0){
    //     return res.json({error: `No Book Found for the requested ISBN ${req.params.ISBN}`});
    // }
    return res.json({authors: getSpecificPublication});
});
/* 
Route: /author/book/:ISBN
Description: to get all the list of author based on books
Access: Public
Parameter: ISBN
Method: Get
*/

shapeAI.get("/book/:ISBN", async(req, res)=> {
    const Book= await AuthorModel.findOne({books: req.params.ISBN});
    if(!Book){
        return res.json({error: `No List of authors found for ${req.params.ISBN}`});
    }

    //  const Book= database.authors.filter((author)=> author.books.includes(req.params.ISBN));

    //  if(Book.length=== 0){
    //      return res.json({error: `No List of authors found for ${req.params.ISBN}`});
    //  }
     return res.json({authors: Book});
});

/* 
Route: "/publication"
Description: to get all the Publications
Access: Public
Parameter: None
Method: Get
*/


shapeAI.get("/", async(req, res)=> {
    const allPublication= await PublicationModel.find();
    return res.json({publication: allPublication});
 });

/*
 Route: "/author/specific/publication/:ISBN"
Description: to get all the specific publication
Access: Public
Parameter: ISBN
Method: Get
*/
shapeAI.get("/author/specific/:ISBN", async(req, res)=> {

    const getSpecificPublication= await PublicationModel.findOne({ISBN: req.params.ISBN});

    if(!getSpecificPublication){
        return res.json({error: `No Book Found for the requested ISBN ${req.params.ISBN}`});
    }
    // const getSpecificPublication= database.publications.filter((author)=> author.books.includes(req.params.ISBN));


    // if(getSpecificPublication.length=== 0){
    //     return res.json({error: `No Book Found for the requested ISBN ${req.params.ISBN}`});
    // }
    return res.json({authors: getSpecificPublication});
});




/*
Route        /book/new
Description  add new books
Access       Public
Parameter    none
Method       POST
*/ 

shapeAI.post("/book/new", async (req,res) => {
  const { newBook } = req.body;

 await BookModel.create(newBook);

return res.json({ message:"book was added!" });
});

/*
Route        /author/new
Description  add new authors
Access       Public
Parameter    none
Method       POST
*/ 
shapeAI.post("/author/new",async (req,res) => {
    const { newAuthor } = req.body;
    await AuthorModel.create(newAuthor);

    return res.json({ message:"author was added!" })    
    });
    
    /*
Route        /publication/new
Description  add new publication
Access       Public
Parameter    none
Method       POST
*/ 
 shapeAI.post("/publication/new",async (req,res) => {
    const { newPublication } = req.body;
      await  PublicationModel.create(newPublication);
    return res.json({ books: newPublication,message:"author was added!" })    
    });

/*
Route        /book/update/:title
Description  update title of book
Access       Public
Parameter    title
Method       PUT
*/ 


shapeAI.put("/book/update/:isbn",  async (req,res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
         ISBN:req.params.isbn,
        },
         {
             title: req.body.bookTitle,
         },
         {
             new: true,
         }
         );
   

   return res.json({ books: updatedBook });
});

/*
Route        /book/author/update/:isbn
Description  update/ add new author of book
Access       Public
Parameter    title
Method       PUT
*/ 


shapeAI.put("/book/author/update/:isbn", async (req,res) => {
   //update book database
   const updatedBook = await  BookModel.findOneAndUpdate(
       {
            ISBN: req.params.isbn, 
        },
        
        { 
            $addToSet: {
            authors: req.body.newAuthor,
         },
        }, 
        {
          new:true,
         }
        );


  // update author database
   const updatedAuthor = await AuthorModel.findOneAndUpdate(
       {
        id : req.body.newAuthor,
       },
       {
           $addToSet:{
               books: req.params.isbn,
           },
       },
       {
           new: true
       }
       );
  

  return res.json ({
       books: updatedBook,
       authors:updatedAuthor,
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
shapeAI.put("/publication/update/book/:isbn", async (req,res) => {
    //update publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
         id: req.body.pubId,
       },
       {
          $addToSet: {
              books:req.params.isbn,
          },
       },
       {
           new:true,
       }
    );

    //database.publications.forEach((publication) =>{
       // if(publication.id === req.body.pubId){
           // return publication.books.push(req.params.isbn);
        //}
    //});
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
           ISBN : req.params.isbn,
        },
        {
            $addToSet:{
               publications : req.body.pubId,
            },
        },   
        {
            new: true,
        }
    );
    
    return res.json({ books: updatedPublication,
        publications:updatedBook,
        message:"successfully updated publication"
    });
});

/*
Route        /book/delete
Description  delete a book
Access       PUBLIC
Parameter    isbn
Method       DELETE
*/ 

shapeAI.delete("/book/delete/:isbn", async (req,res) => {

   const updatedBookDatabase = await BookModel.findOneAndDelete(
       {
            ISBN: req.params.isbn,
        });
         return res.json({ books: updatedBookDatabase });

});

/*
Route        /book/delete/author
Description  delete a author from book
Access       PUBLIC
Parameter    isbn,author id
Method       DELETE
*/ 

shapeAI.delete("/book/delete/author/:isbn/:authorId", async (req,res) => {
    
    //update the book database

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn,
        },
        {
             $pull:{
                 authors: parseInt(req.params.authorId),
             },
        },
        {
            new: true
        }
        );

    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id : parseInt(req.params.authorId),
        },
        {
            $pull:{
                books: req.params.isbn,
            },
        },
        {
            new: true
        }
    );
    return res.json({
        book: updatedBook, 
        author: updatedAuthor,
        message:"author was deleted",
        });
});

/*
Route        /publication/delete/:id
Description  delete a publication Id
Access       Public
Parameter     Id
Method         Delete
*/

shapeAI.delete("/delete/:id", async(req, res)=> {

    const updatedPublicationDatabase= await PublicationModel.findOneAndDelete({
        id: req.params.id,
    });

    return res.json({publication: updatedPublicationDatabase});
});




shapeAI.listen(3000 ,() => console.log("server running"));

