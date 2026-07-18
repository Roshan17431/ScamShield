import toast from "react-hot-toast";
import { Copy, ScanText, Trash2 } from "lucide-react";

interface OcrResultCardProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function OcrResultCard({ value, disabled, onChange, onClear }: OcrResultCardProps) {
  async function copyText() {
    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
    toast.success("Extracted text copied");
  }

  return (
    <section className="glass-card p-5 sm:p-6" aria-labelledby="ocr-result-title">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="section-kicker">OpenAI Vision Result</p>
          <h2 id="ocr-result-title" className="text-2xl font-semibold text-[color:var(--text)]">
            Extracted Text
          </h2>
        </div>
        <span className="panel-icon" aria-hidden="true">
          <ScanText size={21} />
        </span>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-area min-h-64"
        placeholder="Extracted screenshot text will appear here."
        aria-label="Extracted text"
        disabled={disabled}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-[color:var(--muted)]">{value.length.toLocaleString()} characters</span>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="secondary-button" onClick={copyText} disabled={!value || disabled}>
            <Copy size={17} aria-hidden="true" />
            Copy
          </button>
          <button type="button" className="ghost-button" onClick={onClear} disabled={!value || disabled}>
            <Trash2 size={17} aria-hidden="true" />
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}
