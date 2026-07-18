import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Filter, Search, ShieldCheck, Trash2 } from "lucide-react";
import { useAnalysisHistory } from "../contexts/AnalysisHistoryContext";
import type { AdvancedRiskLevel } from "../types/api";
import { formatDateTime } from "../utils/formatters";

const RISK_OPTIONS: Array<"ALL" | AdvancedRiskLevel> = ["ALL", "SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function HistoryPage() {
  const { history, deleteAnalysis, clearHistory } = useAnalysisHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState<"ALL" | AdvancedRiskLevel>("ALL");
  const categories = useMemo(
    () => Array.from(new Set(history.map((item) => item.category))).sort((first, second) => first.localeCompare(second)),
    [history]
  );
  const filteredHistory = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    return history.filter((item) => {
      const matchesSearch = !normalizedQuery || [item.source, item.category, item.riskLevel, item.summary]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery);
      const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
      const matchesRisk = riskFilter === "ALL" || item.riskLevel === riskFilter;
      return matchesSearch && matchesCategory && matchesRisk;
    });
  }, [categoryFilter, history, riskFilter, searchQuery]);

  function handleClearHistory() {
    if (!history.length || !window.confirm("Clear all locally saved analysis history from this browser?")) {
      return;
    }

    clearHistory();
    toast.success("Analysis history cleared");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="section-kicker">Analysis history</p>
          <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)] sm:text-5xl">
            Review your checks without sending history to a server.
          </h1>
          <p className="mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg">
            Analyses are stored only in this browser. Delete individual records or clear them whenever you choose.
          </p>
        </div>
        <button type="button" className="secondary-button self-start lg:self-auto" onClick={handleClearHistory} disabled={!history.length}>
          <Trash2 size={17} aria-hidden="true" />
          Clear history
        </button>
      </div>

      <section className="history-filter-card glass-card mt-8 p-5 sm:p-6" aria-label="Filter analysis history">
        <div className="history-filter-grid">
          <label className="search-dialog-input" htmlFor="history-search">
            <Search size={19} aria-hidden="true" />
            <input
              id="history-search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search category, source, summary, or risk"
            />
          </label>
          <label className="history-select-label" htmlFor="history-category">
            <Filter size={17} aria-hidden="true" />
            <span>Category</span>
            <select id="history-category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="ALL">All categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label className="history-select-label" htmlFor="history-risk">
            <ShieldCheck size={17} aria-hidden="true" />
            <span>Risk</span>
            <select
              id="history-risk"
              value={riskFilter}
              onChange={(event) => setRiskFilter(event.target.value as "ALL" | AdvancedRiskLevel)}
            >
              {RISK_OPTIONS.map((risk) => <option key={risk} value={risk}>{risk === "ALL" ? "All risk levels" : risk}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="mt-5" aria-labelledby="history-list-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="history-list-title" className="text-lg font-semibold text-[color:var(--text)]">
            {filteredHistory.length} {filteredHistory.length === 1 ? "analysis" : "analyses"}
          </h2>
          {history.length ? <span className="text-sm text-[color:var(--muted)]">Saved locally on this device</span> : null}
        </div>

        {filteredHistory.length ? (
          <div className="history-list">
            {filteredHistory.map((item) => (
              <article key={item.id} className="history-item glass-card">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="risk-badge" data-risk={item.riskLevel}>{item.riskLevel}</span>
                    <span className="text-sm font-semibold text-[color:var(--text)]">{item.category}</span>
                    <span className="text-sm text-[color:var(--muted)]">{item.securityScore}/100 security</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--text)]">{item.summary}</p>
                  <p className="mt-3 text-xs text-[color:var(--muted)]">{item.source} · {formatDateTime(item.timestamp)}</p>
                </div>
                <button
                  type="button"
                  className="icon-button history-delete-button"
                  onClick={() => deleteAnalysis(item.id)}
                  aria-label={`Delete ${item.category} analysis from history`}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-state glass-card">
            <Search size={22} aria-hidden="true" />
            <div>
              <h3>{history.length ? "No history entries match these filters" : "Your local history is empty"}</h3>
              <p>{history.length ? "Adjust the search or filters to see saved analyses." : "Complete a message or advanced scan to add the first private history entry."}</p>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
