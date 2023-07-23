// frontend/src/models/finishedBook.js

import mongoose from 'mongoose';

const finishedBookSchema = new mongoose.Schema({
  userId: { // Add the userId field to link the finished book to the user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
  },
  imageLink: {
    type: String,
  },
});

export const FinishedBookModel = mongoose.model('FinishedBook', finishedBookSchema);
