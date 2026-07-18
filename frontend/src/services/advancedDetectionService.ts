import { apiClient } from "./apiClient";
import type {
  ApiResponse,
  EmailAnalysisRequest,
  EmailAnalysisResponse,
  JobScamRequest,
  JobScamResponse,
  UrlAnalysisRequest,
  UrlAnalysisResponse
} from "../types/api";

export async function analyzeUrl(
  payload: UrlAnalysisRequest,
  signal?: AbortSignal
): Promise<UrlAnalysisResponse> {
  const response = await apiClient.post<ApiResponse<UrlAnalysisResponse>>(
    "/api/v1/scam/url-analysis",
    payload,
    { signal }
  );

  return response.data.data;
}

export async function analyzeEmail(
  payload: EmailAnalysisRequest,
  signal?: AbortSignal
): Promise<EmailAnalysisResponse> {
  const response = await apiClient.post<ApiResponse<EmailAnalysisResponse>>(
    "/api/v1/scam/email-analysis",
    payload,
    { signal }
  );

  return response.data.data;
}

export async function analyzeJobOffer(
  payload: JobScamRequest,
  signal?: AbortSignal
): Promise<JobScamResponse> {
  const response = await apiClient.post<ApiResponse<JobScamResponse>>(
    "/api/v1/scam/job-analysis",
    payload,
    { signal }
  );

  return response.data.data;
}
