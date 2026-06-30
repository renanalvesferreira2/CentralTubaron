import { answerCustomerQuestion } from '../services/aiService.js';
import { getDashboard } from '../services/customerService.js';

export async function ask(req, res) {
  const context = await getDashboard(req.user.sub);
  const result = await answerCustomerQuestion({
    customerId: req.user.sub,
    prompt: req.validated.body.prompt,
    context
  });
  res.json(result);
}
