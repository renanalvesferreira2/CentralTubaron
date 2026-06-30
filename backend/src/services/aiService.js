import { z } from 'zod';
import { askGemini } from '../integrations/gemini/geminiClient.js';
import { saveAiInteraction } from '../repositories/aiRepository.js';

export const askAiSchema = z.object({
  body: z.object({
    prompt: z.string().min(4).max(1200)
  })
});

export async function answerCustomerQuestion({ customerId, prompt, context }) {
  const answer = await askGemini(prompt, context);
  await saveAiInteraction({ customerId, prompt, answer });
  return { answer };
}
