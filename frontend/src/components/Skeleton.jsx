export function Skeleton({ rows = 3 }) {
  return (
    <div className="skeleton-stack" aria-label="Carregando">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="skeleton" key={index} />
      ))}
    </div>
  );
}
