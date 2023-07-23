// Importing required modules
import mongoose from "mongoose";

// Defining the UserSchema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    savedBooks: [{type: mongoose.Schema.Types.ObjectId, ref: "book"}]
});

// Creating the UserModel
export const UserModel = mongoose.model("users", UserSchema);