export default function EmptyState({ title, description, action }) {
  return (
    <div className="card p-8 text-center">
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-sm text-slate-500 mt-2">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
