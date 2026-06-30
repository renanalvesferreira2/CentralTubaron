import { z } from 'zod';
import { authenticateCustomer } from '../integrations/ixc/ixcClient.js';
import { findAdminByEmail } from '../repositories/adminRepository.js';
import { createAuditLog } from '../repositories/auditRepository.js';
import { AppError } from '../utils/AppError.js';
import { comparePassword } from '../utils/password.js';
import { signToken } from './tokenService.js';

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(3),
    password: z.string().min(4)
  })
});

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
});

export async function loginCustomer({ identifier, password }) {
  const customer = await authenticateCustomer(identifier, password);

  if (!customer?.id) {
    throw new AppError('Não encontramos seus dados. Verifique as informações digitadas.', 401);
  }

  await createAuditLog({
    actorId: customer.id,
    actorType: 'customer',
    action: 'customer.login',
    metadata: { identifier }
  });

  const token = signToken({ sub: customer.id, role: 'customer', name: customer.name });
  return { token, customer };
}

export async function loginAdmin({ email, password }) {
  const admin = await findAdminByEmail(email.toLowerCase());
  const valid = admin ? await comparePassword(password, admin.password_hash) : false;

  if (!valid) {
    throw new AppError('Credenciais administrativas inválidas.', 401);
  }

  await createAuditLog({
    actorId: admin.id,
    actorType: 'admin',
    action: 'admin.login',
    metadata: { email }
  });

  const token = signToken({ sub: admin.id, role: admin.role, name: admin.name });
  return {
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
  };
}
