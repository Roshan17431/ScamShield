import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Clock3, Search, ShieldCheck, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalysisHistory } from "../contexts/AnalysisHistoryContext";
import { awarenessArticles } from "../data/awarenessArticles";
import { formatRelativeTime } from "../utils/formatters";

interface GlobalSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function GlobalSearchDialog({ isOpen, onOpenChange }: GlobalSearchDialogProps) {
  const { history } = useAnalysisHistory();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isSearchShortcut) {
        event.preventDefault();
        onOpenChange(true);
      }

      if (event.key === "Escape" && isOpen) {
        onOpenChange(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const { articleResults, historyResults } = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const includesQuery = (value: string) => !normalizedQuery || value.toLocaleLowerCase().includes(normalizedQuery);

    return {
      articleResults: awarenessArticles.filter((article) => includesQuery([
        article.title,
        article.category,
        article.description,
        article.howItWorks,
        ...article.warningSigns,
        ...article.tips
      ].join(" "))).slice(0, 5),
      historyResults: history.filter((item) => includesQuery([
        item.source,
        item.category,
        item.riskLevel,
        item.summary
      ].join(" "))).slice(0, 5)
    };
  }, [history, query]);

  if (!isOpen) {
    return null;
  }

  function closeDialog() {
    onOpenChange(false);
    setQuery("");
  }

  return (
    <div className="search-dialog-backdrop" role="presentation" onMouseDown={closeDialog}>
      <section
        className="search-dialog glass-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-search-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Global search</p>
            <h2 id="global-search-title" className="mt-1 text-xl font-semibold text-[color:var(--text)]">
              Find safety guidance and past analyses
            </h2>
          </div>
          <button type="button" className="icon-button" onClick={closeDialog} aria-label="Close global search">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <label className="search-dialog-input mt-5" htmlFor="global-search-input">
          <Search size={19} aria-hidden="true" />
          <input
            ref={inputRef}
            id="global-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search UPI, OTP, job scams, a past category..."
            autoComplete="off"
          />
        </label>

        <div className="search-results-grid mt-5">
          <section aria-labelledby="search-guidance-title">
            <div className="flex items-center gap-2 text-[color:var(--accent)]">
              <BookOpen size={17} aria-hidden="true" />
              <h3 id="search-guidance-title" className="text-sm font-semibold uppercase tracking-[0.08em]">Awareness hub</h3>
            </div>
            <div className="mt-3 space-y-2">
              {articleResults.length ? articleResults.map((article) => (
                <Link key={article.id} to="/awareness" className="search-result-card focus-ring" onClick={closeDialog}>
                  <span className="search-result-icon" aria-hidden="true"><ShieldCheck size={16} /></span>
                  <span>
                    <strong>{article.title}</strong>
                    <small>{article.category} · {article.description}</small>
                  </span>
                </Link>
              )) : <p className="search-empty">No awareness topic matches this search.</p>}
            </div>
          </section>

          <section aria-labelledby="search-history-title">
            <div className="flex items-center gap-2 text-[color:var(--accent-strong)]">
              <Clock3 size={17} aria-hidden="true" />
              <h3 id="search-history-title" className="text-sm font-semibold uppercase tracking-[0.08em]">Analysis history</h3>
            </div>
            <div className="mt-3 space-y-2">
              {historyResults.length ? historyResults.map((item) => (
                <Link key={item.id} to="/history" className="search-result-card focus-ring" onClick={closeDialog}>
                  <span className="search-result-icon" aria-hidden="true"><Clock3 size={16} /></span>
                  <span>
                    <strong>{item.category} · {item.riskLevel}</strong>
                    <small>{item.source} · {formatRelativeTime(item.timestamp)}</small>
                  </span>
                </Link>
              )) : <p className="search-empty">No saved analysis matches this search.</p>}
            </div>
          </section>
        </div>

        <p className="mt-5 text-xs text-[color:var(--muted)]">
          Press <kbd>Esc</kbd> to close. Analysis history remains in this browser only.
        </p>
      </section>
    </div>
  );
}
