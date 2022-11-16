import express from "express";
import cors from "cors";
import booksData from "./data/books.json";

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Route that returns all data on all books
app.get('/books', (req, res) => {

  // function for pagination:
  const pagination = (data, pageNumber) => {
    const pageSize = 45
    const startIndex = (pageNumber-1) * pageSize
    const endIndex = startIndex + pageSize
    const itemsOnPage = data.slice(startIndex, endIndex)

    const returnObject = {
        page_size: pageSize,
        page: pageNumber,
        num_of_pages: Math.ceil(data.length / pageSize),  //was pagesize
        items_on_page: booksOnPage.length,
        results: itemsOnPage
    }
    return returnObject
}
  const author = req.query.author
  const top = req.query.top
  let allBooks = booksData;
  
  // Filter for specific author: /books?author=douglas%20adams
  if (author) {
    allBooks = allBooks.filter((book) => 
      book.authors.toLocaleLowerCase()
      .includes(author.toLocaleLowerCase()))
  }
  // Filter for top-rated books: /books?top=true
  if (top) {
    allBooks = allBooks.filter((book) => 
      book.average_rating > '4.3')
  } 
  if (allBooks.length === 0) {
		res.status(404).json("Sorry we couldn't find the book you seek")
	} else res.status(200).json(allBooks) 
});


// Route for a single book based on id 
app.get("/books/:id", (req, res) => {
  const id = req.params.id
  const singleBook = booksData.find((book) => {
    return book.bookID === +id})

  if (!singleBook) {
    res.status(404).json("Sorry we couldn't find a book with that id")
	} else res.status(200).json(singleBook) 
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
