import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { ApiErrorDetails, ApiResponse, ExtractTextResponse } from "../types/api";

export async function extractTextFromImage(image: File): Promise<ExtractTextResponse> {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await apiClient.post<ApiResponse<ExtractTextResponse>>(
      "/api/v1/ai/extract-text",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data.data;
  } catch (error) {
    throw new Error(resolveApiErrorMessage(error));
  }
}

function resolveApiErrorMessage(error: unknown): string {
  if (!(error instanceof AxiosError)) {
    return "Text extraction failed. Please try again.";
  }

  const responseData = error.response?.data as ApiResponse<ApiErrorDetails> | undefined;
  const detail = responseData?.data?.details?.[0];
  return detail ?? responseData?.message ?? "Text extraction failed. Please try again.";
}
