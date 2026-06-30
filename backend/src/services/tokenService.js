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
