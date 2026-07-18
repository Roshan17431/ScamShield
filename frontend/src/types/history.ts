import type { AdvancedRiskLevel } from "./api";

export type AnalysisSource =
  | "Message analysis"
  | "URL safety scan"
  | "Email scan"
  | "Job offer scan";

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  source: AnalysisSource;
  category: string;
  riskLevel: AdvancedRiskLevel;
  securityScore: number;
  summary: string;
}

export type AnalysisHistoryInput = Omit<AnalysisHistoryItem, "id" | "timestamp">;
