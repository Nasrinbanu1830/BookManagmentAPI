const books = [
    {
      ISBN: "12345ONE",
      title: "Getting started with MERN",
      authors: [1, 2],
      language: "en",
      pubDate: "2021-07-07",
      numOfPage: 250,
      category: ["fiction", "programming", "tech", "web dev"],
      publication: 1,
    },
    {
      ISBN: "12345TWO",
      title: "Getting started with JAVA",
      authors: [1, 2],
      language: "en",
      pubDate: "2021-07-07",
      numOfPage: 250,
      category: ["fiction", "programming", "tech", "web dev"],
      publication: 1,
    },

  ];
  
  const authors = [
    {
      id: 1,
      name: "Nasrin",
      books: ["12345ONE","12345TWO"],
    },
    {
      id: 2,
      name: "Banu",
      books: ["12345ONE"],
    },
  ];
  
  const publications = [
    {
      id: 1,
      name: "Rishan",
      books: ["12345ONE"],
    },
    {
      id: 2,
      name: "Rishab",
      books: [],
    },
  ];
  
  module.exports = { books, authors, publications };
  