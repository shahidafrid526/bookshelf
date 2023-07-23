// models/Books.js

import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageLink: { type: String, required: false },
  authors: [{ type: String, required: false }],
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
});

export const BookModel = mongoose.model('Book', BookSchema);