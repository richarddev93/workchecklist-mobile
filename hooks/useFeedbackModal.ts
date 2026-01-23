import { getRemoteConfigValue } from "@/lib/remoteConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const FEEDBACK_SHOWN_KEY = "feedback_modal_shown";
const COMPLETED_SERVICES_KEY = "completed_services_count";

export interface UseFeedbackModalResult {
  showFeedbackModal: boolean;
  setShowFeedbackModal: (value: boolean) => void;
  incrementCompletedServices: () => Promise<void>;
  submitFeedback: (feedback: string | null) => Promise<void>;
  reset: () => Promise<void>;
}

export function useFeedbackModal(): UseFeedbackModalResult {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);
  const [triggerThreshold, setTriggerThreshold] = useState(3);

  // Load remote config values on mount
  useEffect(() => {
    (async () => {
      const enabled = await getRemoteConfigValue("feedback_enabled");
      const trigger = await getRemoteConfigValue("feedback_trigger_services");
      setFeedbackEnabled(enabled);
      setTriggerThreshold(trigger);

      // Load completed count
      const stored = await AsyncStorage.getItem(COMPLETED_SERVICES_KEY);
      const count = stored ? parseInt(stored, 10) : 0;
      setCompletedCount(count);
    })();
  }, []);

  const incrementCompletedServices = useCallback(async () => {
    if (!feedbackEnabled) return;

    const alreadyShown = await AsyncStorage.getItem(FEEDBACK_SHOWN_KEY);
    if (alreadyShown === "true") return; // Already shown once

    const newCount = completedCount + 1;
    setCompletedCount(newCount);

    // Save to storage
    await AsyncStorage.setItem(COMPLETED_SERVICES_KEY, String(newCount));

    // Check if threshold reached
    if (newCount >= triggerThreshold && !alreadyShown) {
      setShowFeedbackModal(true);
    }
  }, [completedCount, feedbackEnabled, triggerThreshold]);

  const submitFeedback = useCallback(async (feedback: string | null) => {
    // Mark as shown so it doesn't show again
    await AsyncStorage.setItem(FEEDBACK_SHOWN_KEY, "true");

    // TODO: Call API to save feedback when ready
    // For now, just log
    if (feedback) {
      console.log("[feedback]", feedback);
    } else {
      console.log("[feedback] User clicked yes, no feedback text");
    }
  }, []);

  const reset = useCallback(async () => {
    // For testing: reset feedback shown flag
    await AsyncStorage.removeItem(FEEDBACK_SHOWN_KEY);
    await AsyncStorage.removeItem(COMPLETED_SERVICES_KEY);
    setCompletedCount(0);
    setShowFeedbackModal(false);
  }, []);

  return {
    showFeedbackModal,
    setShowFeedbackModal,
    incrementCompletedServices,
    submitFeedback,
    reset,
  };
}
