import { motion } from "framer-motion";
import { FileText, Sparkles, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/scamshield-hero.png";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={heroImage} alt="" className="hero-image" loading="eager" />
        <div className="hero-overlay" />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="eyebrow mb-5 inline-flex items-center gap-2">
            <Sparkles size={16} aria-hidden="true" />
            OpenAI Vision OCR
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-[color:var(--text)] sm:text-6xl lg:text-7xl">
            ScamShield AI
          </h1>
          <p className="mt-5 max-w-2xl text-2xl font-medium leading-snug text-[color:var(--text)] sm:text-3xl">
            Think Before You Click.
            <br />
            Verify Before You Trust.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
            Upload suspicious screenshots or paste suspicious messages. OpenAI Vision extracts the text with high
            accuracy, preparing it for AI-powered scam detection.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/app#upload" className="primary-button">
              <Upload size={18} aria-hidden="true" />
              Upload Screenshot
            </Link>
            <Link to="/app#message" className="secondary-button">
              <FileText size={18} aria-hidden="true" />
              Paste Message
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
