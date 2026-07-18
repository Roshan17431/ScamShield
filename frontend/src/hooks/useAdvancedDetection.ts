import { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAnalysisHistory } from "../contexts/AnalysisHistoryContext";
import {
  analyzeEmail,
  analyzeJobOffer,
  analyzeUrl
} from "../services/advancedDetectionService";
import type {
  AdvancedDetectionResult,
  EmailAnalysisRequest,
  JobScamRequest,
  UrlAnalysisRequest
} from "../types/api";
import type { AnalysisSource } from "../types/history";

const DEFAULT_ERROR_MESSAGE = "Unable to complete advanced detection. Please try again.";

type DetectionRequest = (signal: AbortSignal) => Promise<AdvancedDetectionResult>;

export function useAdvancedDetection() {
  const { addAnalysis } = useAnalysisHistory();
  const [result, setResult] = useState<AdvancedDetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const activeRequestRef = useRef<AbortController | null>(null);

  const clearDetection = useCallback(() => {
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
    setResult(null);
    setErrorMessage("");
    setIsAnalyzing(false);
  }, []);

  const executeDetection = useCallback(async (source: AnalysisSource, request: DetectionRequest) => {
    if (activeRequestRef.current) {
      return;
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;
    setResult(null);
    setErrorMessage("");
    setIsAnalyzing(true);

    try {
      const response = await request(controller.signal);
      if (activeRequestRef.current === controller) {
        setResult(response);
        addAnalysis({
          source,
          category: response.category,
          riskLevel: response.riskLevel,
          securityScore: response.securityScore,
          summary: response.summary
        });
      }
    } catch (error) {
      const wasCancelled = error instanceof AxiosError && error.code === "ERR_CANCELED";
      if (activeRequestRef.current === controller && !wasCancelled) {
        const message = resolveErrorMessage(error);
        setErrorMessage(message);
        toast.error(message);
      }
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setIsAnalyzing(false);
      }
    }
  }, [addAnalysis]);

  const runUrlAnalysis = useCallback(
    async (payload: UrlAnalysisRequest) => executeDetection(
      "URL safety scan",
      (signal) => analyzeUrl(payload, signal)
    ),
    [executeDetection]
  );

  const runEmailAnalysis = useCallback(
    async (payload: EmailAnalysisRequest) => executeDetection(
      "Email scan",
      (signal) => analyzeEmail(payload, signal)
    ),
    [executeDetection]
  );

  const runJobAnalysis = useCallback(
    async (payload: JobScamRequest) => executeDetection(
      "Job offer scan",
      (signal) => analyzeJobOffer(payload, signal)
    ),
    [executeDetection]
  );

  useEffect(() => {
    return () => {
      activeRequestRef.current?.abort();
    };
  }, []);

  return {
    result,
    isAnalyzing,
    errorMessage,
    runUrlAnalysis,
    runEmailAnalysis,
    runJobAnalysis,
    clearDetection
  };
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const responseMessage = error.response?.data?.message;
    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }
    if (error.code === "ECONNABORTED") {
      return "The advanced scan timed out. Please try again.";
    }
    if (!error.response) {
      return "Network connection unavailable. Please check your connection and try again.";
    }
  }

  return DEFAULT_ERROR_MESSAGE;
}
