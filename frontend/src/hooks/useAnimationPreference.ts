import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "scamshield-animations-enabled";

export function useAnimationPreference() {
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    return window.localStorage.getItem(STORAGE_KEY) !== "false";
  });

  useEffect(() => {
    document.documentElement.dataset.animations = animationsEnabled ? "enabled" : "reduced";
    window.localStorage.setItem(STORAGE_KEY, String(animationsEnabled));
  }, [animationsEnabled]);

  const updateAnimationsEnabled = useCallback((enabled: boolean) => {
    setAnimationsEnabled(enabled);
  }, []);

  return {
    animationsEnabled,
    setAnimationsEnabled: updateAnimationsEnabled
  };
}
