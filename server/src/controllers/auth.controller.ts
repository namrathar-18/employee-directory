import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { env } from '../config/env';

const SALT_ROUNDS = 12;
const TOKEN_TTL = '7d';

// ── Validation schemas ────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function signToken(userId: string, email: string, name: string) {
  return jwt.sign({ sub: userId, email, name }, env.jwtSecret, {
    expiresIn: TOKEN_TTL,
  });
}

// ── Controllers ───────────────────────────────────────────────────────────────

export const register: RequestHandler = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' });
    return;
  }

  const { name, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken(String(user._id), email, name);
  res.status(201).json({ token, user: { id: String(user._id), name, email } });
};

export const login: RequestHandler = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' });
    return;
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    // Same message for both "not found" and "wrong password" to avoid email enumeration
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const name = user.name;
  const token = signToken(String(user._id), email, name);
  res.json({ token, user: { id: String(user._id), name, email } });
};
