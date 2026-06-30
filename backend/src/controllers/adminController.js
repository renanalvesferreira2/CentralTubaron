import { getAdminOverview, publishNotice } from '../services/adminService.js';

export async function overview(_req, res) {
  res.json(await getAdminOverview());
}

export async function createNotice(req, res) {
  res.status(201).json(await publishNotice(req.validated.body, req.user));
}
