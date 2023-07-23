import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  bookDescription: {
    type: String,
    required: true,
  },
});


export const CommentModel = mongoose.model('Comment', commentSchema);