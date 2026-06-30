import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env.js';

const SYSTEM_CONTEXT = `
Você é a assistente da Central do Assinante Tubaron.
Responda em português brasileiro, com clareza e acolhimento.
Ajude com faturas, planos, Wi-Fi, testes básicos e dúvidas frequentes.
Nunca substitua atendimento humano; quando houver risco, urgência ou limitação técnica, oriente contato com a equipe.
`;

export async function askGemini(prompt, context = {}) {
  if (env.gemini.useMock || !env.gemini.apiKey) {
    return 'Analisei sua solicitação com base nos dados disponíveis. Para faturas, confira vencimento, valor e status; para Wi-Fi, teste reiniciar o roteador e verificar se está conectado em 5 GHz quando estiver perto do equipamento. Se o problema continuar, nossa equipe pode assumir o atendimento.';
  }

  const genAI = new GoogleGenerativeAI(env.gemini.apiKey);
  const model = genAI.getGenerativeModel({ model: env.gemini.model });
  const result = await model.generateContent([
    SYSTEM_CONTEXT,
    `Contexto do cliente: ${JSON.stringify(context)}`,
    `Pergunta: ${prompt}`
  ]);

  return result.response.text();
}
