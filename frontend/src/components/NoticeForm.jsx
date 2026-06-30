import { Megaphone } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button.jsx';

export function NoticeForm({ onSubmit }) {
  const [notice, setNotice] = useState({ title: '', message: '', severity: 'info' });
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  function updateNotice(field, value) {
    setNotice((current) => ({ ...current, [field]: value }));
  }

  async function submitNotice(event) {
    event.preventDefault();
    setFeedback('');
    setSaving(true);

    try {
      await onSubmit(notice);
      setNotice({ title: '', message: '', severity: 'info' });
      setFeedback('Aviso publicado com sucesso.');
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="section-title">
        <h2>Aviso aos assinantes</h2>
        <Megaphone size={20} />
      </div>
      <form className="notice-form" onSubmit={submitNotice}>
        <label>
          Titulo
          <input value={notice.title} onChange={(event) => updateNotice('title', event.target.value)} maxLength={160} required />
        </label>
        <label>
          Mensagem
          <textarea value={notice.message} onChange={(event) => updateNotice('message', event.target.value)} maxLength={1000} required />
        </label>
        <label>
          Severidade
          <select value={notice.severity} onChange={(event) => updateNotice('severity', event.target.value)}>
            <option value="info">Info</option>
            <option value="warning">Atencao</option>
            <option value="critical">Critico</option>
          </select>
        </label>
        <Button disabled={saving}>Publicar aviso</Button>
      </form>
      {feedback && <span className="success-text">{feedback}</span>}
    </>
  );
}
