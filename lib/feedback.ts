import { Platform } from "react-native";
import pkg from "../package.json";

export type FeedbackPayload = {
  liked: boolean;
  app_name: string;
  message?: string;
  email?: string;
  name?: string;
  rating?: number;
};

const FEEDBACK_ENDPOINT = "https://SEU-PROJETO.functions.supabase.co/feedback";

export async function sendFeedback(payload: FeedbackPayload): Promise<void> {
  try {
    const response = await fetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "melcatlabs-mobile-2026",
        "x-device": Platform.OS,
        "x-app-version": pkg.version ?? "1.0.0",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Feedback request failed: ${response.status}`);
    }
  } catch (error) {
    console.error("[feedback] sendFeedback failed", error);
    throw error;
  }
}
