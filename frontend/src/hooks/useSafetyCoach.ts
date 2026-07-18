import { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { askSafetyCoach } from "../services/chatService";

export type ChatRole = "user" | "assistant";

export interface SafetyCoachMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

const DEFAULT_ERROR_MESSAGE = "Unable to reach the Safety Coach. Please try again.";

export function useSafetyCoach() {
  const [messages, setMessages] = useState<SafetyCoachMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const activeRequestRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    const normalizedMessage = message.trim();
    if (!normalizedMessage || activeRequestRef.current) {
      return false;
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;
    setErrorMessage("");
    setIsThinking(true);
    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage("user", normalizedMessage)
    ]);

    try {
      const response = await askSafetyCoach(normalizedMessage, controller.signal);
      if (!response.answer?.trim()) {
        throw new Error("The Safety Coach returned an empty response");
      }

      if (activeRequestRef.current === controller) {
        setMessages((currentMessages) => [
          ...currentMessages,
          createMessage("assistant", response.answer.trim())
        ]);
      }
      return true;
    } catch (error) {
      const wasCancelled = error instanceof AxiosError && error.code === "ERR_CANCELED";
      if (activeRequestRef.current === controller && !wasCancelled) {
        const message = resolveErrorMessage(error);
        setErrorMessage(message);
        toast.error(message);
      }
      return false;
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setIsThinking(false);
      }
    }
  }, []);

  const clearSession = useCallback(() => {
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
    setMessages([]);
    setErrorMessage("");
    setIsThinking(false);
  }, []);

  useEffect(() => {
    return () => {
      activeRequestRef.current?.abort();
    };
  }, []);

  return {
    messages,
    isThinking,
    errorMessage,
    sendMessage,
    clearSession
  };
}

function createMessage(role: ChatRole, content: string): SafetyCoachMessage {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    role,
    content,
    createdAt: new Date().toISOString()
  };
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const responseMessage = error.response?.data?.message;
    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }
    if (error.code === "ECONNABORTED") {
      return "The Safety Coach took too long to respond. Please try again.";
    }
    if (!error.response) {
      return "Network connection unavailable. Please check your connection and try again.";
    }
  }

  return DEFAULT_ERROR_MESSAGE;
}
