export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorDetails {
  code: string;
  details: string[];
}

export interface ExtractTextResponse {
  extractedText: string;
}

export type ScamRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ScamAnalysisRequest {
  text: string;
}

export interface ScamAnalysisResponse {
  riskLevel: ScamRiskLevel;
  scamProbability: number;
  confidence: number;
  category: string;
  summary: string;
  explanation: string;
  redFlags: string[];
}

export interface ProtectionRequest {
  message: string;
  riskLevel: ScamRiskLevel;
  category: string;
  redFlags: string[];
}

export interface ScamReportResponse {
  riskLevel: ScamRiskLevel;
  category: string;
  redFlags: string[];
  recommendedActions: string[];
  preventionTips: string[];
  generatedAt: string;
}

export interface ProtectionResponse {
  recommendedActions: string[];
  safeReply: string;
  preventionTips: string[];
  similarScams: string[];
  report: ScamReportResponse;
}

export interface GeneratedScamReport {
  analysis: ScamAnalysisResponse;
  report: ScamReportResponse;
}
