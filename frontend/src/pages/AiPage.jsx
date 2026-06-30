import { Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button.jsx';
import { Card } from '../components/Card.jsx';
import { askAi } from '../services/aiService.js';

const suggestions = [
  'Explique minha proxima fatura',
  'Qual a diferenca entre Wi-Fi 2.4 GHz e 5 GHz?',
  'Minha internet esta lenta, o que posso testar?'
];

export function AiPage() {
  const [prompt, setPrompt] = useState(suggestions[0]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const question = prompt.trim();
    if (!question || loading) return;

    setLoading(true);
    setMessages((current) => [...current, { type: 'user', text: question }]);
    setPrompt('');

    try {
      const response = await askAi(question);
      setMessages((current) => [...current, { type: 'ai', text: response.answer }]);
    } catch (error) {
      setMessages((current) => [...current, { type: 'ai', text: error.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="stack">
      <div className="page-heading">
        <h1>Assistente inteligente</h1>
        <p>Orientacao objetiva antes da abertura de chamados, sempre com encaminhamento humano quando necessario.</p>
      </div>
      <Card className="chat-card">
        <div className="suggestions">
          {suggestions.map((item) => <button key={item} onClick={() => setPrompt(item)}>{item}</button>)}
        </div>
        <div className="messages">
          {messages.map((message, index) => (
            <div className={`message ${message.type}`} key={`${message.type}-${index}`}>{message.text}</div>
          ))}
          {!messages.length && <div className="message ai">Ola! Posso ajudar com faturas, planos, Wi-Fi e testes basicos.</div>}
        </div>
        <form className="chat-form" onSubmit={submit}>
          <input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Digite sua duvida..." maxLength={1200} />
          <Button disabled={loading || !prompt.trim()}><Send size={17} /> {loading ? 'Enviando' : 'Enviar'}</Button>
        </form>
      </Card>
    </div>
  );
}
