import {
  getAnalytics,
  logEvent,
} from "@react-native-firebase/analytics";

let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;

try {
  analyticsInstance = getAnalytics();
} catch (err) {
  console.warn("[analytics] Native module not available", err);
}

async function trackEvent(event: string, params?: Record<string, any>) {
  if (!analyticsInstance) {
    console.log(`[analytics] skipped (no native module): ${event}`);
    return;
  }
  try {
    await logEvent(analyticsInstance, event, params);
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
