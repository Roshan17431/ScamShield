import toast from "react-hot-toast";
import { Info, Monitor, Moon, ShieldCheck, Sparkles, Sun, Trash2 } from "lucide-react";
import { useAnalysisHistory } from "../contexts/AnalysisHistoryContext";
import { useAppPreferences } from "../contexts/AppPreferencesContext";
import type { ThemePreference } from "../hooks/useTheme";

const THEME_OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  description: string;
  icon: typeof Sun;
}> = [
  { value: "light", label: "Light mode", description: "Use a bright, high-contrast workspace.", icon: Sun },
  { value: "dark", label: "Dark mode", description: "Use ScamShield’s dark protective theme.", icon: Moon },
  { value: "system", label: "System theme", description: "Match this device’s color preference.", icon: Monitor }
];

export default function SettingsPage() {
  const {
    themePreference,
    setThemePreference,
    animationsEnabled,
    setAnimationsEnabled
  } = useAppPreferences();
  const { history, clearHistory } = useAnalysisHistory();

  function handleClearHistory() {
    if (!history.length || !window.confirm("Clear all locally saved analysis history from this browser?")) {
      return;
    }

    clearHistory();
    toast.success("Analysis history cleared");
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="section-kicker">Settings</p>
        <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)] sm:text-5xl">
          Make ScamShield AI fit your workspace.
        </h1>
        <p className="mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg">
          These preferences and analysis records stay in this browser. No account is required.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <section className="glass-card p-5 sm:p-6" aria-labelledby="theme-settings-title">
          <div className="flex items-center gap-3">
            <span className="settings-section-icon" aria-hidden="true"><Sun size={20} /></span>
            <div>
              <p className="section-kicker">Appearance</p>
              <h2 id="theme-settings-title" className="mt-1 text-xl font-semibold text-[color:var(--text)]">Color theme</h2>
            </div>
          </div>
          <div className="settings-choice-grid mt-6">
            {THEME_OPTIONS.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                type="button"
                className="settings-choice"
                data-selected={themePreference === value}
                aria-pressed={themePreference === value}
                onClick={() => setThemePreference(value)}
              >
                <Icon size={20} aria-hidden="true" />
                <span>
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="glass-card p-5 sm:p-6" aria-labelledby="motion-settings-title">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="settings-section-icon" aria-hidden="true"><Sparkles size={20} /></span>
              <div>
                <p className="section-kicker">Motion</p>
                <h2 id="motion-settings-title" className="mt-1 text-xl font-semibold text-[color:var(--text)]">Interface animations</h2>
                <p className="mt-2 text-sm text-[color:var(--muted)]">Turn off non-essential motion for a quieter experience.</p>
              </div>
            </div>
            <label className="settings-toggle" aria-label="Enable interface animations">
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={(event) => setAnimationsEnabled(event.target.checked)}
              />
              <span aria-hidden="true" />
            </label>
          </div>
        </section>

        <section className="glass-card p-5 sm:p-6" aria-labelledby="history-settings-title">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="settings-section-icon" aria-hidden="true"><Trash2 size={20} /></span>
              <div>
                <p className="section-kicker">Privacy</p>
                <h2 id="history-settings-title" className="mt-1 text-xl font-semibold text-[color:var(--text)]">Local analysis history</h2>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{history.length} saved {history.length === 1 ? "analysis" : "analyses"} in this browser.</p>
              </div>
            </div>
            <button type="button" className="secondary-button self-start" onClick={handleClearHistory} disabled={!history.length}>
              <Trash2 size={17} aria-hidden="true" />
              Clear history
            </button>
          </div>
        </section>

        <section className="glass-card p-5 sm:p-6" aria-labelledby="about-settings-title">
          <div className="flex items-start gap-3">
            <span className="settings-section-icon" aria-hidden="true"><Info size={20} /></span>
            <div>
              <p className="section-kicker">About</p>
              <h2 id="about-settings-title" className="mt-1 text-xl font-semibold text-[color:var(--text)]">ScamShield AI</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                Version 0.1.0 · AI-assisted awareness and analysis tools designed to help people pause, verify, and take safer next steps.
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-[color:var(--accent)]">
                <ShieldCheck size={17} aria-hidden="true" /> Keep credentials, OTPs, PINs, and private keys out of messages.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
