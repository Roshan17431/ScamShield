import { FileText, Trash2 } from "lucide-react";

interface TextInputCardProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function TextInputCard({ value, disabled, onChange, onClear }: TextInputCardProps) {
  return (
    <section id="message" className="glass-card p-5 sm:p-6" aria-labelledby="message-title">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="section-kicker">Suspicious Message</p>
          <h2 id="message-title" className="text-2xl font-semibold text-[color:var(--text)]">
            Paste text
          </h2>
        </div>
        <span className="panel-icon" aria-hidden="true">
          <FileText size={21} />
        </span>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-area min-h-80"
        placeholder="Paste suspicious SMS, Email, WhatsApp message, Telegram message, or social media message here..."
        aria-label="Suspicious message text"
        disabled={disabled}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-[color:var(--muted)]">{value.length.toLocaleString()} characters</span>
        <button type="button" className="ghost-button" onClick={onClear} disabled={!value || disabled}>
          <Trash2 size={17} aria-hidden="true" />
          Clear
        </button>
      </div>
    </section>
  );
}
