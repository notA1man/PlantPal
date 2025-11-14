import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = new User({ username, email, password });
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const bcrypt = await import('bcryptjs');
  const isValid = await bcrypt.default.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
});

export default router;

