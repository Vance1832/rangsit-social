export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="card p-6 text-center text-slate-500">
      <div className="h-8 w-8 mx-auto rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}
