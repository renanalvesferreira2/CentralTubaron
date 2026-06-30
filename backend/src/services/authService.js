import { z } from 'zod';
import { authenticateCustomer } from '../integrations/ixc/ixcClient.js';
import { findAdminByEmail } from '../repositories/adminRepository.js';
import { createAuditLog } from '../repositories/auditRepository.js';
import { AppError } from '../utils/AppError.js';
import { comparePassword } from '../utils/password.js';
import { signToken } from './tokenService.js';

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().trim().min(3).max(120),
    password: z.string().min(4).max(128)
  }).strict()
});

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(160),
    password: z.string().min(8).max(128)
  }).strict()
});

export async function loginCustomer({ identifier, password }) {
  const customer = await authenticateCustomer(identifier, password);

  if (!customer?.id) {
    throw new AppError('Nao encontramos seus dados. Verifique as informacoes digitadas.', 401);
  }

  await createAuditLog({
    actorId: customer.id,
    actorType: 'customer',
    action: 'customer.login',
    metadata: { identifierType: identifier.includes('@') ? 'email' : 'document_or_login' }
  });

  const token = signToken({ sub: customer.id, role: 'customer', name: customer.name });
  return { token, customer };
}

export async function loginAdmin({ email, password }) {
  const normalizedEmail = email.toLowerCase();
  const admin = await findAdminByEmail(normalizedEmail);
  const valid = admin ? await comparePassword(password, admin.password_hash) : false;

  if (!valid) {
    throw new AppError('Credenciais administrativas invalidas.', 401);
  }

  await createAuditLog({
    actorId: admin.id,
    actorType: 'admin',
    action: 'admin.login',
    metadata: { email: normalizedEmail }
  });

  const token = signToken({ sub: admin.id, role: admin.role, name: admin.name });
  return {
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
  };
}
