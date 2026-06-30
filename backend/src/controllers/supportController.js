import { changeWifi, getPremiumSupport, registerSupportRequest, restartOnu } from '../services/supportService.js';

export async function premium(req, res) {
  res.json(await getPremiumSupport(req.user.sub));
}

export async function updateWifi(req, res) {
  res.json(await changeWifi(req.user.sub, req.validated.body));
}

export async function reboot(req, res) {
  res.json(await restartOnu(req.user.sub));
}

export async function createRequest(req, res) {
  res.status(201).json(await registerSupportRequest(req.user.sub, req.validated.body));
}
