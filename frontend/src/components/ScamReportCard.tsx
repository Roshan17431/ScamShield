import { memo, useMemo } from "react";
import { AlertTriangle, CheckCircle2, Copy, Download, FileText, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import type { GeneratedScamReport, ProtectionResponse, ScamAnalysisResponse } from "../types/api";
import { copyTextToClipboard } from "../utils/copyText";
import {
  downloadScamReportPdf,
  formatReportTimestamp,
  formatScamReport
} from "../utils/scamReportPdf";

interface ScamReportCardProps {
  analysis: ScamAnalysisResponse;
  protection: ProtectionResponse;
}

function ScamReportCard({ analysis, protection }: ScamReportCardProps) {
  const reportData = useMemo<GeneratedScamReport>(
    () => ({
      analysis,
      report: protection.report
    }),
    [analysis, protection.report]
  );
  const { report } = protection;

  async function handleCopyReport() {
    try {
      await copyTextToClipboard(formatScamReport(reportData));
      toast.success("Report copied successfully");
    } catch {
      toast.error("Unable to copy the report. Please try again.");
    }
  }

  function handleDownloadReport() {
    try {
      downloadScamReportPdf(reportData);
      toast.success("Report downloaded");
    } catch {
      toast.error("Unable to download the report. Please try again.");
    }
  }

  return (
    <section className="report-card glass-card p-5 sm:p-6" aria-labelledby="scam-report-title">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="section-kicker">Shareable safety record</p>
          <h2 id="scam-report-title" className="mt-1 text-2xl font-semibold text-[color:var(--text)]">
            Scam Report
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            Keep this structured assessment for your records or to support a report through an official channel.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="secondary-button" onClick={() => void handleCopyReport()}>
            <Copy size={16} aria-hidden="true" />
            Copy Report
          </button>
          <button type="button" className="primary-button" onClick={handleDownloadReport}>
            <Download size={16} aria-hidden="true" />
            Download Report
          </button>
        </div>
      </div>

      <div className="report-overview mt-6">
        <div className="report-risk-summary">
          <span className="report-title-icon" aria-hidden="true">
            <ShieldCheck size={22} />
          </span>
          <div>
            <p>Risk level</p>
            <span className="risk-badge mt-2" data-risk={report.riskLevel}>
              {report.riskLevel}
            </span>
          </div>
        </div>
        <div className="report-metric">
          <span>Scam category</span>
          <strong>{report.category}</strong>
        </div>
        <div className="report-metric">
          <span>Scam probability</span>
          <strong>{analysis.scamProbability}%</strong>
        </div>
        <div className="report-metric">
          <span>Generated time</span>
          <strong>{formatReportTimestamp(report.generatedAt)}</strong>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <article className="report-copy-card">
          <h3>Summary</h3>
          <p>{analysis.summary}</p>
        </article>
        <article className="report-copy-card">
          <h3>Explanation</h3>
          <p>{analysis.explanation}</p>
        </article>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <ReportList
          title="Detected Red Flags"
          items={report.redFlags}
          icon={<AlertTriangle size={17} aria-hidden="true" />}
          tone="warning"
        />
        <ReportList
          title="Recommended Actions"
          items={report.recommendedActions}
          icon={<CheckCircle2 size={17} aria-hidden="true" />}
          tone="safe"
        />
        <ReportList
          title="Prevention Tips"
          items={report.preventionTips}
          icon={<FileText size={17} aria-hidden="true" />}
          tone="info"
        />
      </div>
    </section>
  );
}

interface ReportListProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  tone: "warning" | "safe" | "info";
}

function ReportList({ title, items, icon, tone }: ReportListProps) {
  return (
    <article className="report-list-card" data-tone={tone}>
      <div className="flex items-center gap-2">
        {icon}
        <h3>{title}</h3>
      </div>
      <ul className="mt-4 space-y-3">
        {items.length ? (
          items.map((item, index) => (
            <li key={`${item}-${index}`}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </li>
          ))
        ) : (
          <li className="report-list-empty">No strong indicators were identified.</li>
        )}
      </ul>
    </article>
  );
}

export default memo(ScamReportCard);
