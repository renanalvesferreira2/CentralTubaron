import { z } from 'zod';
import { askGemini } from '../integrations/gemini/geminiClient.js';
import { saveAiInteraction } from '../repositories/aiRepository.js';

export const askAiSchema = z.object({
  body: z.object({
    prompt: z.string().trim().min(4).max(1200)
  })
});

function buildSafeContext(context) {
  const openInvoices = (context.invoices || [])
    .filter((invoice) => invoice.status !== 'Paga')
    .slice(0, 3)
    .map((invoice) => ({
      dueDate: invoice.dueDate,
      amount: invoice.amount,
      status: invoice.status
    }));

  return {
    customer: {
      status: context.customer?.status,
      plan: context.customer?.plan,
      connection: {
        online: Boolean(context.customer?.connection?.online),
        signal: context.customer?.connection?.signal
      }
    },
    contracts: (context.contracts || []).map((contract) => ({
      plan: contract.plan,
      status: contract.status
    })),
    openInvoices,
    notices: (context.notices || []).map((notice) => ({
      title: notice.title,
      severity: notice.severity
    }))
  };
}

export async function answerCustomerQuestion({ customerId, prompt, context }) {
  const answer = await askGemini(prompt, buildSafeContext(context));
  await saveAiInteraction({ customerId, prompt, answer });
  return { answer };
}
