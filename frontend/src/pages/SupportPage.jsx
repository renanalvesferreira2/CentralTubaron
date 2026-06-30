import { Power, Router, Save, Signal, Wifi } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button.jsx';
import { Card } from '../components/Card.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getPremiumSupport, rebootOnu, updateWifi } from '../services/supportService.js';

export function SupportPage() {
  const { data, loading, error, reload } = useAsync(getPremiumSupport, []);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function saveWifi(event) {
    event.preventDefault();
    setMessage('');
    await updateWifi({ ssid, password });
    setMessage('Wi-Fi atualizado com segurança. Pode levar alguns minutos para refletir na ONU.');
    reload();
  }

  async function restart() {
    await rebootOnu();
    setMessage('Reinicialização solicitada. A conexão pode oscilar por alguns minutos.');
  }

  if (loading) return <Skeleton rows={5} />;
  if (error) return <Card><strong>{error}</strong></Card>;

  const onu = data.onu;

  return (
    <div className="stack">
      <div className="page-heading">
        <h1>Suporte Premium</h1>
        <p>Controles sensíveis passam exclusivamente pelo backend, com auditoria e permissões.</p>
      </div>

      <div className="metrics">
        <Card className="metric-card"><Router /> <div><span>ONU</span><strong>{onu.serial}</strong><small>{onu.uptime}</small></div></Card>
        <Card className="metric-card"><Signal /> <div><span>Sinal</span><strong>{onu.signal}</strong><small>Potência óptica</small></div></Card>
        <Card className="metric-card"><Wifi /> <div><span>Wi-Fi</span><strong>{onu.wifi.ssid}</strong><small>{onu.wifi.band}</small></div></Card>
        <Card className="metric-card"><Power /> <div><span>Status</span><strong>{onu.status}</strong><small>Monitorado</small></div></Card>
      </div>

      <Card>
        <div className="section-title">
          <h2>Diagnóstico rápido</h2>
          <StatusBadge>{onu.status}</StatusBadge>
        </div>
        <div className="compact-list">
          {data.checks.map((check) => (
            <div key={check.label}>
              <strong>{check.label}</strong>
              <StatusBadge tone={check.status === 'ok' ? 'ok' : 'warning'}>{check.status === 'ok' ? 'Normal' : 'Atenção'}</StatusBadge>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="section-title"><h2>Alterar Wi-Fi</h2></div>
        <form className="form-grid" onSubmit={saveWifi}>
          <label>Nome da rede<input value={ssid} onChange={(event) => setSsid(event.target.value)} placeholder={onu.wifi.ssid} /></label>
          <label>Nova senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo 8 caracteres" /></label>
          <Button><Save size={17} /> Salvar Wi-Fi</Button>
        </form>
        <div className="action-row">
          <Button variant="secondary" onClick={restart}><Power size={17} /> Reiniciar ONU</Button>
          {message && <span className="success-text">{message}</span>}
        </div>
      </Card>
    </div>
  );
}
