import { Shield } from "lucide-react";

export default function PageSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-label="Loading page" role="status">
      <div className="page-skeleton-card glass-card p-5 sm:p-6">
        <div className="page-skeleton-icon" aria-hidden="true">
          <Shield size={25} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="skeleton-line skeleton-line-short" />
          <span className="skeleton-line mt-4" />
          <span className="skeleton-line mt-3 skeleton-line-medium" />
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="skeleton-panel glass-card" />
        <div className="skeleton-panel glass-card" />
      </div>
      <span className="sr-only">Loading ScamShield AI content</span>
    </section>
  );
}
