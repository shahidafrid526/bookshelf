import express from 'express';
import { CommentModel } from '../models/comment.js';

const router = express.Router();

router.post('/comments', async (req, res) => {
  try {
    const { text, userID, username, bookDescription } = req.body;

    // Create a new comment
    const newComment = new CommentModel({
      text,
      userID,
      username,
      bookDescription,
    });

    // Save the new comment in the database
    await newComment.save();

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/comments', async (req, res) => {
  try {
    const comments = await CommentModel.find();
    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the comment by ID and remove it from the database
    await CommentModel.findByIdAndRemove(id);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { router as commentsRouter };
