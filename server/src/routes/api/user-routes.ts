// server/src/routes/api/user-routes.ts
import express from 'express';
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} from '../../controllers/user-controller.js';
import { authenticateToken } from '../../services/auth.js';

const router = express.Router();

// Sign up a new user
router.post('/', createUser);

// Save a book (requires auth)
router.put('/', authenticateToken, saveBook);

// Login an existing user
router.post('/login', login);

// Get the authenticated user’s profile
router.get('/me', authenticateToken, getSingleUser);

// Delete a saved book
router.delete('/books/:bookId', authenticateToken, deleteBook);

export default router;
