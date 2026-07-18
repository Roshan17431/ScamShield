import { motion } from "framer-motion";
import { CheckCircle, FileText, Image, Lock, ScanText } from "lucide-react";

const features = [
  {
    title: "Screenshot Upload",
    description: "Accepts PNG, JPG, and JPEG images up to 10 MB with client-side validation.",
    icon: Image
  },
  {
    title: "OpenAI Vision OCR",
    description: "Uses the Responses API with vision input to extract visible screenshot text.",
    icon: ScanText
  },
  {
    title: "Editable Extracted Text",
    description: "Keeps extracted content editable so users can refine text before future analysis.",
    icon: FileText
  },
  {
    title: "Privacy Focused",
    description: "Keeps API keys on the backend and avoids hardcoded credentials in the app.",
    icon: Lock
  }
];

export default function FeatureCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="features-title">
      <div className="mb-8 flex items-center gap-3">
        <span className="brand-mark brand-mark-small" aria-hidden="true">
          <CheckCircle size={16} />
        </span>
        <h2 id="features-title" className="text-2xl font-semibold text-[color:var(--text)]">
          Phase 1 Foundation
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.article
              key={feature.title}
              className="glass-card p-5"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.45, ease: "easeOut" }}
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--accent)]">
                <Icon size={21} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--text)]">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{feature.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
