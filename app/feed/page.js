import FeedList from '@/components/FeedList';
import RouteGuard from '@/components/RouteGuard';

export default function FeedPage() {
  return (
    <RouteGuard requireProfile>
      <div className="space-y-8">
        <div className="glass-panel overflow-hidden p-6">
          <div className="rounded-[28px] bg-gradient-to-r from-slate-950 via-indigo-950 to-cyan-900 p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">Campus feed</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">What students are sharing today</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
              Follow classmates, discover updates, and post moments from the Rangsit community in a feed built for a real product demo.
            </p>
          </div>
        </div>
        <FeedList />
      </div>
    </RouteGuard>
  );
}
