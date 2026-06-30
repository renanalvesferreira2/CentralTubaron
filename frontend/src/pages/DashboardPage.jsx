import { Bot, CalendarClock, Gauge, Headphones, ReceiptText, Wifi } from 'lucide-react';
import { Card } from '../components/Card.jsx';
import { MetricCard } from '../components/MetricCard.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getDashboard } from '../services/customerService.js';

export function DashboardPage() {
  const { data, loading, error } = useAsync(getDashboard, []);

  if (loading) return <Skeleton rows={6} />;
  if (error) return <Card><strong>{error}</strong></Card>;

  return (
    <div className="page-grid">
      <section className="hero-band">
        <div>
          <span className="eyebrow">Resumo da conta</span>
          <h1>{data.customer.plan}</h1>
          <p>Conexão {data.summary.connectionStatus.toLowerCase()}, próximo vencimento em {data.summary.nextDueDate}.</p>
        </div>
        <StatusBadge>{data.customer.status}</StatusBadge>
      </section>

      <div className="metrics">
        <MetricCard icon={Wifi} label="Internet" value={data.summary.connectionStatus} detail={data.customer.connection.signal} />
        <MetricCard icon={Gauge} label="Consumo" value={data.customer.connection.consumption} detail="Ciclo atual" />
        <MetricCard icon={CalendarClock} label="Vencimento" value={data.summary.nextDueDate} detail={`R$ ${data.summary.nextAmount}`} />
        <MetricCard icon={ReceiptText} label="Faturas" value={data.invoices.length} detail="Histórico disponível" />
      </div>

      <Card className="wide">
        <div className="section-title">
          <h2>Avisos e próximos passos</h2>
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
              <p>Não há avisos críticos para sua conta neste momento.</p>
            </article>
          )}
        </div>
      </Card>

      <Card>
        <Headphones size={22} />
        <h2>Suporte Premium</h2>
        <p>Gerencie Wi-Fi, acompanhe sinal da ONU e reinicie equipamentos com segurança pelo backend.</p>
      </Card>

      <Card>
        <Bot size={22} />
        <h2>Assistente IA</h2>
        <p>Receba explicações claras sobre faturas, planos, Wi-Fi e testes antes de abrir um chamado.</p>
      </Card>
    </div>
  );
}
