import "./App.css";
import { useState, useEffect } from "react";
import BookList from "./components/BookList";

function App() {
  const [allBook, setAllBook] = useState([]);

  useEffect(() => {
    fetch("/all")
      .then((res) => res.json())
      .then((bookArray) => {
        setAllBook(bookArray);
        console.log(bookArray)
      });
  }, []);

  return (
    <div className="App">
      <h1 className="page-title">Welcome to the Library!</h1>
      <h3 className="sub-title">
        This app allows for manipulation of the MongoDB database Library and
        collection Books.
      </h3>
      <ul className="all-book-list">
      <BookList allBook={allBook} />
      </ul>
    </div>
  );
}

export default App;


//   {
//     "_id": "618a98f292f77f678bfbfcbe",
//     "title": "Eloquent Javascript",
//     "author": "Marijn Haverbeke",
//     "copies": 1
//   }