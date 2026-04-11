import FeedList from '@/components/FeedList';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import RouteGuard from '@/components/RouteGuard';

export default function FeedPage() {
  return (
    <RouteGuard requireProfile>
      <div className="grid gap-6 xl:grid-cols-[250px_minmax(0,1fr)_310px]">
        <aside className="hidden xl:block">
          <LeftSidebar />
        </aside>

        <div className="space-y-8">
          <div className="glass-panel overflow-hidden p-6">
            <div className="rounded-[28px] bg-gradient-to-r from-brand-900 via-brand-800 to-sky-500 p-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-100">Campus feed</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">What students are sharing today</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-sky-50/90">
                Follow classmates, discover campus updates, and share moments in a feed that feels like a modern university social product.
              </p>
            </div>
          </div>
          <FeedList />
        </div>

        <aside className="hidden lg:block">
          <RightSidebar />
        </aside>
      </div>
    </RouteGuard>
  );
}
