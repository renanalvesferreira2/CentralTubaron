import { Activity, AlertTriangle, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Card } from '../components/Card.jsx';
import { MetricCard } from '../components/MetricCard.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getAdminOverview } from '../services/adminService.js';

export function AdminPage() {
  const { data, loading, error } = useAsync(getAdminOverview, []);

  if (loading) return <Skeleton rows={4} />;

  if (error) {
    return (
      <Card>
        <LockKeyhole size={28} />
        <h2>Painel administrativo protegido</h2>
        <p>{error}</p>
        <p>Em producao, este modulo exige RBAC administrativo e esta preparado para futura autenticacao em dois fatores.</p>
      </Card>
    );
  }

  return (
    <div className="stack">
      <div className="page-heading">
        <h1>Painel administrativo</h1>
        <p>Operacao, auditoria, integracoes e indicadores essenciais para a equipe Tubaron.</p>
      </div>

      <div className="metrics">
        <MetricCard icon={Activity} label="Clientes online" value={data.metrics.connectedCustomers} detail="Agora" />
        <MetricCard icon={AlertTriangle} label="Chamados abertos" value={data.metrics.openTickets} detail="Fila ativa" />
        <MetricCard icon={ShieldCheck} label="Retencao IA" value={data.metrics.aiDeflectionRate} detail="Sem chamado" />
        <MetricCard icon={LockKeyhole} label="Erros 24h" value={data.metrics.errors24h} detail="Monitorado" />
      </div>

      <Card>
        <div className="section-title"><h2>Integracoes criticas</h2></div>
        <div className="table-list">
          {data.integrations.map((integration) => (
            <article key={integration.name}>
              <ShieldCheck size={20} />
              <div>
                <strong>{integration.name}</strong>
                <span>Latencia media {integration.latency}</span>
              </div>
              <StatusBadge>{integration.status}</StatusBadge>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
