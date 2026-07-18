import { apiClient } from "./apiClient";
import type { ApiResponse, ChatResponse } from "../types/api";

export async function askSafetyCoach(message: string, signal?: AbortSignal): Promise<ChatResponse> {
  const response = await apiClient.post<ApiResponse<ChatResponse>>(
    "/api/v1/chat",
    { message },
    { signal }
  );

  return response.data.data;
}
