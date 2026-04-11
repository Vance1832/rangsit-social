import FeedList from '@/components/FeedList';
import RouteGuard from '@/components/RouteGuard';

export default function SavedPostsPage() {
  return (
    <RouteGuard requireProfile>
      <div className="space-y-6">
        <div className="glass-panel p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Saved</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Saved posts</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Keep the posts you want to revisit later in one place.
          </p>
        </div>
        <FeedList
          endpoint="/api/saved-posts"
          emptyTitle="No saved posts yet"
          emptyDescription="Save posts from the feed to build your own reading list."
        />
      </div>
    </RouteGuard>
  );
}
