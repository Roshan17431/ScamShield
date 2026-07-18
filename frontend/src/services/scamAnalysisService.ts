import { apiClient } from "./apiClient";
import type { ApiResponse, ScamAnalysisResponse } from "../types/api";

export async function analyzeScamText(text: string, signal?: AbortSignal): Promise<ScamAnalysisResponse> {
  const response = await apiClient.post<ApiResponse<ScamAnalysisResponse>>(
    "/api/v1/scam/analyze",
    { text },
    { signal }
  );

  return response.data.data;
}
