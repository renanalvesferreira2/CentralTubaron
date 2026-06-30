import { MessageCircle, Power, Router, Save, Signal, Wifi } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button.jsx';
import { Card } from '../components/Card.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { serviceFlows } from '../data/serviceFlows.js';
import { useAsync } from '../hooks/useAsync.js';
import { getPremiumSupport, rebootOnu, updateWifi } from '../services/supportService.js';

export function SupportPage() {
  const { data, loading, error, reload } = useAsync(getPremiumSupport, []);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  async function saveWifi(event) {
    event.preventDefault();
    setMessage('');
    setActionLoading(true);

    try {
      await updateWifi({ ssid, password });
      setMessage('Wi-Fi atualizado com seguranca. Pode levar alguns minutos para refletir na ONU.');
      setPassword('');
      await reload();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function restart() {
    setMessage('');
    setActionLoading(true);

    try {
      await rebootOnu();
      setMessage('Reinicializacao solicitada. A conexao pode oscilar por alguns minutos.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <Skeleton rows={5} />;
  if (error) return <Card><strong>{error}</strong></Card>;

  const onu = data.onu;

  return (
    <div className="stack">
      <div className="page-heading">
        <h1>Atendimento inteligente</h1>
        <p>Escolha uma necessidade. A central organiza perguntas, dados da conta e diagnostico antes de enviar ao setor certo.</p>
      </div>

      <section className="service-grid">
        {serviceFlows.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <article className="service-card" key={item.title}>
              <div className="service-icon"><Icon size={21} /></div>
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </article>
          );
        })}
      </section>

      <Card className="intelligence-card">
        <div>
          <span className="eyebrow">Diagnostico automatico</span>
          <h2>Sua conexao esta sendo analisada antes do chamado.</h2>
          <p>Quando o atendimento humano for necessario, a equipe recebe sinal, status da ONU e resumo do problema.</p>
        </div>
        <div className="intelligence-steps">
          <span><MessageCircle size={16} /> Perguntas guiadas</span>
          <span><Signal size={16} /> Sinal da ONU</span>
          <span><Router size={16} /> Equipamento</span>
        </div>
      </Card>

      <div className="metrics">
        <Card className="metric-card"><Router /> <div><span>ONU</span><strong>{onu.serial}</strong><small>{onu.uptime}</small></div></Card>
        <Card className="metric-card"><Signal /> <div><span>Sinal</span><strong>{onu.signal}</strong><small>Potencia optica</small></div></Card>
        <Card className="metric-card"><Wifi /> <div><span>Wi-Fi</span><strong>{onu.wifi.ssid}</strong><small>{onu.wifi.band}</small></div></Card>
        <Card className="metric-card"><Power /> <div><span>Status</span><strong>{onu.status}</strong><small>Monitorado</small></div></Card>
      </div>

      <Card>
        <div className="section-title">
          <h2>Checklist da central</h2>
          <StatusBadge>{onu.status}</StatusBadge>
        </div>
        <div className="compact-list">
          {data.checks.map((check) => (
            <div key={check.label}>
              <strong>{check.label}</strong>
              <StatusBadge tone={check.status === 'ok' ? 'ok' : 'warning'}>{check.status === 'ok' ? 'Normal' : 'Atencao'}</StatusBadge>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="section-title"><h2>Acoes seguras no equipamento</h2></div>
        <form className="form-grid" onSubmit={saveWifi}>
          <label>Nome da rede<input value={ssid} onChange={(event) => setSsid(event.target.value)} placeholder={onu.wifi.ssid} required /></label>
          <label>Nova senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimo 8 caracteres" minLength={8} required /></label>
          <Button disabled={actionLoading}><Save size={17} /> Salvar Wi-Fi</Button>
        </form>
        <div className="action-row">
          <Button variant="secondary" onClick={restart} disabled={actionLoading}><Power size={17} /> Reiniciar ONU</Button>
          {message && <span className="success-text">{message}</span>}
        </div>
      </Card>
    </div>
  );
}
