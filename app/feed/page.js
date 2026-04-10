import FeedList from '@/components/FeedList';
import RouteGuard from '@/components/RouteGuard';

export default function FeedPage() {
  return (
    <RouteGuard requireProfile>
      <div className="space-y-6">
        <div className="card p-6">
          <h1 className="text-2xl font-semibold">Campus Feed</h1>
          <p className="text-sm text-slate-500 mt-2">
            Stay updated with the latest posts from your Rangsit Social community.
          </p>
        </div>
        <FeedList />
      </div>
    </RouteGuard>
  );
}
