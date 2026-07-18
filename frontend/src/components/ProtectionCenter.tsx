import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Lightbulb,
  RefreshCw,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import type { ProtectionResponse } from "../types/api";
import { copyTextToClipboard } from "../utils/copyText";

interface ProtectionCenterProps {
  protection: ProtectionResponse | null;
  isGenerating: boolean;
  errorMessage: string;
  onRegenerate: () => void;
}

function ProtectionCenter({
  protection,
  isGenerating,
  errorMessage,
  onRegenerate
}: ProtectionCenterProps) {
  const [safeReply, setSafeReply] = useState("");

  useEffect(() => {
    setSafeReply(protection?.safeReply ?? "");
  }, [protection?.safeReply]);

  async function handleCopyReply() {
    try {
      await copyTextToClipboard(safeReply);
      toast.success("Copied Successfully");
    } catch {
      toast.error("Unable to copy the reply. Please try again.");
    }
  }

  return (
    <section className="protection-card glass-card p-5 sm:p-6" aria-labelledby="protection-center-title">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="section-kicker">Personalized safety guidance</p>
          <h2 id="protection-center-title" className="mt-1 text-2xl font-semibold text-[color:var(--text)]">
            Protection Center
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            Practical next steps, a safe response, and prevention guidance tailored to this analysis.
          </p>
        </div>
        <span className="protection-title-icon" aria-hidden="true">
          <ShieldCheck size={23} />
        </span>
      </div>

      {isGenerating ? (
        <motion.div
          className="protection-loading"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="protection-loader" aria-hidden="true">
            <ShieldCheck size={25} />
          </span>
          <div>
            <p className="font-semibold text-[color:var(--text)]">Preparing personalized safety advice...</p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Turning the detected risk signals into clear protective actions.
            </p>
          </div>
        </motion.div>
      ) : null}

      {!isGenerating && errorMessage ? (
        <p className="protection-error" role="alert">
          <AlertTriangle size={17} aria-hidden="true" />
          {errorMessage}
        </p>
      ) : null}

      {!isGenerating && protection ? (
        <motion.div
          className="mt-7 space-y-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <article className="protection-section" aria-labelledby="recommended-actions-title">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={19} className="text-[color:var(--accent)]" aria-hidden="true" />
              <h3 id="recommended-actions-title">Recommended actions</h3>
            </div>
            <div className="protection-action-grid mt-4">
              {protection.recommendedActions.map((action, index) => (
                <div key={`${action}-${index}`} className="protection-action">
                  <CheckCircle2 size={19} aria-hidden="true" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="protection-section" aria-labelledby="safe-reply-title">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={19} className="text-[color:var(--accent-strong)]" aria-hidden="true" />
                <h3 id="safe-reply-title">Safe Reply</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="secondary-button" onClick={() => void handleCopyReply()}>
                  <Copy size={16} aria-hidden="true" />
                  Copy Reply
                </button>
                <button type="button" className="secondary-button" onClick={onRegenerate}>
                  <RefreshCw size={16} aria-hidden="true" />
                  Regenerate
                </button>
              </div>
            </div>
            <textarea
              className="protection-reply-input mt-4"
              value={safeReply}
              aria-label="Editable safe reply"
              rows={4}
              onChange={(event) => setSafeReply(event.target.value)}
            />
          </article>

          <div className="grid gap-5 xl:grid-cols-2">
            <article className="protection-section" aria-labelledby="prevention-tips-title">
              <div className="flex items-center gap-2">
                <Lightbulb size={19} className="text-[color:var(--warning)]" aria-hidden="true" />
                <h3 id="prevention-tips-title">Prevention tips</h3>
              </div>
              <div className="mt-4 space-y-3">
                {protection.preventionTips.map((tip, index) => (
                  <div key={`${tip}-${index}`} className="protection-tip">
                    <Lightbulb size={17} aria-hidden="true" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="protection-section" aria-labelledby="similar-scams-title">
              <div className="flex items-center gap-2">
                <AlertTriangle size={19} className="text-[color:var(--warning)]" aria-hidden="true" />
                <h3 id="similar-scams-title">Similar scam examples</h3>
              </div>
              <div className="protection-similar-list mt-4">
                {protection.similarScams.map((scam, index) => (
                  <span key={`${scam}-${index}`} className="protection-similar-tag">
                    <AlertTriangle size={15} aria-hidden="true" />
                    {scam}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}

export default memo(ProtectionCenter);
