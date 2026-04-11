import FeedList from '@/components/FeedList';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import RouteGuard from '@/components/RouteGuard';

export default function FeedPage() {
  return (
    <RouteGuard requireProfile>
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] xl:h-[calc(100vh-9rem)] xl:grid-cols-[280px_minmax(0,1fr)_340px] xl:overflow-hidden xl:gap-5">
        <aside className="hidden lg:block xl:h-full xl:overflow-y-auto xl:pr-0">
          <div className="xl:sticky xl:top-0">
            <LeftSidebar />
          </div>
        </aside>

        <div className="space-y-6 xl:h-full xl:overflow-y-auto xl:px-1">
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

        <aside className="hidden xl:block xl:h-full xl:overflow-y-auto xl:pl-0">
          <div className="xl:sticky xl:top-0">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </RouteGuard>
  );
}
