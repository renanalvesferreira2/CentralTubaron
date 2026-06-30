import {
  Bot,
  CalendarClock,
  CreditCard,
  Gauge,
  Headphones,
  MessageCircle,
  ReceiptText,
  Router,
  ShieldCheck,
  Sparkles,
  Wifi
} from 'lucide-react';
import { Card } from '../components/Card.jsx';
import { MetricCard } from '../components/MetricCard.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getDashboard } from '../services/customerService.js';

const serviceCards = [
  {
    icon: CreditCard,
    title: 'Resolver fatura',
    text: 'Segunda via, PIX, codigo de barras, pagamento em aberto e duvidas de cobranca.',
    tag: 'Financeiro'
  },
  {
    icon: Wifi,
    title: 'Internet lenta ou caindo',
    text: 'A central cruza status da conexao, sinal e perguntas rapidas antes de acionar a equipe.',
    tag: 'Diagnostico'
  },
  {
    icon: Router,
    title: 'Wi-Fi e equipamento',
    text: 'Alterar rede, conferir ONU, reiniciar equipamento e identificar problema de energia ou fibra.',
    tag: 'Casa conectada'
  },
  {
    icon: MessageCircle,
    title: 'Falar com a Tubaron',
    text: 'Quando precisar de humano, o atendimento ja chega com resumo e contexto da sua conta.',
    tag: 'WhatsApp'
  }
];

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
            A Tubaron organiza sua conta, faturas, internet e atendimento em um so lugar, com diagnostico antes de abrir chamado.
          </p>
          <div className="hero-actions">
            <span><Sparkles size={16} /> Proximo passo sugerido: {openInvoice ? 'conferir fatura aberta' : 'acompanhar sua conexao'}</span>
            <span><ShieldCheck size={16} /> Dados protegidos no backend</span>
          </div>
        </div>
        <div className="account-pulse">
          <strong>{data.summary.connectionStatus}</strong>
          <span>{data.customer.plan}</span>
          <small>Sinal {data.customer.connection.signal}</small>
          <StatusBadge>{data.customer.status}</StatusBadge>
        </div>
      </section>

      <div className="metrics">
        <MetricCard icon={Wifi} label="Internet" value={data.summary.connectionStatus} detail={data.customer.connection.signal} />
        <MetricCard icon={Gauge} label="Consumo" value={data.customer.connection.consumption} detail="Ciclo atual" />
        <MetricCard icon={CalendarClock} label="Vencimento" value={data.summary.nextDueDate || '-'} detail={data.summary.nextAmount ? `R$ ${data.summary.nextAmount}` : 'Sem valor aberto'} />
        <MetricCard icon={ReceiptText} label="Faturas" value={data.invoices.length} detail="Historico disponivel" />
      </div>

      <section className="service-grid wide">
        {serviceCards.map((item) => {
          const Icon = item.icon;
          return (
            <article className="service-card" key={item.title}>
              <div className="service-icon"><Icon size={21} /></div>
              <div>
                <span>{item.tag}</span>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
            </article>
          );
        })}
      </section>

      <Card className="wide intelligence-card">
        <div>
          <span className="eyebrow">Atendimento inteligente</span>
          <h2>Antes de encaminhar, a central entende o contexto.</h2>
          <p>Ela considera plano, fatura aberta, status da conexao e respostas do cliente para enviar um resumo melhor ao setor certo.</p>
        </div>
        <div className="intelligence-steps">
          <span>1. Identifica necessidade</span>
          <span>2. Faz perguntas certas</span>
          <span>3. Resume para atendimento</span>
        </div>
      </Card>

      <Card>
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

      <Card>
        <Bot size={22} />
        <h2>Assistente Tubaron</h2>
        <p>Pergunte sobre faturas, planos, Wi-Fi e testes basicos antes de falar com a equipe.</p>
      </Card>

      <Card>
        <Headphones size={22} />
        <h2>Atendimento humano</h2>
        <p>Quando for necessario, a central entrega o atendimento com resumo e contexto para reduzir retrabalho.</p>
      </Card>
    </div>
  );
}
