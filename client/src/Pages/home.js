import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { SavedBooks } from "./saved-books";
import "./home.css";
import { useGetUserID } from "../hooks/useGetUserID";

export const Home = () => {
  const [book, setBook] = useState("");
  const apiKey = "AIzaSyBeedcFxpMwt1qxq4odlLYJPWltMqY0pSw";
  const [searchs, setSearch] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  const userID = useGetUserID();
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (cookies.access_token) {
      // Fetch the saved books from the server
      Axios.get(`http://localhost:3001/add/books/${userID}`)
        .then((res) => {
          setSavedBooks(res.data.savedBooks);
        })
        .catch((error) => {
          console.error("Error fetching saved books:", error);
        });
    }
  }, [cookies.access_token, userID]);

  function handleChange(event) {
    setBook(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (book.trim() === "") {
      setFormError("Please enter a book name.");
      return;
    }

    Axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${book}&key=${apiKey}`
    )
      .then((res) => {
        setSearch(res.data.items);
        setFormError("");
      })
      .catch((error) => {
        console.error("Error searching books:", error);
      });
  };

  const handleSaveBook = (book) => {
    const {
      volumeInfo: {
        title,
        description,
        imageLinks: { thumbnail },
      },
    } = book;

    const authors = book.volumeInfo.authors;

    // Check if the required fields are provided
    if (!title || !description) {
      console.error("Title and description are required");
      return;
    }

    const imageLink = thumbnail || "";

    // Check if a book with a similar title already exists for the current user
    const isBookAlreadySaved = savedBooks.some(
      (savedBook) => savedBook.title === title && savedBook.userID === userID
    );

    if (isBookAlreadySaved) {
      console.error("Book with similar title already exists for this user");
      return;
    }

    const newBook = {
      title,
      description,
      authors: authors ? authors.join(", ") : "",
      imageLink,
      userID,
    };

    Axios.put(`http://localhost:3001/add/savedbooks/${userID}`, newBook)
      .then((res) => {
        console.log("Book saved successfully");
        const savedBook = res.data.savedBook;
        setSavedBooks((prevBooks) => [...prevBooks, savedBook]);
      })
      .catch((error) => {
        console.error("Error saving book:", error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="searchBar-cont">
        {!cookies.access_token ? (
          <>
            <h1
              style={{ color: "red", marginTop: "-20px", marginRight: "20px" }}
            >
              Login To Access
            </h1>
            <input
              type="text"
              placeholder="Login to Search Book"
              className="searchbar"
              disabled
            />
            <button type="submit" className="SearchBtn-inactive" disabled>
              Search
            </button>
          </>
        ) : (
          <>
            <div className="errorDisp">{formError && <p>{formError}</p>}</div>
            <input
              type="text"
              placeholder="Search Book"
              onChange={handleChange}
              className="searchbar"
            />
            <button type="submit" className="SearchBtn">
              Search
            </button>
          </>
        )}
      </form>
      <div>{formError && <p className="error-message">{formError}</p>}</div>
      <div className="container cards">
        {searchs.map((search) => {
          const id = search.id;
          const image = search.volumeInfo?.imageLinks?.thumbnail;
          const title = search.volumeInfo.title;
          const isBookSaved = savedBooks.some(
            (savedBook) => savedBook.title === title
          ); // Check if book is already saved

          return (
            <div key={id} className="column">
              <div className={`book-card ${isBookSaved ? "saved" : ""}`}>
                <div className="card-image">
                  <img src={image} alt={title} />
                </div>
                <div className="card-content">
                  <h1>{title}</h1>
                  {isBookSaved ? (
                    <p className="saved-message">Currently Reading The Book</p>
                  ) : (
                    <button
                      className="save-button"
                      id="savebuttonst"
                      onClick={() => handleSaveBook(search)}
                      disabled={isBookSaved}
                    >
                      {isBookSaved ? "Reading..." : "Read"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
