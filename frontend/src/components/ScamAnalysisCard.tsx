import { memo, type CSSProperties } from "react";
import { AlertTriangle, Brain, CheckCircle2, ScanSearch, Shield, ShieldAlert, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { ScamAnalysisResponse, ScamRiskLevel } from "../types/api";

export type AnalysisSource = "extracted" | "pasted";

interface ScamAnalysisCardProps {
  extractedText: string;
  pastedText: string;
  selectedSource: AnalysisSource;
  analysis: ScamAnalysisResponse | null;
  isAnalyzing: boolean;
  errorMessage: string;
  onSelectSource: (source: AnalysisSource) => void;
  onAnalyze: (text: string) => Promise<void>;
}

const riskColors: Record<ScamRiskLevel, string> = {
  LOW: "#38d89d",
  MEDIUM: "#e5cd67",
  HIGH: "#f4a55e",
  CRITICAL: "#ff737b"
};

function ScamAnalysisCard({
  extractedText,
  pastedText,
  selectedSource,
  analysis,
  isAnalyzing,
  errorMessage,
  onSelectSource,
  onAnalyze
}: ScamAnalysisCardProps) {
  const activeText = selectedSource === "extracted" ? extractedText : pastedText;
  const sourceLabel = selectedSource === "extracted" ? "extracted OCR text" : "pasted message";
  const hasTextToAnalyze = Boolean(activeText.trim());
  const analysisStyle = analysis
    ? ({
        "--analysis-progress": `${Math.min(100, Math.max(0, analysis.scamProbability)) * 3.6}deg`,
        "--risk-color": riskColors[analysis.riskLevel]
      } as CSSProperties)
    : undefined;

  function analyzeSelectedText() {
    void onAnalyze(activeText);
  }

  return (
    <section className="analysis-card glass-card p-5 sm:p-6" aria-labelledby="scam-analysis-title">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="section-kicker">ScamShield Intelligence</p>
          <h2 id="scam-analysis-title" className="mt-1 text-2xl font-semibold text-[color:var(--text)]">
            AI Scam Analysis
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            Choose the content to review, then receive an evidence-based risk assessment from GPT-5 Mini.
          </p>
        </div>
        <span className="analysis-title-icon" aria-hidden="true">
          <Brain size={22} />
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold text-[color:var(--text)]">Content to analyze</p>
          <div className="analysis-source-switch" role="group" aria-label="Content source for scam analysis">
            <button
              type="button"
              className="analysis-source-button"
              aria-pressed={selectedSource === "extracted"}
              disabled={isAnalyzing}
              onClick={() => onSelectSource("extracted")}
            >
              <ScanSearch size={17} aria-hidden="true" />
              <span>OCR text</span>
              <span className="analysis-source-count">{extractedText.length.toLocaleString()}</span>
            </button>
            <button
              type="button"
              className="analysis-source-button"
              aria-pressed={selectedSource === "pasted"}
              disabled={isAnalyzing}
              onClick={() => onSelectSource("pasted")}
            >
              <Sparkles size={17} aria-hidden="true" />
              <span>Pasted text</span>
              <span className="analysis-source-count">{pastedText.length.toLocaleString()}</span>
            </button>
          </div>
          <p id="analysis-source-help" className="mt-2 text-sm text-[color:var(--muted)]">
            Analyzing {sourceLabel}.
          </p>
        </div>

        <button
          type="button"
          className="primary-button w-full lg:w-auto"
          disabled={!hasTextToAnalyze || isAnalyzing}
          aria-busy={isAnalyzing}
          aria-describedby="analysis-source-help"
          onClick={analyzeSelectedText}
        >
          {isAnalyzing ? <Sparkles className="animate-pulse" size={17} aria-hidden="true" /> : <ShieldAlert size={17} aria-hidden="true" />}
          {isAnalyzing ? "Analyzing" : "Analyze with AI"}
        </button>
      </div>

      {errorMessage ? (
        <p className="analysis-error" role="alert">
          <AlertTriangle size={17} aria-hidden="true" />
          {errorMessage}
        </p>
      ) : null}

      {isAnalyzing ? (
        <motion.div
          className="analysis-loading"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="analysis-loader" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[color:var(--text)]">ScamShield AI is analyzing your message...</p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">Looking for impersonation, urgency, payment, and identity-risk signals.</p>
          </div>
        </motion.div>
      ) : null}

      {analysis && !isAnalyzing ? (
        <motion.div
          className="mt-7"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="grid gap-5 xl:grid-cols-[14rem_minmax(0,1fr)] xl:items-center">
            <div className="flex flex-col items-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-5 py-6">
              <div
                className="analysis-probability-ring"
                style={analysisStyle}
                role="progressbar"
                aria-label="Scam probability"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={analysis.scamProbability}
              >
                <div className="analysis-probability-value">
                  <strong>{analysis.scamProbability}%</strong>
                  <span>probability</span>
                </div>
              </div>
              <span className="mt-4 text-sm font-semibold text-[color:var(--text)]">Scam probability</span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="risk-badge" data-risk={analysis.riskLevel}>
                  <Shield size={17} aria-hidden="true" />
                  {analysis.riskLevel} risk
                </span>
                <span className="text-sm text-[color:var(--muted)]">{analysis.confidence}% AI confidence</span>
              </div>

              <div className="analysis-risk-meter mt-5" aria-label={`${analysis.riskLevel} risk meter`}>
                <div className="analysis-risk-track">
                  <span className="analysis-risk-marker" style={{ left: `${analysis.scamProbability}%` }} aria-hidden="true" />
                </div>
                <div className="analysis-risk-labels" aria-hidden="true">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Critical</span>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="analysis-metric">
                  <span>Category</span>
                  <strong>{analysis.category}</strong>
                </div>
                <div className="analysis-metric">
                  <span>Confidence score</span>
                  <strong>{analysis.confidence}%</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <article className="analysis-copy-card">
              <h3>Summary</h3>
              <p>{analysis.summary}</p>
            </article>
            <article className="analysis-copy-card">
              <h3>Why this was flagged</h3>
              <p>{analysis.explanation}</p>
            </article>
          </div>

          <article className="analysis-red-flags mt-5" aria-labelledby="red-flags-title">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} aria-hidden="true" />
              <h3 id="red-flags-title">Detected red flags</h3>
            </div>
            {analysis.redFlags.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {analysis.redFlags.map((flag) => (
                  <span key={flag} className="analysis-flag">
                    <AlertTriangle size={15} aria-hidden="true" />
                    {flag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 flex items-center gap-2 text-sm text-[color:var(--muted)]">
                <CheckCircle2 size={17} className="text-[color:var(--accent)]" aria-hidden="true" />
                No strong red flags were detected in this text.
              </p>
            )}
          </article>
        </motion.div>
      ) : null}

      {!analysis && !isAnalyzing && !errorMessage ? (
        <div className="analysis-empty-state mt-7">
          <Shield size={23} aria-hidden="true" />
          <div>
            <p className="font-semibold text-[color:var(--text)]">Ready when you are</p>
            <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
              Add content above and select Analyze with AI to receive a structured risk assessment.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default memo(ScamAnalysisCard);
