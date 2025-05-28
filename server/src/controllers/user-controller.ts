// server/src/controllers/user-controller.ts
import type { Request, Response } from 'express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

// Create a new user and issue a token
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = signToken(user);
    res.json({ token, user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Log in an existing user and issue a token
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'No user found with this email' });
      return;
    }
    const valid = await user.isCorrectPassword(password);
    if (!valid) {
      res.status(401).json({ message: 'Incorrect password' });
      return;
    }
    const token = signToken(user);
    res.json({ token, user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single user by their ID (from token) or username (param)
export const getSingleUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id || req.params.id;
    const username = req.params.username;
    const foundUser = await User.findOne({
      $or: [{ _id: userId }, { username }],
    });
    if (!foundUser) {
      res.status(400).json({ message: 'Cannot find a user with this id!' });
      return;
    }
    res.json(foundUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Save a book to the logged-in user’s savedBooks
export const saveBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const bookData = req.body; // expects { bookId, authors, description, title, image, link }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedBooks: bookData } },
      { new: true }
    );
    if (!updatedUser) {
      res.status(404).json({ message: 'Could not find user to save book.' });
      return;
    }
    res.json(updatedUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Remove a book from the logged-in user’s savedBooks
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { bookId } = req.params;
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { savedBooks: { bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      res.status(404).json({ message: "Couldn't find user with this id!" });
      return;
    }
    res.json(updatedUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
