import {
    Analytics,
    getAnalytics,
    isSupported,
    logEvent,
} from "firebase/analytics";
import { firebaseApp } from "./firebase";

// Lazy singleton with platform support guard (web-only). On native, events are silently skipped.
let analyticsInstance: Analytics | null = null;
let analyticsReady: Promise<Analytics | null> | null = null;

async function getAnalyticsSafe(): Promise<Analytics | null> {
  if (analyticsInstance) return analyticsInstance;
  if (!analyticsReady) {
    analyticsReady = (async () => {
      try {
        const supported = await isSupported();
        if (!supported) return null;
        analyticsInstance = getAnalytics(firebaseApp);
        return analyticsInstance;
      } catch (err) {
        console.warn("[analytics] not supported or failed to init", err);
        return null;
      }
    })();
  }
  return analyticsReady;
}

async function trackEvent(event: string, params?: Record<string, any>) {
  const instance = await getAnalyticsSafe();
  if (!instance) {
    console.log(`[analytics] skipped (not supported): ${event}`);
    return;
  }
  try {
    logEvent(instance, event, params);
    console.log(`[analytics] ✓ ${event}`, params);
  } catch (err) {
    console.warn(`[analytics] failed to log ${event}`, err);
  }
}

// Soft launch events
export type ServiceCreatedPayload = {
  serviceType: string;
  hasTemplate: boolean;
};
export type ChecklistStartedPayload = {
  templateId: string;
  isDefault: boolean;
};
export type ChecklistCompletedPayload = {
  totalItems: number;
  checkedItems: number;
};
export type ReportSharedPayload = { channel: "text" };
export type OfflineUsedPayload = { screen: string };
export type TemplateDuplicatedPayload = { fromDefault: boolean };

export const analyticsEvents = {
  serviceCreated: (payload: ServiceCreatedPayload) =>
    trackEvent("service_created", payload),
  checklistStarted: (payload: ChecklistStartedPayload) =>
    trackEvent("checklist_started", payload),
  checklistCompleted: (payload: ChecklistCompletedPayload) =>
    trackEvent("checklist_completed", payload),
  reportShared: (payload: ReportSharedPayload) =>
    trackEvent("report_shared", payload),
  offlineUsed: (payload: OfflineUsedPayload) =>
    trackEvent("offline_used", payload),
  templateDuplicated: (payload: TemplateDuplicatedPayload) =>
    trackEvent("template_duplicated", payload),
};

// Generic helper for future reuse
export const logAnalyticsEvent = trackEvent;
