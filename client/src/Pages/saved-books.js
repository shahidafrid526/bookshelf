import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaBook, FaCheck } from "react-icons/fa";
import "./savedbooks.css";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import { useGetUserName } from "../hooks/useGetUserName";

export const SavedBooks = () => {
  const [books, setBooks] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const userId = useGetUserID();
  const [cookies] = useCookies(["access_token"]);
  const username = useGetUserName();
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [bookProgress, setBookProgress] = useState({});
  const [showDeleteMessage, setShowDeleteMessage] = useState({});

  useEffect(() => {
    const fetchUserBooks = async () => {
      if (cookies.access_token) {
        try {
          const response = await axios.get(
            `http://localhost:3001/add/books/${userId}`
          );
          setBooks(response.data.savedBooks);
        } catch (error) {
          console.error(error);
        }
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/comment/comments`
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserBooks();
    fetchComments();
  }, [userId, cookies.access_token]);

  const fetchFinishedBooks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/fn/finished-books/${userId}`
      );
      setFinishedBooks(response.data.finishedBooks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (cookies.access_token && userId) {
      fetchFinishedBooks();
    }
  }, [cookies.access_token, userId]);

  useEffect(() => {
    // Initialize bookProgress state with the initial progress from the fetched books
    const initialBookProgress = {};
    books.forEach((book) => {
      // Set progress to 100% if the book exists in finishedBooks, otherwise use the existing progress
      initialBookProgress[book._id] = finishedBooks.some(
        (finishedBook) =>
          finishedBook.userId === userId &&
          finishedBook.description === book.description
      )
        ? 100
        : book.progress || 0;
    });
    setBookProgress(initialBookProgress);
  }, [userId, books, finishedBooks]);

  useEffect(() => {
    // Initialize showDeleteMessage state with false for each book
    const initialShowDeleteMessage = {};
    books.forEach((book) => {
      initialShowDeleteMessage[book._id] = false;
    });
    setShowDeleteMessage(initialShowDeleteMessage);
  }, [books]);

  const markAsFinishedReading = async (bookId) => {
    try {
      const bookToMark = books.find((book) => book._id === bookId);
      const { title, description, authors, imageLink } = bookToMark;

      // Check if the book with the same userId and bookDescription exists in finishedBooks
      const isAlreadyFinished = finishedBooks.some(
        (book) => book.userId === userId && book.description === description
      );

      if (!isAlreadyFinished) {
        // Add the finished book to the database if it's not already finished
        await axios.post(`http://localhost:3001/fn/finished-books/${userId}`, {
          title,
          description,
          authors,
          imageLink,
        });

        // Fetch the updated finished books after marking as finished
        fetchFinishedBooks();

        // Update the bookProgress state to 100 for the finished book
        setBookProgress((prevProgress) => ({
          ...prevProgress,
          [bookId]: 100,
        }));

        // Show the delete message for 10 seconds
        setShowDeleteMessage((prevState) => ({
          ...prevState,
          [bookId]: true,
        }));

        // Automatically delete the finished book after 10 seconds
        setTimeout(() => {
          markAsUnread(bookId);
          setShowDeleteMessage((prevState) => ({
            ...prevState,
            [bookId]: false,
          }));
        }, 10000); // 10 seconds
      } else {
        // Handle the case where the book is already finished
        console.log("Book is already finished.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFinishedBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:3001/fn/finished-books/${bookId}`);
      fetchFinishedBooks(); // Fetch updated finished books after deletion
    } catch (error) {
      console.error(error);
    }
  };

  const markAsUnread = async (bookId) => {
    try {
      await axios.delete(`http://localhost:3001/add/books/${bookId}`);
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error(error);
    }
  };

  const getProgress = (bookId) => {
    // If the book has a progress property, use that value; otherwise, return 0
    const book = books.find((book) => book._id === bookId);
    return book && book.progress ? book.progress : 0;
  };

  const addComment = async (bookId, bookDescription) => {
    try {
      const book = books.find((book) => book._id === bookId);
      if (!book) {
        return;
      }

      const comment = {
        text: newComment,
        userID: userId, // Use the already available userId
        username: username, // Include the username here
        bookDescription,
      };

      await axios.post(`http://localhost:3001/comment/comments`, comment);
      setNewComment(""); // Clear the comment input field after submitting

      // Fetch the updated comments
      const response = await axios.get(
        `http://localhost:3001/comment/comments`
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3001/comment/comments/${commentId}`);

      // Fetch the updated comments
      const response = await axios.get(
        `http://localhost:3001/comment/comments`
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error(error);
    }
  };

  const formatCommentDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div>
      <div className="saved-books-container">
        <div className="savedBk">
          <h2>Saved Books</h2>
          {books.map((book, index) => (
            <div className="saved-book-card" key={`${book._id}-${index}`}>
              <div className="saved-book-content" id="savedbookscardcont">
                <div id="sbookImg">
                  <img
                    className="saved-book-image"
                    id="isbookImg"
                    src={book.imageLink}
                    alt={book.title}
                  />
                </div>
                <div className="saved-book-details">
                  <h3 className="saved-book-title">{book.title}</h3>
                  <p className="saved-book-description">{book.description}</p>
                  <p className="saved-book-author">
                    <span className="author-label">Author's:</span>{" "}
                    {book.authors ? book.authors.join(", ") : ""}
                  </p>

                  <div className="pgdlup">
                    <p className="saved-book-progress">
                      Progress: {bookProgress[book._id]}%
                    </p>

                    <button
                      className="saved-book-delete-button"
                      onClick={() => markAsUnread(book._id)}
                    >
                      <FaTrash />
                    </button>
                    <div className="tooltip">
                      <FaBook
                        className="saved-book-finish-icon"
                        onClick={() => markAsFinishedReading(book._id)}
                      />
                      <span className="tooltip-text">Finish Reading</span>
                    </div>
                  </div>
                  <div>
                    {showDeleteMessage[book._id] && (
                      <p style={{ color: "red" }}>
                        This book will be deleted in 10 seconds.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="comment-section">
                <h2 style={{ textAlign: "left", fontWeight: "100" }}>
                  Comments
                </h2>
                {/* Display the comments related to the book */}
                {comments.map((comment, commentIndex) => {
                  if (comment.bookDescription === book.description) {
                    return (
                      <div
                        className="comment"
                        key={`${comment._id}-${commentIndex}`}
                      >
                        <div className="comment-text">
                          <p>{comment.text}</p>
                          <div className="usDt">
                            <p className="comDate">
                              {formatCommentDate(comment.createdDate)}
                            </p>
                            <p className="comUser">{comment.username}</p>
                          </div>
                        </div>
                        <button
                          className="comment-delete-button"
                          onClick={() => deleteComment(comment._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    );
                  }
                  return null;
                })}
                {/* Add a form to submit new comments */}
                <form
                  className="comment-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newComment.trim() !== "") {
                      addComment(book._id, book.description);
                    }
                  }}
                >
                  <div className="inputBtn">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                    />
                    <button type="submit" className="comBtn">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ))}
        </div>
        <div className="fnBooks">
          <h2>Finished Books</h2>
          <div className="finished-books-container">
            {finishedBooks.map((book) => (
              <div className="finished-book-card" key={book._id}>
                <div className="finished-book-content">
                  <div className="bookImg">
                    <img
                      className="finished-book-image"
                      src={book.imageLink}
                      alt={book.title}
                    />
                    <button
                      className="finished-book-delete-button"
                      onClick={() => deleteFinishedBook(book._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="finished-book-details">
                    <h3 className="finished-book-title">{book.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
