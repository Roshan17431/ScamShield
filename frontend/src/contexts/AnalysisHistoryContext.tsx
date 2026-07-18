import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AdvancedRiskLevel } from "../types/api";
import type { AnalysisHistoryInput, AnalysisHistoryItem } from "../types/history";

const STORAGE_KEY = "scamshield-analysis-history";
const MAX_HISTORY_ITEMS = 150;
const RISK_LEVELS: AdvancedRiskLevel[] = ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

interface AnalysisHistoryContextValue {
  history: AnalysisHistoryItem[];
  addAnalysis: (analysis: AnalysisHistoryInput) => void;
  deleteAnalysis: (id: string) => void;
  clearHistory: () => void;
}

const AnalysisHistoryContext = createContext<AnalysisHistoryContextValue | null>(null);

export function AnalysisHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>(readStoredHistory);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {}
  }, [history]);

  const addAnalysis = useCallback((analysis: AnalysisHistoryInput) => {
    const item: AnalysisHistoryItem = {
      ...analysis,
      id: createHistoryId(),
      timestamp: new Date().toISOString(),
      securityScore: Math.min(100, Math.max(0, Math.round(analysis.securityScore)))
    };

    setHistory((currentHistory) => [item, ...currentHistory].slice(0, MAX_HISTORY_ITEMS));
  }, []);

  const deleteAnalysis = useCallback((id: string) => {
    setHistory((currentHistory) => currentHistory.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const value = useMemo(
    () => ({ history, addAnalysis, deleteAnalysis, clearHistory }),
    [history, addAnalysis, deleteAnalysis, clearHistory]
  );

  return <AnalysisHistoryContext.Provider value={value}>{children}</AnalysisHistoryContext.Provider>;
}

export function useAnalysisHistory() {
  const context = useContext(AnalysisHistoryContext);
  if (!context) {
    throw new Error("useAnalysisHistory must be used inside AnalysisHistoryProvider");
  }

  return context;
}

function readStoredHistory(): AnalysisHistoryItem[] {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isHistoryItem).slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

function isHistoryItem(value: unknown): value is AnalysisHistoryItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AnalysisHistoryItem>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.timestamp === "string" &&
    typeof candidate.source === "string" &&
    typeof candidate.category === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.securityScore === "number" &&
    typeof candidate.riskLevel === "string" &&
    RISK_LEVELS.includes(candidate.riskLevel as AdvancedRiskLevel)
  );
}

function createHistoryId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
