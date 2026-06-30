import { changeWifi, getPremiumSupport, restartOnu } from '../services/supportService.js';

export async function premium(req, res) {
  res.json(await getPremiumSupport(req.user.sub));
}

export async function updateWifi(req, res) {
  res.json(await changeWifi(req.user.sub, req.validated.body));
}

export async function reboot(req, res) {
  res.json(await restartOnu(req.user.sub));
}
