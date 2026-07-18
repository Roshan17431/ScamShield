import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import OcrResultCard from "../components/OcrResultCard";
import ProtectionCenter from "../components/ProtectionCenter";
import ScamAnalysisCard, { type AnalysisSource } from "../components/ScamAnalysisCard";
import ScamReportCard from "../components/ScamReportCard";
import TextInputCard from "../components/TextInputCard";
import UploadCard from "../components/UploadCard";
import { useImageUpload } from "../hooks/useImageUpload";
import { useProtectionAdvice } from "../hooks/useProtectionAdvice";
import { useScamAnalysis } from "../hooks/useScamAnalysis";
import { useTextExtraction } from "../hooks/useTextExtraction";

export default function HomePage() {
  const [messageText, setMessageText] = useState("");
  const [analysisSource, setAnalysisSource] = useState<AnalysisSource>("pasted");
  const imageUpload = useImageUpload();
  const textExtraction = useTextExtraction();
  const scamAnalysis = useScamAnalysis();
  const protectionAdvice = useProtectionAdvice();
  const protectionRequest = useMemo(() => {
    if (!scamAnalysis.analysis || !scamAnalysis.analyzedText) {
      return null;
    }

    return {
      message: scamAnalysis.analyzedText,
      riskLevel: scamAnalysis.analysis.riskLevel,
      category: scamAnalysis.analysis.category,
      redFlags: scamAnalysis.analysis.redFlags
    };
  }, [scamAnalysis.analysis, scamAnalysis.analyzedText]);

  useEffect(() => {
    if (!protectionRequest) {
      protectionAdvice.clearProtectionAdvice();
      return;
    }

    void protectionAdvice.requestProtectionAdvice(protectionRequest);
  }, [
    protectionAdvice.clearProtectionAdvice,
    protectionAdvice.requestProtectionAdvice,
    protectionRequest
  ]);

  async function handleExtractText() {
    if (!imageUpload.file) {
      toast.error("Upload a screenshot first");
      return;
    }

    const wasExtracted = await textExtraction.extractFromImage(imageUpload.file);
    if (wasExtracted) {
      setAnalysisSource("extracted");
      scamAnalysis.clearAnalysis();
    }
  }

  function handleMessageChange(value: string) {
    setMessageText(value);
    if (analysisSource === "pasted") {
      scamAnalysis.clearAnalysis();
    }
  }

  function handleExtractedTextChange(value: string) {
    textExtraction.setExtractedText(value);
    if (analysisSource === "extracted") {
      scamAnalysis.clearAnalysis();
    }
  }

  function handleSourceChange(source: AnalysisSource) {
    if (source !== analysisSource) {
      setAnalysisSource(source);
      scamAnalysis.clearAnalysis();
    }
  }

  function clearMessageText() {
    setMessageText("");
    if (analysisSource === "pasted") {
      scamAnalysis.clearAnalysis();
    }
  }

  function clearExtractedText() {
    textExtraction.clearExtractedText();
    if (analysisSource === "extracted") {
      scamAnalysis.clearAnalysis();
    }
  }

  function handleRegenerateProtection() {
    if (protectionRequest) {
      void protectionAdvice.requestProtectionAdvice(protectionRequest);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        className="mb-8 max-w-3xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <p className="section-kicker">ScamShield AI Workspace</p>
        <h1 className="mt-3 text-4xl font-semibold text-[color:var(--text)] sm:text-5xl">
          Understand suspicious messages before you act.
        </h1>
        <p className="mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg">
          Extract text from a suspicious screenshot or paste a message, then receive a clear AI-powered risk assessment.
        </p>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2">
        <UploadCard
          file={imageUpload.file}
          previewUrl={imageUpload.previewUrl}
          error={imageUpload.error}
          isExtracting={textExtraction.isExtracting}
          disabled={scamAnalysis.isAnalyzing}
          onSelectFile={imageUpload.setImageFile}
          onRemoveImage={imageUpload.removeImage}
          onExtractText={() => void handleExtractText()}
        />
        <TextInputCard
          value={messageText}
          disabled={scamAnalysis.isAnalyzing}
          onChange={handleMessageChange}
          onClear={clearMessageText}
        />
      </div>

      <div className="mt-5">
        <OcrResultCard
          value={textExtraction.extractedText}
          disabled={scamAnalysis.isAnalyzing}
          onChange={handleExtractedTextChange}
          onClear={clearExtractedText}
        />
      </div>

      <div className="mt-5">
        <ScamAnalysisCard
          extractedText={textExtraction.extractedText}
          pastedText={messageText}
          selectedSource={analysisSource}
          analysis={scamAnalysis.analysis}
          isAnalyzing={scamAnalysis.isAnalyzing}
          errorMessage={scamAnalysis.errorMessage}
          onSelectSource={handleSourceChange}
          onAnalyze={scamAnalysis.analyzeText}
        />
      </div>

      {scamAnalysis.analysis ? (
        <div className="mt-5">
          <ProtectionCenter
            protection={protectionAdvice.protection}
            isGenerating={protectionAdvice.isGenerating}
            errorMessage={protectionAdvice.errorMessage}
            onRegenerate={handleRegenerateProtection}
          />
        </div>
      ) : null}

      {scamAnalysis.analysis && protectionAdvice.protection ? (
        <div className="mt-5">
          <ScamReportCard
            analysis={scamAnalysis.analysis}
            protection={protectionAdvice.protection}
          />
        </div>
      ) : null}
    </section>
  );
}
