import { apiClient } from "./apiClient";
import type { ApiResponse, ProtectionRequest, ProtectionResponse } from "../types/api";

export async function generateProtectionAdvice(
  payload: ProtectionRequest,
  signal?: AbortSignal
): Promise<ProtectionResponse> {
  const response = await apiClient.post<ApiResponse<ProtectionResponse>>(
    "/api/v1/scam/protection",
    payload,
    { signal }
  );

  return response.data.data;
}
