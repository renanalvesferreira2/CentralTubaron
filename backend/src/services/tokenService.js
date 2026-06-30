import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const tokenOptions = {
  audience: 'central-tubaron',
  issuer: 'central-tubaron-api'
};

export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, {
    ...tokenOptions,
    expiresIn: env.jwtExpiresIn
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret, tokenOptions);
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function getTokenExpiresAt(token) {
  const decoded = jwt.decode(token);

  if (!decoded?.exp) {
    return new Date(Date.now() + 2 * 60 * 60 * 1000);
  }

  return new Date(decoded.exp * 1000);
}
