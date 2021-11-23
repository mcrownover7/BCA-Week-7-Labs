import { useState, useEffect } from "react";

function BookList(props) {
  let bookList = props.allBook.map((element) => (
    <li key={element._id}>
      <b>{element.title}</b>, by <i>{element.author}</i>, {element.copies} copies
    </li>
  ));

  return (
    <div id="book-list">
      <ul>{bookList}</ul>
    </div>
  );
}

export default BookList;
