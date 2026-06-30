export function StatusBadge({ children, tone = 'ok' }) {
  return <span className={`status status-${tone}`}>{children}</span>;
}
