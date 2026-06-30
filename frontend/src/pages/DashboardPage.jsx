import {
  CalendarClock,
  MessageCircle,
  ReceiptText,
  Sparkles,
  Wifi
} from 'lucide-react';
import { Card } from '../components/Card.jsx';
import { MetricCard } from '../components/MetricCard.jsx';
import { SmartServiceCenter } from '../components/SmartServiceCenter.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getDashboard } from '../services/customerService.js';

export function DashboardPage() {
  const { data, loading, error } = useAsync(getDashboard, []);

  if (loading) return <Skeleton rows={6} />;
  if (error) return <Card><strong>{error}</strong></Card>;

  const openInvoice = data.invoices.find((invoice) => invoice.status !== 'Paga');

  return (
    <div className="page-grid">
      <section className="smart-hero">
        <div>
          <span className="eyebrow">Central do assinante inteligente</span>
          <h1>O que voce precisa resolver hoje?</h1>
          <p>
            A Tubaron organiza sua conta, faturas, internet e atendimento em um so lugar.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#central-guiada"><Sparkles size={18} /> {openInvoice ? 'Conferir fatura aberta' : 'Ver minha conexao'}</a>
            <a className="secondary-action" href="#central-guiada"><MessageCircle size={18} /> Iniciar atendimento</a>
          </div>
        </div>
        <div className="account-pulse">
          <strong>{data.summary.connectionStatus}</strong>
          <span>{data.customer.plan}</span>
          <small>Sinal {data.customer.connection.signal}</small>
          <StatusBadge>{data.customer.status}</StatusBadge>
        </div>
      </section>

      <div className="metrics compact-metrics">
        <MetricCard icon={Wifi} label="Internet" value={data.summary.connectionStatus} detail={data.customer.connection.signal} />
        <MetricCard icon={CalendarClock} label="Vencimento" value={data.summary.nextDueDate || '-'} detail={data.summary.nextAmount ? `R$ ${data.summary.nextAmount}` : 'Sem valor aberto'} />
        <MetricCard icon={ReceiptText} label="Faturas" value={data.invoices.length} detail="Historico disponivel" />
      </div>

      <Card className="wide intelligence-card clean-intelligence">
        <div>
          <span className="eyebrow">Atendimento inteligente</span>
          <h2>A central entende o contexto antes de encaminhar.</h2>
          <p>Quando precisar de atendimento humano, a equipe recebe status da conta, fatura aberta e diagnostico basico.</p>
        </div>
        <div className="intelligence-steps">
          <span>1. Identifica</span>
          <span>2. Pergunta</span>
          <span>3. Resume</span>
        </div>
      </Card>

      <SmartServiceCenter account={data} />

      <Card className="wide">
        <div className="section-title">
          <h2>Avisos importantes</h2>
          <span>Atualizado agora</span>
        </div>
        <div className="notice-list">
          {data.notices.length ? data.notices.map((notice) => (
            <article key={notice.id}>
              <strong>{notice.title}</strong>
              <p>{notice.message}</p>
            </article>
          )) : (
            <article>
              <strong>Tudo certo por aqui</strong>
              <p>Nao ha avisos criticos para sua conta neste momento.</p>
            </article>
          )}
        </div>
      </Card>
    </div>
  );
}
