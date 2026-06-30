import { verifyToken } from '../services/tokenService.js';
import { AppError } from '../utils/AppError.js';

const allowedRoles = new Set(['customer', 'admin']);

export function authenticate(req, _res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Sessao invalida ou expirada.', 401);
  }

  try {
    const user = verifyToken(header.slice(7));

    if (!user?.sub || !allowedRoles.has(user.role)) {
      throw new Error('Invalid token payload');
    }

    req.user = user;
    next();
  } catch {
    throw new AppError('Sessao invalida ou expirada.', 401);
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new AppError('Voce nao tem permissao para acessar este recurso.', 403);
    }

    next();
  };
}
