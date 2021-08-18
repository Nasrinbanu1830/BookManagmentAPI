const Router = require("express").Router();

const PublicationModel = require("../../database/publication");

/* 
Route       - "/publication"
Description - get all the Publications
Access      - Public
Parameter   - None
Method      - GET
*/


Router.get("/", async(req, res)=> {
    const allPublication= await PublicationModel.find();
    return res.json({publication: allPublication});
 });

/*
Route       - "/author/specific/publication/:ISBN"
Description - get all the specific publication
Access      - Public
Parameter   - ISBN
Method      - GET
*/
Router.get("/author/specific/:ISBN", async(req, res)=> {

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
Route       - "/publication/new"
Description - add new publication
Access      - Public
Parameter   - none
Method      - POST
*/ 
 Router.post("/new",async (req,res) => {
    const { newPublication } = req.body;
      await  PublicationModel.create(newPublication);
    return res.json({ books: newPublication,message:"author was added!" })    
    });


/*
Route       - "/publication/update/book"
Description - update/ add new author of book
Access      - Public
Parameter   - isbn
Method      - PUT
*/ 
Router.put("/update/book/:isbn", async (req,res) => {
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
Route       - "publication/delete/:id"
Description - delete a publication Id
Access      - Public
Parameter   - Id
Method      - DELETE
*/

Router.delete("/delete/:id", async(req, res)=> {

    const updatedPublicationDatabase= await PublicationModel.findOneAndDelete({
        id: req.params.id,
    });

    return res.json({publication: updatedPublicationDatabase});
});

module.exports = Router;
