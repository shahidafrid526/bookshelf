import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from "../models/Users.js"

const router = express.Router();

// User registration route
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await UserModel.findOne({ username });
  
      if (user) {
        return res.json({ message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new UserModel({ username, password: hashedPassword });
      await newUser.save();
  
      res.json({ message: "User Registered Successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

// User login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
  
    if (!user) {
      return res.status(401).json({ message: "Username or Password is Incorrect" });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Username or Password is Incorrect" });
    }
  
    const token = jwt.sign({ id: user._id }, "secret");
    res.json({ token, userID: user._id });
  });
  
  router.get("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await UserModel.findById(userId);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

export { router as userRouter };
