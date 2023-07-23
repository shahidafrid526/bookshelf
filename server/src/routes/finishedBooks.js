// backend/src/routes/finishedBook.js

import express from "express";
import { FinishedBookModel } from "../models/FinishedBooks.js";

const router = express.Router();

router.post("/finished-books/:userId", async (req, res) => {
  try {
    const { title, description, authors, imageLink } = req.body;
    const userId = req.params.userId; // Extract userId from URL parameter

    // Create a new finished book
    const newFinishedBook = new FinishedBookModel({
      userId, // Save the userId in the finished book
      title,
      description,
      authors,
      imageLink,
    });

    // Save the new finished book in the database
    await newFinishedBook.save();

    res.status(201).json({ finishedBook: newFinishedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/finished-books/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch finished books for the specified userId
    const finishedBooks = await FinishedBookModel.find({ userId });

    res.status(200).json({ finishedBooks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/finished-books/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;

    // Find the finished book by its ID and remove it from the database
    await FinishedBookModel.findByIdAndRemove(bookId);

    res.status(200).json({ message: "Finished book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as finishedBookRouter };
