import { useState } from "react";
import toast from "react-hot-toast";
import { extractTextFromImage } from "../services/textExtractionService";

export function useTextExtraction() {
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  async function extractFromImage(image: File): Promise<boolean> {
    setIsExtracting(true);

    try {
      const result = await extractTextFromImage(image);
      setExtractedText(result.extractedText);
      toast.success("Text extracted successfully");
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Text extraction failed";
      toast.error(message);
      return false;
    } finally {
      setIsExtracting(false);
    }
  }

  function clearExtractedText() {
    setExtractedText("");
  }

  return {
    extractedText,
    setExtractedText,
    isExtracting,
    extractFromImage,
    clearExtractedText
  };
}
