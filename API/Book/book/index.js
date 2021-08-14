
//initialize express router
const Router = require("express").Router();

//Database Models
const BookModel = require("../../database/book");

/*
Route       -"/" 
Description - get all books
Access      - Public
parameters   -none
Method      - GET
*/ 

Router.get("/", async (req,res) =>{
   const getAllBooks = await BookModel.find();
   return res.json({ books: getAllBooks });
});

/*
Route        - "/is/:isbn"
Description  - get specific books based on isbn
Access       - Public
Method       - GET
*/ 
Router.get("/is/:isbn", async (req,res) => {
   const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn });

      if(!getSpecificBook) {
          return res.json({
               error: `No book found for the  ISBN of ${req.params.isbn}`,
      });
  }
      return res.json({ book: getSpecificBook});
});

/*
Route       - "/c"
Description - get specific book based on Category
Access      - Public
Parameter   - category
Method      - GET
*/ 
Router.get("/c/:category", async (req,res) => {
   const getSpecificBooks = await BookModel.findOne({ 
       category: req.params.category,
    });
       if(!getSpecificBooks){
           return res.json({ error: `No book found for the  category of ${req.params.category}`});
       }
       return res.json({ books: getSpecificBooks })


});

/* 
Route       - "/lang:/la"
Description - get all the books based on language
Access      - Public
Parameter   - None
Method      - GET
*/

//Build an api for the books based on language
Router.get("/lang/:la", async(req, res)=>{
   const language= await BookModel.findOne({Language: req.params.la});

   if(!language){
       return res.json({error: `No Book found based on category ${req.params.la}`});
   }

  return res.json({books: language});
});

/*
Route       - "/book/new"
Description - add new books
Access      - Public
Parameter   - none
Method      - POST
*/ 

Router.post("/new", async (req,res) => {
   const { newBook } = req.body;
 
  await BookModel.create(newBook);
 
 return res.json({ message:"book was added!" });
 });

 /*
Route       - "/book/update/:title"
Description - update title of book
Access      - Public
Parameter   - title
Method      - PUT
*/ 


Router.put("/update/:isbn",  async (req,res) => {
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
Route       - "/book/author/update/:isbn"
Description - update/ add new author of book"
Access      - Public
Parameter   - title
Method      - PUT
*/ 


Router.put("/author/update/:isbn", async (req,res) => {
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
Route        /book/delete
Description  delete a book
Access       PUBLIC
Parameter    isbn
Method       DELETE
*/ 

Router.delete("/delete/:isbn", async (req,res) => {

   const updatedBookDatabase = await BookModel.findOneAndDelete(
       {
            ISBN: req.params.isbn,
        });
         return res.json({ books: updatedBookDatabase });

});

/*
Route       - "/book/delete/author"
Description - delete a author from book
Access      - PUBLIC
Parameter   - isbn,author id
Method      - DELETE
*/ 

Router.delete("/delete/author/:isbn/:authorId", async (req,res) => {
    
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


 


module.exports = Router;