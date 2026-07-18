import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Bot, Copy, MessageCircleQuestion, Send, ShieldCheck, Sparkles, Trash2, UserRound } from "lucide-react";
import { useSafetyCoach } from "../hooks/useSafetyCoach";
import { copyTextToClipboard } from "../utils/copyText";

const SUGGESTED_QUESTIONS = [
  "How can I check whether a UPI collect request is safe?",
  "What should I do if I shared my OTP with someone?",
  "How can I protect my parents from courier scams?",
  "What are warning signs of a fake job offer?"
];

export default function SafetyCoachPage() {
  const [draft, setDraft] = useState("");
  const endOfThreadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, isThinking, errorMessage, sendMessage, clearSession } = useSafetyCoach();

  useEffect(() => {
    endOfThreadRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const wasSent = await sendMessage(draft);
    if (wasSent) {
      setDraft("");
      inputRef.current?.focus();
    }
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  async function handleCopyAnswer(answer: string) {
    try {
      await copyTextToClipboard(answer);
      toast.success("Safety guidance copied");
    } catch {
      toast.error("Unable to copy this response");
    }
  }

  function handleClearSession() {
    if (!messages.length) {
      return;
    }

    clearSession();
    toast.success("Safety Coach session cleared");
  }

  function selectSuggestion(question: string) {
    setDraft(question);
    inputRef.current?.focus();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="section-kicker">AI Safety Coach</p>
          <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)] sm:text-5xl">
            Ask a cybersecurity question in plain language.
          </h1>
          <p className="mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg">
            Get practical, safety-first guidance for suspicious messages, payments, calls, links, and everyday online risks.
          </p>
        </div>
        <button
          type="button"
          className="secondary-button self-start lg:self-auto"
          onClick={handleClearSession}
          disabled={!messages.length && !isThinking}
        >
          <Trash2 size={17} aria-hidden="true" />
          Clear session
        </button>
      </div>

      <section className="safety-coach-card glass-card" aria-labelledby="safety-coach-thread-title">
        <div className="safety-coach-heading">
          <span className="safety-coach-icon" aria-hidden="true"><ShieldCheck size={23} /></span>
          <div>
            <p className="section-kicker">Private session</p>
            <h2 id="safety-coach-thread-title" className="mt-1 text-xl font-semibold text-[color:var(--text)]">
              Your current Safety Coach conversation
            </h2>
          </div>
        </div>

        <div className="chat-thread mt-6" aria-live="polite" aria-busy={isThinking}>
          {messages.length ? messages.map((message) => {
            const isAssistant = message.role === "assistant";
            return (
              <article key={message.id} className="chat-message" data-role={message.role}>
                <span className="chat-avatar" aria-hidden="true">
                  {isAssistant ? <Bot size={18} /> : <UserRound size={18} />}
                </span>
                <div className="chat-message-content">
                  <div className="chat-bubble">
                    {isAssistant ? (
                      <div className="markdown-answer"><ReactMarkdown>{message.content}</ReactMarkdown></div>
                    ) : <p>{message.content}</p>}
                  </div>
                  {isAssistant ? (
                    <button
                      type="button"
                      className="chat-copy-button"
                      onClick={() => void handleCopyAnswer(message.content)}
                      aria-label="Copy Safety Coach response"
                    >
                      <Copy size={15} aria-hidden="true" />
                      Copy
                    </button>
                  ) : null}
                </div>
              </article>
            );
          }) : (
            <div className="chat-empty-state">
              <span className="chat-empty-icon" aria-hidden="true"><MessageCircleQuestion size={25} /></span>
              <div>
                <h3>What would you like to check?</h3>
                <p>Ask about a suspicious situation without sharing passwords, OTPs, PINs, or account details.</p>
              </div>
            </div>
          )}

          {isThinking ? (
            <div className="chat-message" data-role="assistant" role="status">
              <span className="chat-avatar" aria-hidden="true"><Bot size={18} /></span>
              <div className="coach-thinking">
                <Sparkles size={17} aria-hidden="true" />
                <span>Safety Coach is thinking through the safest next steps...</span>
                <span className="thinking-dots" aria-hidden="true"><i /><i /><i /></span>
              </div>
            </div>
          ) : null}
          <div ref={endOfThreadRef} />
        </div>

        {errorMessage ? <p className="chat-error" role="alert">{errorMessage}</p> : null}

        <div className="mt-6">
          <p className="text-sm font-semibold text-[color:var(--text)]">Suggested questions</p>
          <div className="suggestion-list mt-3">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                className="suggestion-chip"
                disabled={isThinking}
                onClick={() => selectSuggestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <form className="chat-compose mt-6" onSubmit={(event) => void handleSubmit(event)}>
          <label className="sr-only" htmlFor="safety-coach-message">Ask the Safety Coach</label>
          <textarea
            ref={inputRef}
            id="safety-coach-message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            rows={3}
            maxLength={4000}
            disabled={isThinking}
            placeholder="For example: I received a courier message asking for a delivery fee. What should I check?"
          />
          <div className="chat-compose-footer">
            <span>Ctrl/Cmd + Enter to send · Do not include OTPs, PINs, or passwords.</span>
            <button type="submit" className="primary-button" disabled={isThinking || !draft.trim()}>
              <Send size={17} aria-hidden="true" />
              Send
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}
