import { findActiveSession } from '../repositories/sessionRepository.js';
import { hashToken, verifyToken } from '../services/tokenService.js';
import { AppError } from '../utils/AppError.js';

const allowedRoles = new Set(['customer', 'admin']);

export async function authenticate(req, _res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    next(new AppError('Sessao invalida ou expirada.', 401));
    return;
  }

  const token = header.slice(7);

  try {
    const user = verifyToken(token);

    if (!user?.sub || !allowedRoles.has(user.role)) {
      throw new Error('Invalid token payload');
    }

    const session = await findActiveSession(hashToken(token));

    if (!session) {
      throw new Error('Inactive session');
    }

    req.token = token;
    req.user = user;
    next();
  } catch {
    next(new AppError('Sessao invalida ou expirada.', 401));
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
