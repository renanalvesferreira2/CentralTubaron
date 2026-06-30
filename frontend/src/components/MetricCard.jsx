import { Card } from './Card.jsx';

export function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <Card className="metric-card">
      <div className="metric-icon"><Icon size={20} /></div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </Card>
  );
}
