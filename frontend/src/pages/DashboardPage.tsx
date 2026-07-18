import { useMemo } from "react";
import { Activity, BarChart3, CheckCircle2, Clock3, ShieldAlert, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalysisHistory } from "../contexts/AnalysisHistoryContext";
import { formatRelativeTime } from "../utils/formatters";

export default function DashboardPage() {
  const { history } = useAnalysisHistory();
  const analytics = useMemo(() => {
    const total = history.length;
    const highRisk = history.filter((item) => item.riskLevel === "HIGH" || item.riskLevel === "CRITICAL").length;
    const safe = history.filter((item) => item.riskLevel === "SAFE").length;
    const averageSecurityScore = total
      ? Math.round(history.reduce((sum, item) => sum + item.securityScore, 0) / total)
      : 0;
    const categoryCounts = history.reduce<Record<string, number>>((counts, item) => {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
      return counts;
    }, {});
    const mostCommonCategory = Object.entries(categoryCounts)
      .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)[0]?.[0] ?? "No analyses yet";

    return {
      total,
      highRisk,
      safe,
      averageSecurityScore,
      mostCommonCategory,
      recent: history.slice(0, 5)
    };
  }, [history]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="section-kicker">Security dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)] sm:text-5xl">
          See the safety patterns in your recent checks.
        </h1>
        <p className="mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg">
          Dashboard metrics are calculated from analyses saved locally in this browser.
        </p>
      </div>

      <div className="dashboard-metric-grid mt-8">
        <MetricCard icon={Activity} label="Total analyses" value={analytics.total} tone="accent" />
        <MetricCard icon={ShieldAlert} label="High risk" value={analytics.highRisk} tone="danger" />
        <MetricCard icon={CheckCircle2} label="Safe" value={analytics.safe} tone="safe" />
        <MetricCard icon={BarChart3} label="Average security score" value={`${analytics.averageSecurityScore}/100`} tone="info" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <section className="glass-card p-5 sm:p-6" aria-labelledby="recent-analyses-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-kicker">Recent activity</p>
              <h2 id="recent-analyses-title" className="mt-1 text-xl font-semibold text-[color:var(--text)]">Recent analyses</h2>
            </div>
            <Link to="/history" className="ghost-button">View history</Link>
          </div>

          {analytics.recent.length ? (
            <ol className="activity-timeline mt-6">
              {analytics.recent.map((item) => (
                <li key={item.id}>
                  <span className="activity-dot" data-risk={item.riskLevel} aria-hidden="true" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <strong>{item.category}</strong>
                      <span className="risk-badge" data-risk={item.riskLevel}>{item.riskLevel}</span>
                    </div>
                    <p>{item.summary}</p>
                    <small>{item.source} · {formatRelativeTime(item.timestamp)} · {item.securityScore}/100 security</small>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyDashboardState />
          )}
        </section>

        <aside className="dashboard-insight-card glass-card p-5 sm:p-6" aria-labelledby="category-insight-title">
          <span className="dashboard-insight-icon" aria-hidden="true"><ShieldCheck size={23} /></span>
          <p className="section-kicker mt-5">Pattern insight</p>
          <h2 id="category-insight-title" className="mt-1 text-xl font-semibold text-[color:var(--text)]">Most common category</h2>
          <p className="mt-5 text-3xl font-semibold text-[color:var(--text)]">{analytics.mostCommonCategory}</p>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
            Use the Awareness Hub to learn the warning signs and protective steps for common scam categories.
          </p>
          <Link to="/awareness" className="secondary-button mt-6">Explore awareness hub</Link>
        </aside>
      </div>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: typeof Activity;
  label: string;
  value: string | number;
  tone: "accent" | "danger" | "safe" | "info";
}) {
  return (
    <article className="dashboard-metric-card glass-card" data-tone={tone}>
      <span className="dashboard-metric-icon" aria-hidden="true"><Icon size={20} /></span>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function EmptyDashboardState() {
  return (
    <div className="dashboard-empty-state mt-6">
      <Clock3 size={22} aria-hidden="true" />
      <div>
        <h3>No local analyses yet</h3>
        <p>Run a message, URL, email, or job scan to build your private activity timeline.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/app" className="primary-button">Analyze a message</Link>
          <Link to="/advanced" className="secondary-button">Open advanced tools</Link>
        </div>
      </div>
    </div>
  );
}
