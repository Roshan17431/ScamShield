import { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAnalysisHistory } from "../contexts/AnalysisHistoryContext";
import { analyzeScamText } from "../services/scamAnalysisService";
import type { ScamAnalysisResponse } from "../types/api";

const ANALYSIS_ERROR_MESSAGE = "Unable to analyze the message. Please try again.";

export function useScamAnalysis() {
  const { addAnalysis } = useAnalysisHistory();
  const [analysis, setAnalysis] = useState<ScamAnalysisResponse | null>(null);
  const [analyzedText, setAnalyzedText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const activeRequestRef = useRef<AbortController | null>(null);

  const clearAnalysis = useCallback(() => {
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
    setAnalysis(null);
    setAnalyzedText("");
    setErrorMessage("");
    setIsAnalyzing(false);
  }, []);

  const analyzeText = useCallback(async (text: string) => {
    const normalizedText = text.trim();
    if (!normalizedText || activeRequestRef.current) {
      return;
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;
    setAnalysis(null);
    setAnalyzedText("");
    setIsAnalyzing(true);
    setErrorMessage("");

    try {
      const result = await analyzeScamText(normalizedText, controller.signal);
      if (activeRequestRef.current === controller) {
        setAnalysis(result);
        setAnalyzedText(normalizedText);
        addAnalysis({
          source: "Message analysis",
          category: result.category,
          riskLevel: result.riskLevel,
          securityScore: 100 - result.scamProbability,
          summary: result.summary
        });
      }
    } catch (error) {
      const wasCancelled = error instanceof AxiosError && error.code === "ERR_CANCELED";
      if (activeRequestRef.current === controller && !wasCancelled) {
        setAnalysis(null);
        setAnalyzedText("");
        setErrorMessage(ANALYSIS_ERROR_MESSAGE);
        toast.error(ANALYSIS_ERROR_MESSAGE);
      }
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setIsAnalyzing(false);
      }
    }
  }, [addAnalysis]);

  useEffect(() => {
    return () => {
      activeRequestRef.current?.abort();
    };
  }, []);

  return {
    analysis,
    analyzedText,
    isAnalyzing,
    errorMessage,
    analyzeText,
    clearAnalysis
  };
}
