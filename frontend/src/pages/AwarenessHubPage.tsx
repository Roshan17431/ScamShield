import { useMemo, useState } from "react";
import { AlertTriangle, Banknote, BriefcaseBusiness, CircleDollarSign, Gift, Landmark, MailWarning, MessageSquareWarning, PackageSearch, QrCode, Search, ShieldCheck, ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { awarenessArticles } from "../data/awarenessArticles";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Banking: Landmark,
  UPI: Banknote,
  "QR Code": QrCode,
  Job: BriefcaseBusiness,
  Investment: CircleDollarSign,
  Courier: PackageSearch,
  Lottery: Gift,
  "Social Media": MessageSquareWarning,
  OTP: MailWarning,
  "Online Shopping": ShoppingBag
};

export default function AwarenessHubPage() {
  const [query, setQuery] = useState("");
  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) {
      return awarenessArticles;
    }

    return awarenessArticles.filter((article) => [
      article.title,
      article.category,
      article.description,
      article.howItWorks,
      ...article.warningSigns,
      ...article.tips
    ].join(" ").toLocaleLowerCase().includes(normalizedQuery));
  }, [query]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
        <div className="max-w-3xl">
          <p className="section-kicker">Scam Awareness Hub</p>
          <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)] sm:text-5xl">
            Learn the patterns before a scammer creates pressure.
          </h1>
          <p className="mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg">
            Explore practical warning signs and safer next steps for the scams people encounter most often.
          </p>
        </div>
        <label className="search-dialog-input" htmlFor="awareness-search">
          <Search size={19} aria-hidden="true" />
          <input
            id="awareness-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a scam type"
          />
        </label>
      </div>

      <div className="awareness-grid mt-8">
        {filteredArticles.map((article) => {
          const Icon = CATEGORY_ICONS[article.category] ?? ShieldCheck;
          return (
            <article key={article.id} className="awareness-card glass-card">
              <div className="flex items-start justify-between gap-4">
                <span className="awareness-icon" aria-hidden="true"><Icon size={22} /></span>
                <span className="awareness-category">{article.category}</span>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-[color:var(--text)]">{article.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{article.description}</p>

              <div className="awareness-section mt-5">
                <h3>How it works</h3>
                <p>{article.howItWorks}</p>
              </div>

              <div className="awareness-section awareness-section-warning mt-4">
                <h3><AlertTriangle size={16} aria-hidden="true" /> Warning signs</h3>
                <ul>
                  {article.warningSigns.map((sign) => <li key={sign}>{sign}</li>)}
                </ul>
              </div>

              <div className="awareness-section awareness-section-safe mt-4">
                <h3><ShieldCheck size={16} aria-hidden="true" /> Safety tips</h3>
                <ul>
                  {article.tips.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      {!filteredArticles.length ? (
        <div className="dashboard-empty-state glass-card mt-8">
          <Search size={22} aria-hidden="true" />
          <div>
            <h2>No awareness topic matches this search</h2>
            <p>Try terms such as banking, QR, OTP, courier, job, investment, or shopping.</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
