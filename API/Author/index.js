const Router = require("express").Router();

const AuthorModel = require("../../database/author");





/*
Route        -  "/author"
Description  - get all authors
Access       - Public
Parameter    - isbn
Method       - GET
*/ 
Router.get("/:isbn", async (req,res) => {
    const getAllAuthors = awaitAuthorModel.find();
   return res.json({ authors: getAllAuthors });
});


/* 
Route       - "/author/id"
Description - get all the specific author
Access      - Public
Parameter   - None
Method      - GET
*/

Router.get("/specific/:ISBN", async(req, res)=> {

    const getSpecificPublication= await AuthorModel.findOne({books: req.params.ISBN});

    if(!getSpecificPublication){
        return res.json({error: `No Book Found for the requested ISBN ${req.params.ISBN}`});
    }
    return res.json({authors: getSpecificPublication});
});


/* 
Route       - "/author/book/:ISBN"
Description - get all the list of author based on books
Access      - Public
Parameter   - ISBN
Method      - GET
*/

Router.get("/book/:ISBN", async(req, res)=> {
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
Route       - "/author/new"
Description - add new authors
Access      - Public
Parameter   - none
Method      - POST
*/ 
Router.post("/new",async (req,res) => {
    const { newAuthor } = req.body;
    await AuthorModel.create(newAuthor);

    return res.json({ message:"author was added!" })    
    });
/*
Route: /book/author/name/:id
Description: to update author name
Access: Public
Parameter: ID
Method: Put
*/
//Build an API to update an author name
Router.put("/book/author/name/:id", async (req, res)=> {

    const UpdatedAuthorName= await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.id),
        },
        {
            name: req.body.newAuthorName,
        },
        {
            new: true,
        }
    );
    // database.authors.forEach((author)=> {
    //     if(author.id=== parseInt(req.params.id)){
    //         author.name= req.body.newAuthorName;
    //         return;
    //     }
    // });
 return res.json({author: UpdatedAuthorName}); 
 });

 /*
Route        - "/book/author/name/:id"
Description  - to update author name
Access       - Public
Parameter    - ID
Method       - PUT
*/

Router.put("/book/publication/name/:id", async(req, res)=> {

    const UpdatePublication=  await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.id),
        },
        {
            name: req.body.newPublicationName,
        },
        {
            new: true,
        }
    );
 return res.json({publication: UpdatePublication}); 
 });

        


 /*
Route       - "/author/delete/:id"
Description - to delete an author Id
Access      - Public
Parameter   - Id
Method      -  Delete
*/

Router.delete("/delete/:id", async(req, res)=> {

    const updatedAuthorDatabase= await AuthorModel.findOneAndDelete({
        id: req.params.id,
    });
    return res.json({authors: updatedAuthorDatabase});
});

/*
Route        - "book/delete/author/:isbn/:authorId"
Description  - "delete an authorId"
Access       - "Public"
Parameter    - "ISBN, author Id"
Method       - "Delete"
*/


Router.delete("book/delete/:isbn/:authorId", async(req, res)=> {

    const updatedDatabaseBook= await BookModel.findOneAndUpdate(
        {
             ISBN: req.params.isbn,
        },
        {
          $pull:{
             Author: parseInt(req.params.authorId),
          },
        },
        {
            new: true,
        }
        );

   //update author database
   const UpdatedDatabaseAuthor= await AuthorModel.findOneAndUpdate(
   {
       id:  parseInt(req.params.authorId),
   },
   {
       $pull:{
           books: req.params.isbn,
       },
   },
   {
       new: true,
   }
   );
    return res.json({books:updatedDatabaseBook, authors:UpdatedDatabaseAuthor, message: "Author was deleted"});
});




module.exports = Router;

