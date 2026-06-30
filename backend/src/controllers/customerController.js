import { getDashboard } from '../services/customerService.js';

export async function dashboard(req, res) {
  const data = await getDashboard(req.user.sub);
  res.json(data);
}
