import { Lock, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-[color:var(--muted)] sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="flex items-center gap-3">
          <span className="brand-mark brand-mark-small" aria-hidden="true">
            <Shield size={16} />
          </span>
          <span>ScamShield AI helps you assess suspicious content and take safer next steps.</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock size={16} aria-hidden="true" />
          <span>We do not store screenshots in the frontend.</span>
        </div>
      </div>
    </footer>
  );
}
