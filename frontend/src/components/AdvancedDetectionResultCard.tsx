import { memo, type CSSProperties } from "react";
import { AlertTriangle, CheckCircle2, Link2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type {
  AdvancedDetectionResult,
  AdvancedRiskLevel,
  ThreatSeverity,
  UrlAnalysisResponse
} from "../types/api";

interface AdvancedDetectionResultCardProps {
  result: AdvancedDetectionResult;
}

const riskColors: Record<AdvancedRiskLevel, string> = {
  SAFE: "#38d89d",
  LOW: "#76d9b5",
  MEDIUM: "#e5cd67",
  HIGH: "#f4a55e",
  CRITICAL: "#ff737b"
};

function AdvancedDetectionResultCard({ result }: AdvancedDetectionResultCardProps) {
  const isUrlResult = hasUrlDetails(result);
  const findings = isUrlResult ? result.reasons : result.redFlags;
  const scoreStyle = {
    "--advanced-score-progress": `${Math.min(100, Math.max(0, result.securityScore)) * 3.6}deg`,
    "--advanced-score-color": riskColors[result.riskLevel]
  } as CSSProperties;

  return (
    <motion.section
      className="advanced-result-card glass-card p-5 sm:p-6"
      aria-labelledby="advanced-result-title"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="section-kicker">Advanced scan result</p>
          <h2 id="advanced-result-title" className="mt-1 text-2xl font-semibold text-[color:var(--text)]">
            Security Assessment
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            Rule-based indicators and GPT-5 Mini analysis are combined into one safety-first score.
          </p>
        </div>
        <span className="advanced-result-icon" aria-hidden="true">
          <ShieldCheck size={23} />
        </span>
      </div>

      {isUrlResult && result.analyzedUrls.length ? (
        <div className="advanced-url-list mt-5" aria-label="URLs analyzed">
          <Link2 size={17} aria-hidden="true" />
          <span>Analyzed {result.analyzedUrls.length} URL{result.analyzedUrls.length === 1 ? "" : "s"}</span>
          <div>
            {result.analyzedUrls.map((url) => (
              <code key={url}>{url}</code>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 xl:grid-cols-[13.5rem_minmax(0,1fr)] xl:items-center">
        <div className="advanced-score-panel">
          <div
            className="advanced-score-ring"
            style={scoreStyle}
            role="progressbar"
            aria-label="Security score"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={result.securityScore}
          >
            <div className="advanced-score-value">
              <strong>{result.securityScore}</strong>
              <span>security score</span>
            </div>
          </div>
          <span className="mt-4 text-sm font-semibold text-[color:var(--text)]">Higher is safer</span>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="risk-badge" data-risk={result.riskLevel}>
              <ShieldCheck size={17} aria-hidden="true" />
              {result.riskLevel} risk
            </span>
            <span className="text-sm text-[color:var(--muted)]">{result.confidence}% AI confidence</span>
          </div>

          <div className="advanced-score-meter mt-5" aria-label={`${result.riskLevel} security score meter`}>
            <div className="advanced-score-track">
              <span className="advanced-score-marker" style={{ left: `${result.securityScore}%` }} aria-hidden="true" />
            </div>
            <div className="advanced-score-labels" aria-hidden="true">
              <span>Critical</span>
              <span>High</span>
              <span>Medium</span>
              <span>Low</span>
              <span>Safe</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="advanced-metric">
              <span>Category</span>
              <strong>{result.category}</strong>
            </div>
            <div className="advanced-metric">
              <span>Recommendation</span>
              <strong>{result.recommendation}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <article className="advanced-copy-card">
          <h3>Summary</h3>
          <p>{result.summary}</p>
        </article>
        <article className="advanced-copy-card">
          <h3>Explanation</h3>
          <p>{result.explanation}</p>
        </article>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <article className="advanced-findings-card" aria-labelledby="advanced-findings-title">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} aria-hidden="true" />
            <h3 id="advanced-findings-title">{isUrlResult ? "Reasons" : "Detected red flags"}</h3>
          </div>
          {findings.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {findings.map((finding, index) => (
                <span key={`${finding}-${index}`} className="advanced-finding">
                  <AlertTriangle size={15} aria-hidden="true" />
                  {finding}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 flex items-center gap-2 text-sm text-[color:var(--muted)]">
              <CheckCircle2 size={17} className="text-[color:var(--accent)]" aria-hidden="true" />
              No elevated scam indicators were detected.
            </p>
          )}
        </article>

        <article className="advanced-threat-card" aria-labelledby="threat-indicators-title">
          <div className="flex items-center gap-2">
            <Sparkles size={18} aria-hidden="true" />
            <h3 id="threat-indicators-title">Threat indicators</h3>
          </div>
          {result.threatIndicators.length ? (
            <div className="advanced-threat-list mt-4">
              {result.threatIndicators.map((indicator) => (
                <motion.span
                  key={indicator.label}
                  className="advanced-threat-badge"
                  data-severity={indicator.severity}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.22 }}
                >
                  <span className="advanced-threat-pulse" aria-hidden="true" />
                  {indicator.label}
                </motion.span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[color:var(--muted)]">No elevated threat badges for this scan.</p>
          )}
        </article>
      </div>
    </motion.section>
  );
}

function hasUrlDetails(result: AdvancedDetectionResult): result is UrlAnalysisResponse {
  return "reasons" in result;
}

export default memo(AdvancedDetectionResultCard);
