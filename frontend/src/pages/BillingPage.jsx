import { Copy, FileText } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../components/Card.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getDashboard } from '../services/customerService.js';

export function BillingPage() {
  const { data, loading, error } = useAsync(getDashboard, []);
  const [copiedInvoice, setCopiedInvoice] = useState('');

  async function copyPix(invoice) {
    if (!invoice.pix) return;
    await navigator.clipboard.writeText(invoice.pix);
    setCopiedInvoice(invoice.id);
  }

  if (loading) return <Skeleton rows={5} />;
  if (error) return <Card><strong>{error}</strong></Card>;

  return (
    <div className="stack">
      <div className="page-heading">
        <h1>Faturas e contratos</h1>
        <p>Segunda via, PIX, codigo de barras e historico financeiro em um so lugar.</p>
      </div>

      <Card>
        <div className="table-list">
          {data.invoices.map((invoice) => (
            <article key={invoice.id}>
              <FileText size={20} />
              <div>
                <strong>Vencimento {invoice.dueDate}</strong>
                <span>R$ {invoice.amount?.toFixed(2) || '129.90'}</span>
              </div>
              <StatusBadge tone={invoice.status === 'Paga' ? 'ok' : 'warning'}>{invoice.status}</StatusBadge>
              {invoice.pix && (
                <button title="Copiar PIX" aria-label="Copiar PIX" onClick={() => copyPix(invoice)}>
                  <Copy size={17} />
                  <span>{copiedInvoice === invoice.id ? 'Copiado' : 'PIX'}</span>
                </button>
              )}
            </article>
          ))}
        </div>
      </Card>

      <Card>
        <div className="section-title"><h2>Contratos</h2></div>
        <div className="compact-list">
          {data.contracts.map((contract) => (
            <div key={contract.id}>
              <strong>{contract.plan}</strong>
              <span>{contract.status} desde {contract.startDate}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
