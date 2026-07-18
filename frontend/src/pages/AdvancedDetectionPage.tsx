import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Briefcase, Link as LinkIcon, Mail, Search, Shield, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import AdvancedDetectionResultCard from "../components/AdvancedDetectionResultCard";
import { useAdvancedDetection } from "../hooks/useAdvancedDetection";

type AdvancedTab = "url" | "email" | "job";

const tabs = [
  { id: "url" as const, label: "URL Checker", icon: LinkIcon },
  { id: "email" as const, label: "Email Analyzer", icon: Mail },
  { id: "job" as const, label: "Job Scam Detector", icon: Briefcase }
];

export default function AdvancedDetectionPage() {
  const [activeTab, setActiveTab] = useState<AdvancedTab>("url");
  const [url, setUrl] = useState("");
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [jobMessage, setJobMessage] = useState("");
  const detection = useAdvancedDetection();

  function selectTab(tab: AdvancedTab) {
    if (tab !== activeTab) {
      setActiveTab(tab);
      detection.clearDetection();
    }
  }

  function clearStaleDetection() {
    if (detection.result || detection.errorMessage) {
      detection.clearDetection();
    }
  }

  function analyzeUrl() {
    if (!url.trim()) {
      toast.error("Enter a URL or text containing URLs first");
      return;
    }

    void detection.runUrlAnalysis({ url: url.trim() });
  }

  function analyzeEmail() {
    if (!sender.trim() || !subject.trim() || !emailBody.trim()) {
      toast.error("Add the sender, subject, and email body first");
      return;
    }

    void detection.runEmailAnalysis({
      sender: sender.trim(),
      subject: subject.trim(),
      body: emailBody.trim()
    });
  }

  function analyzeJobOffer() {
    if (!jobMessage.trim()) {
      toast.error("Paste a job offer message first");
      return;
    }

    void detection.runJobAnalysis({ message: jobMessage.trim() });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        className="mb-8 max-w-3xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <p className="section-kicker">ScamShield Advanced Intelligence</p>
        <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)] sm:text-5xl">
          Check risky links, emails, and job offers before you engage.
        </h1>
        <p className="mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg">
          Deterministic safety checks and GPT-5 Mini work together to surface advanced scam indicators and a unified security score.
        </p>
      </motion.div>

      <section className="advanced-workbench glass-card p-5 sm:p-6" aria-labelledby="advanced-detection-title">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="section-kicker">Advanced Detection</p>
            <h2 id="advanced-detection-title" className="mt-1 text-2xl font-semibold text-[color:var(--text)]">
              Advanced Detection Suite
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
              Select a scan type and review AI-assisted evidence without opening a suspicious link or replying to a sender.
            </p>
          </div>
          <span className="advanced-workbench-icon" aria-hidden="true">
            <Shield size={23} />
          </span>
        </div>

        <div className="advanced-tabs mt-6" role="tablist" aria-label="Advanced detection tools">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`${tab.id}-tab`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`${tab.id}-panel`}
                className="advanced-tab"
                disabled={detection.isAnalyzing}
                onClick={() => selectTab(tab.id)}
              >
                <Icon size={18} aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div id={`${activeTab}-panel`} role="tabpanel" aria-labelledby={`${activeTab}-tab`} className="mt-6">
          {activeTab === "url" ? (
            <form onSubmit={(event) => { event.preventDefault(); analyzeUrl(); }}>
              <label className="advanced-field-label" htmlFor="advanced-url-input">URL or text containing URLs</label>
              <div className="advanced-input-row mt-2">
                <LinkIcon size={19} aria-hidden="true" />
                <input
                  id="advanced-url-input"
                  className="advanced-input"
                  type="text"
                  value={url}
                  disabled={detection.isAnalyzing}
                  placeholder="https://secure-bank-login.xyz or paste text with multiple URLs"
                  onChange={(event) => {
                    setUrl(event.target.value);
                    clearStaleDetection();
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Supports HTTP, HTTPS, short URLs, and multiple URLs extracted from pasted text.
              </p>
              <button type="submit" className="primary-button mt-5" disabled={detection.isAnalyzing}>
                <Search size={17} aria-hidden="true" />
                Analyze URL Safety
              </button>
            </form>
          ) : null}

          {activeTab === "email" ? (
            <form onSubmit={(event) => { event.preventDefault(); analyzeEmail(); }}>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="advanced-field-label" htmlFor="advanced-email-sender">
                  Sender
                  <div className="advanced-input-row mt-2">
                    <Mail size={19} aria-hidden="true" />
                    <input
                      id="advanced-email-sender"
                      className="advanced-input"
                      type="text"
                      value={sender}
                      disabled={detection.isAnalyzing}
                      placeholder="support@sbi-security.xyz"
                      onChange={(event) => {
                        setSender(event.target.value);
                        clearStaleDetection();
                      }}
                    />
                  </div>
                </label>
                <label className="advanced-field-label" htmlFor="advanced-email-subject">
                  Subject
                  <div className="advanced-input-row mt-2">
                    <Sparkles size={19} aria-hidden="true" />
                    <input
                      id="advanced-email-subject"
                      className="advanced-input"
                      type="text"
                      value={subject}
                      disabled={detection.isAnalyzing}
                      placeholder="Urgent Account Verification"
                      onChange={(event) => {
                        setSubject(event.target.value);
                        clearStaleDetection();
                      }}
                    />
                  </div>
                </label>
              </div>
              <label className="advanced-field-label mt-4 block" htmlFor="advanced-email-body">Email body</label>
              <textarea
                id="advanced-email-body"
                className="advanced-textarea mt-2"
                value={emailBody}
                disabled={detection.isAnalyzing}
                rows={8}
                placeholder="Paste the suspicious email body, including any links or payment requests..."
                onChange={(event) => {
                  setEmailBody(event.target.value);
                  clearStaleDetection();
                }}
              />
              <button type="submit" className="primary-button mt-5" disabled={detection.isAnalyzing}>
                <Mail size={17} aria-hidden="true" />
                Analyze Email
              </button>
            </form>
          ) : null}

          {activeTab === "job" ? (
            <form onSubmit={(event) => { event.preventDefault(); analyzeJobOffer(); }}>
              <label className="advanced-field-label" htmlFor="advanced-job-message">Job offer message</label>
              <textarea
                id="advanced-job-message"
                className="advanced-textarea mt-2"
                value={jobMessage}
                disabled={detection.isAnalyzing}
                rows={10}
                placeholder="Paste the job offer, recruiter message, or work-from-home opportunity here..."
                onChange={(event) => {
                  setJobMessage(event.target.value);
                  clearStaleDetection();
                }}
              />
              <button type="submit" className="primary-button mt-5" disabled={detection.isAnalyzing}>
                <Briefcase size={17} aria-hidden="true" />
                Analyze Job Offer
              </button>
            </form>
          ) : null}
        </div>

        {detection.errorMessage ? (
          <p className="advanced-error" role="alert">
            <AlertTriangle size={17} aria-hidden="true" />
            {detection.errorMessage}
          </p>
        ) : null}

        {detection.isAnalyzing ? (
          <motion.div
            className="advanced-loading"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="advanced-loader" aria-hidden="true">
              <Shield size={25} />
            </span>
            <div>
              <p className="font-semibold text-[color:var(--text)]">Scanning for advanced scam indicators...</p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                Checking deterministic signals and preparing a structured AI safety assessment.
              </p>
            </div>
          </motion.div>
        ) : null}
      </section>

      {detection.result && !detection.isAnalyzing ? (
        <div className="mt-5">
          <AdvancedDetectionResultCard result={detection.result} />
        </div>
      ) : null}
    </section>
  );
}
