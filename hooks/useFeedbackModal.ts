import { sendFeedback } from "@/lib/feedback";
import { getRemoteConfigValue } from "@/lib/remoteConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    createElement,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

const FEEDBACK_SHOWN_KEY = "feedback_modal_shown";
const COMPLETED_SERVICES_KEY = "completed_services_count";

export interface UseFeedbackModalResult {
  showFeedbackModal: boolean;
  setShowFeedbackModal: (value: boolean) => void;
  incrementCompletedServices: () => Promise<void>;
  submitFeedback: (liked: boolean, feedback?: string | null) => Promise<void>;
  reset: () => Promise<void>;
}

const FeedbackContext = createContext<UseFeedbackModalResult | undefined>(
  undefined,
);

export function FeedbackProvider({ children }: { children: ReactNode }) {
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

  const submitFeedback = useCallback(
    async (liked: boolean, feedback?: string | null) => {
      // Mark as shown so it doesn't show again
      await AsyncStorage.setItem(FEEDBACK_SHOWN_KEY, "true");

      await sendFeedback({
        liked,
        app_name: "WorkCheckList",
        message: feedback || undefined,
      });
    },
    [],
  );

  const reset = useCallback(async () => {
    // For testing: reset feedback shown flag
    await AsyncStorage.removeItem(FEEDBACK_SHOWN_KEY);
    await AsyncStorage.removeItem(COMPLETED_SERVICES_KEY);
    setCompletedCount(0);
    setShowFeedbackModal(false);
  }, []);

  const value = useMemo(
    () => ({
      showFeedbackModal,
      setShowFeedbackModal,
      incrementCompletedServices,
      submitFeedback,
      reset,
    }),
    [showFeedbackModal, incrementCompletedServices, submitFeedback, reset],
  );

  return createElement(FeedbackContext.Provider, { value }, children);
}

export function useFeedbackModal(): UseFeedbackModalResult {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("useFeedbackModal must be used within FeedbackProvider");
  }

  return context;
}
