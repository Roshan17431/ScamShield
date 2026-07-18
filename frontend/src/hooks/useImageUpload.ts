import { useCallback, useEffect, useState } from "react";
import { validateImageFile } from "../utils/fileValidation";
import type { ImageUploadState } from "../types/upload";

const initialState: ImageUploadState = {
  file: null,
  previewUrl: "",
  error: ""
};

export function useImageUpload() {
  const [state, setState] = useState<ImageUploadState>(initialState);

  const setImageFile = useCallback((file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setState((currentState) => ({
        ...currentState,
        error: validationError
      }));
      return false;
    }

    setState((currentState) => {
      if (currentState.previewUrl) {
        URL.revokeObjectURL(currentState.previewUrl);
      }

      return {
        file,
        previewUrl: URL.createObjectURL(file),
        error: ""
      };
    });
    return true;
  }, []);

  const removeImage = useCallback(() => {
    setState((currentState) => {
      if (currentState.previewUrl) {
        URL.revokeObjectURL(currentState.previewUrl);
      }

      return initialState;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
      }
    };
  }, [state.previewUrl]);

  return {
    ...state,
    setImageFile,
    removeImage
  };
}
