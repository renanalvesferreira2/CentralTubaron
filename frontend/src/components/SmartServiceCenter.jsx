import { useMemo, useState } from 'react';
import { Button } from './Button.jsx';
import { defaultFlowId, serviceFlows, summaryIcon as SummaryIcon } from '../data/serviceFlows.js';

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '555195624380';

function buildSummary({ flow, answers, note, account }) {
  const answerLines = flow.questions.map((question) => {
    const values = answers[question.id] || [];
    return `- ${question.label}: ${values.length ? values.join(', ') : 'Nao informado'}`;
  });

  return [
    'CENTRAL DO ASSINANTE TUBARON',
    '',
    `Assunto: ${flow.title}`,
    `Setor: ${flow.tag}`,
    '',
    `Cliente: ${account.customer?.name || 'Nao informado'}`,
    `Plano: ${account.customer?.plan || 'Nao informado'}`,
    `Status da conexao: ${account.summary?.connectionStatus || 'Nao informado'}`,
    `Sinal: ${account.customer?.connection?.signal || 'Nao informado'}`,
    `Proximo vencimento: ${account.summary?.nextDueDate || 'Sem fatura aberta'}`,
    '',
    'Respostas:',
    ...answerLines,
    '',
    `Observacao: ${note.trim() || 'Sem observacao adicional.'}`,
    '',
    `Orientacao da central: ${flow.recommendation}`
  ].join('\n');
}

export function SmartServiceCenter({ account }) {
  const [flowId, setFlowId] = useState(defaultFlowId);
  const [answers, setAnswers] = useState({});
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const flow = serviceFlows.find((item) => item.id === flowId) || serviceFlows[0];
  const Summary = SummaryIcon;

  const summary = useMemo(() => buildSummary({ flow, answers, note, account }), [account, answers, flow, note]);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}`;

  function selectFlow(nextFlowId) {
    setFlowId(nextFlowId);
    setAnswers({});
    setNote('');
    setCopied(false);
  }

  function toggleAnswer(questionId, option) {
    setCopied(false);
    setAnswers((current) => {
      const selected = new Set(current[questionId] || []);

      if (selected.has(option)) {
        selected.delete(option);
      } else {
        selected.add(option);
      }

      return { ...current, [questionId]: [...selected] };
    });
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="smart-center wide" id="central-guiada">
      <div className="section-title">
        <div>
          <span className="eyebrow">Central guiada</span>
          <h2>Escolha o que quer resolver</h2>
        </div>
        <span>Triagem com contexto da conta</span>
      </div>

      <div className="smart-center-grid">
        <div className="flow-list">
          {serviceFlows.map((item) => {
            const Icon = item.icon;
            return (
              <button className={item.id === flow.id ? 'active' : ''} key={item.id} onClick={() => selectFlow(item.id)}>
                <Icon size={19} />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.tag}</small>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flow-detail">
          <div className="flow-header">
            <span>{flow.tag}</span>
            <h3>{flow.title}</h3>
            <p>{flow.description}</p>
          </div>

          <div className="question-stack">
            {flow.questions.map((question) => (
              <fieldset key={question.id}>
                <legend>{question.label}</legend>
                <div className="answer-grid">
                  {question.options.map((option) => {
                    const checked = (answers[question.id] || []).includes(option);
                    return (
                      <label className={checked ? 'checked' : ''} key={option}>
                        <input
                          checked={checked}
                          onChange={() => toggleAnswer(question.id, option)}
                          type="checkbox"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <label>
            Observacao para o atendimento
            <textarea
              maxLength={600}
              onChange={(event) => {
                setCopied(false);
                setNote(event.target.value);
              }}
              placeholder="Ex.: acontece mais a noite, TV fica longe do roteador, ja reiniciei o equipamento..."
              value={note}
            />
          </label>

          <div className="central-recommendation">
            <strong>Orientacao inteligente</strong>
            <p>{flow.recommendation}</p>
          </div>

          <div className="summary-actions">
            <Button onClick={copySummary} variant="secondary">
              <Summary size={17} /> {copied ? 'Resumo copiado' : 'Copiar resumo'}
            </Button>
            <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              <Summary size={17} /> Enviar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
