import { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { generateProtectionAdvice } from "../services/protectionService";
import type { ProtectionRequest, ProtectionResponse } from "../types/api";

const PROTECTION_ERROR_MESSAGE = "Unable to generate protection advice. Please try again.";

export function useProtectionAdvice() {
  const [protection, setProtection] = useState<ProtectionResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const activeRequestRef = useRef<AbortController | null>(null);

  const clearProtectionAdvice = useCallback(() => {
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
    setProtection(null);
    setErrorMessage("");
    setIsGenerating(false);
  }, []);

  const requestProtectionAdvice = useCallback(async (payload: ProtectionRequest) => {
    if (activeRequestRef.current) {
      return;
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;
    setProtection(null);
    setIsGenerating(true);
    setErrorMessage("");

    try {
      const result = await generateProtectionAdvice(payload, controller.signal);
      if (activeRequestRef.current === controller) {
        setProtection(result);
      }
    } catch (error) {
      const wasCancelled = error instanceof AxiosError && error.code === "ERR_CANCELED";
      if (activeRequestRef.current === controller && !wasCancelled) {
        setErrorMessage(PROTECTION_ERROR_MESSAGE);
        toast.error(PROTECTION_ERROR_MESSAGE);
      }
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setIsGenerating(false);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      activeRequestRef.current?.abort();
    };
  }, []);

  return {
    protection,
    isGenerating,
    errorMessage,
    requestProtectionAdvice,
    clearProtectionAdvice
  };
}
