import { useConfig } from "@/context/ConfigContext";
import { useServices } from "@/core/services/context/ServiceContext";
import { ChecklistItem } from "@/types";
import { useEffect, useRef, useState } from "react";

export function useServiceChecklistViewModel(serviceId: string) {
  const { getServiceById, updateService } = useServices();
  const { templates } = useConfig();

  const service = getServiceById(serviceId);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const checklistLoadedRef = useRef(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);
  const pendingUpdateRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("useServiceChecklistViewModel - serviceId:", serviceId);
    console.log("useServiceChecklistViewModel - service found:", !!service);
    console.log("useServiceChecklistViewModel - service data:", service);
    console.log("useServiceChecklistViewModel - templates:", templates.length);
    
    if (!service) return;

    // If checklist was already loaded for this service, don't reload it
    if (checklistLoadedRef.current && checklist.length > 0) {
      return;
    }

    // If we already have checklist_data, parse and use it.
    if (service.checklist_data) {
      try {
        const parsed = JSON.parse(service.checklist_data) as ChecklistItem[];
        const loaded = parsed ?? [];
        setChecklist(loaded);
        checklistLoadedRef.current = true;
        return;
      } catch (e) {
        console.error("Error parsing checklist_data:", e);
        // fall through to template build
      }
    }

    // Build from template when checklist_data is empty or invalid.
    let built: ChecklistItem[] = [];
    if (service.template_id && templates.length > 0) {
      const tmpl = templates.find(
        (t) =>
          `${t.id}` === `${service.template_id}` ||
          t.name === service.template_id,
      );
      if (tmpl?.items) {
        built = tmpl.items.map((title, idx) => ({
          id: `${service.id}-item-${idx}`,
          title,
          completed: false,
        }));
      }
      console.log("Building checklist from template:", {
        template: tmpl?.name,
        items: built,
      });
    } else {
      console.log("No template found for:", {
        template_id: service.template_id,
        templates_available: templates.length,
      });
    }

    if (built.length > 0) {
      setChecklist(built);
      checklistLoadedRef.current = true;

      // Persist to DB if we built from template (not already in DB)
      if (!service.checklist_data) {
        updateService(serviceId, {
          checklist_data: JSON.stringify(built),
        }).catch((err) => console.error("Error saving checklist:", err));
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [service?.id, service?.template_id, templates, serviceId]);

  const completedItems = checklist.filter((i) => i.completed).length;
  const totalItems = checklist.length;

  const hasAnyCompleted = completedItems > 0;
  const allCompleted = totalItems > 0 && completedItems === totalItems;

  // Debounced update function to avoid multiple simultaneous updates
  const debouncedUpdateChecklist = async (updatedChecklist: ChecklistItem[]) => {
    // Clear any pending timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Store the latest checklist data
    const checklistData = JSON.stringify(updatedChecklist);
    pendingUpdateRef.current = checklistData;

    // Wait for 500ms before executing
    return new Promise<void>((resolve, reject) => {
      updateTimeoutRef.current = setTimeout(async () => {
        // Check if already updating
        if (isUpdatingRef.current) {
          console.log("Update already in progress, skipping...");
          resolve();
          return;
        }

        try {
          isUpdatingRef.current = true;
          const dataToUpdate = pendingUpdateRef.current;
          
          if (!dataToUpdate) {
            resolve();
            return;
          }

          console.log("Executing debounced update with data length:", dataToUpdate.length);
          
          await updateService(serviceId, {
            checklist_data: dataToUpdate,
          });
          
          pendingUpdateRef.current = null;
          console.log("Debounced update successful");
          resolve();
        } catch (error) {
          console.error("Debounced update failed:", error);
          reject(error);
        } finally {
          isUpdatingRef.current = false;
        }
      }, 500);
    });
  };

  async function toggleItem(itemId: string) {
    if (!service) {
      console.error("toggleItem - service not found");
      return;
    }

    console.log("toggleItem called with itemId:", itemId);
    const item = checklist.find(i => i.id === itemId);
    console.log("toggleItem - current item state:", item);

    const updatedChecklist = checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    );

    console.log("toggleItem - updated checklist locally");
    setChecklist(updatedChecklist);

    try {
      // Use debounced update instead of immediate update
      await debouncedUpdateChecklist(updatedChecklist);
    } catch (error) {
      console.error("toggleItem - Error updating checklist:", error);
      console.error("toggleItem - Error details:", {
        serviceId,
        itemId,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      // Revert local change on failure to keep UI consistent
      setChecklist(checklist);
      throw error;
    }
  }

  async function updateNote(itemId: string, note: string) {
    if (!service) {
      console.error("updateNote - service not found");
      return;
    }

    console.log("updateNote called with itemId:", itemId, "note length:", note.length);

    const updatedChecklist = checklist.map((item) =>
      item.id === itemId ? { ...item, note } : item,
    );

    setChecklist(updatedChecklist);

    try {
      console.log("updateNote - using debounced update");
      await debouncedUpdateChecklist(updatedChecklist);
      console.log("updateNote - update successful");
    } catch (error) {
      console.error("updateNote - Error updating note:", error);
      console.error("updateNote - Error details:", {
        serviceId,
        itemId,
        noteLength: note.length,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      setChecklist(checklist);
      throw error;
    }
  }

  async function updatePhotos(itemId: string, photos: string[]) {
    if (!service) {
      console.error("updatePhotos - service not found");
      return;
    }

    console.log("updatePhotos called with itemId:", itemId, "photos count:", photos.length);

    const updatedChecklist = checklist.map((item) =>
      item.id === itemId ? { ...item, photos } : item,
    );

    setChecklist(updatedChecklist);

    try {
      console.log("updatePhotos - using debounced update");
      await debouncedUpdateChecklist(updatedChecklist);
      console.log("updatePhotos - update successful");
    } catch (error) {
      console.error("updatePhotos - Error updating photos:", error);
      console.error("updatePhotos - Error details:", {
        serviceId,
        itemId,
        photosCount: photos.length,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      setChecklist(checklist);
      throw error;
    }
  }

  async function markInProgress() {
    console.log("markInProgress called for serviceId:", serviceId);
    try {
      await updateService(serviceId, { status: "in-progress" });
      console.log("markInProgress - status updated successfully");
    } catch (error) {
      console.error("markInProgress - Error:", error);
      throw error;
    }
  }

  async function completeService() {
    console.log("completeService called for serviceId:", serviceId);
    console.log("completeService - allCompleted:", allCompleted);
    
    if (!allCompleted) {
      console.warn("completeService - not all items completed");
      return false;
    }
    
    try {
      await updateService(serviceId, { status: "completed" });
      console.log("completeService - status updated successfully");
      return true;
    } catch (error) {
      console.error("completeService - Error:", error);
      throw error;
    }
  }

  return {
    service,
    checklist,
    completedItems,
    totalItems,
    hasAnyCompleted,
    allCompleted,
    toggleItem,
    updateNote,
    updatePhotos,
    markInProgress,
    completeService,
  };
}
