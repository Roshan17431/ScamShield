export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorDetails {
  code: string;
  details: string[];
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
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

export type AdvancedRiskLevel = ScamRiskLevel | "SAFE";

export type ThreatSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ThreatIndicator {
  label: string;
  severity: ThreatSeverity;
}

export interface AdvancedDetectionResponse {
  securityScore: number;
  riskLevel: AdvancedRiskLevel;
  category: string;
  confidence: number;
  summary: string;
  explanation: string;
  recommendation: string;
  threatIndicators: ThreatIndicator[];
}

export interface UrlAnalysisRequest {
  url: string;
}

export interface UrlAnalysisResponse extends AdvancedDetectionResponse {
  analyzedUrls: string[];
  safe: boolean;
  reasons: string[];
}

export interface EmailAnalysisRequest {
  sender: string;
  subject: string;
  body: string;
}

export interface EmailAnalysisResponse extends AdvancedDetectionResponse {
  redFlags: string[];
}

export interface JobScamRequest {
  message: string;
}

export interface JobScamResponse extends AdvancedDetectionResponse {
  redFlags: string[];
}

export type AdvancedDetectionResult = UrlAnalysisResponse | EmailAnalysisResponse | JobScamResponse;
