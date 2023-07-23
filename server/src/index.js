import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {userRouter} from './routes/users.js';
import { bookRouter } from './routes/books.js';
import { commentsRouter } from './routes/comment.js';
import { finishedBookRouter } from './routes/finishedBooks.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/add", bookRouter);
app.use("/comment", commentsRouter);
app.use("/fn", finishedBookRouter);

mongoose.connect("mongodb+srv://shahidafrid526:BookShelf123@cluster0.zygbpfs.mongodb.net/Cluster0?retryWrites=true&w=majority")

app.listen(3001, ()=>console.log("Server Started"));    

