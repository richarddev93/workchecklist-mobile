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

const FEEDBACK_ENDPOINT =
  process.env.EXPO_PUBLIC_FEEDBACK_URL ??
  "https://psznycipgrptvwhkvkbr.supabase.co/functions/v1/feedback";
const FEEDBACK_API_KEY =
  process.env.EXPO_PUBLIC_FEEDBACK_API_KEY ?? "melcatlabs-mobile-2026";

export async function sendFeedback(payload: FeedbackPayload): Promise<void> {
  try {
    const response = await fetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": FEEDBACK_API_KEY,
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
