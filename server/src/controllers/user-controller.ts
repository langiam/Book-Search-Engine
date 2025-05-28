// server/src/controllers/user-controller.ts
import type { Request, Response } from 'express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { getUserFromToken } from '../utils/auth.js';

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

export const loginUser = async (req: Request, res: Response): Promise<void> => {
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

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = getUserFromToken(req);
    if (!payload) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const user = await User.findById(payload._id);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
