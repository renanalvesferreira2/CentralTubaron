import { loginAdmin, loginCustomer } from '../services/authService.js';
import { logoutSession } from '../services/sessionService.js';

export async function login(req, res) {
  const { identifier, password } = req.validated.body;
  const result = await loginCustomer({ identifier, password });
  res.json(result);
}

export async function adminLogin(req, res) {
  const result = await loginAdmin(req.validated.body);
  res.json(result);
}

export async function logout(req, res) {
  res.json(await logoutSession(req.token));
}
