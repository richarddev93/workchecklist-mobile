import { useServices } from '@/core/services/context/ServiceContext';
import { useConfig } from '@/context/ConfigContext';
import { ChecklistItem } from '@/types';
import { useEffect, useState, useRef } from 'react';

export function useServiceChecklistViewModel(serviceId: string) {
  const { getServiceById, updateService } = useServices();
  const { templates } = useConfig();

  const service = getServiceById(serviceId);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const checklistLoadedRef = useRef(false);

  useEffect(() => {
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
        console.error('Error parsing checklist_data:', e);
        // fall through to template build
      }
    }

    // Build from template when checklist_data is empty or invalid.
    let built: ChecklistItem[] = [];
    if (service.template_id && templates.length > 0) {
      const tmpl = templates.find(
        (t) => `${t.id}` === `${service.template_id}` || t.name === service.template_id,
      );
      if (tmpl?.items) {
        built = tmpl.items.map((title, idx) => ({
          id: `${service.id}-item-${idx}`,
          title,
          completed: false,
        }));
      }
      console.log('Building checklist from template:', { template: tmpl?.name, items: built });
    } else {
      console.log('No template found for:', { template_id: service.template_id, templates_available: templates.length });
    }

    if (built.length > 0) {
      setChecklist(built);
      checklistLoadedRef.current = true;

      // Persist to DB if we built from template (not already in DB)
      if (!service.checklist_data) {
        updateService(serviceId, {
          checklist_data: JSON.stringify(built),
        }).catch(err => console.error('Error saving checklist:', err));
      }
    }
  }, [service?.id, service?.template_id, templates, serviceId]);

  const completedItems = checklist.filter(i => i.completed).length;
  const totalItems = checklist.length;

  const hasAnyCompleted = completedItems > 0;
  const allCompleted = totalItems > 0 && completedItems === totalItems;

  async function toggleItem(itemId: string) {
    if (!service) return;

    const updatedChecklist = checklist.map(item =>
      item.id === itemId
        ? { ...item, completed: !item.completed }
        : item
    );

    setChecklist(updatedChecklist);

    try {
      await updateService(serviceId, {
        checklist_data: JSON.stringify(updatedChecklist),
      });
    } catch (error) {
      // Revert local change on failure to keep UI consistent
      setChecklist(checklist);
      throw error;
    }
  }

  async function updateNote(itemId: string, note: string) {
    if (!service) return;

    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, note } : item
    );

    setChecklist(updatedChecklist);

    try {
      await updateService(serviceId, {
        checklist_data: JSON.stringify(updatedChecklist),
      });
    } catch (error) {
      setChecklist(checklist);
      throw error;
    }
  }

  async function updatePhotos(itemId: string, photos: string[]) {
    if (!service) return;

    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, photos } : item
    );

    setChecklist(updatedChecklist);

    try {
      await updateService(serviceId, {
        checklist_data: JSON.stringify(updatedChecklist),
      });
    } catch (error) {
      setChecklist(checklist);
      throw error;
    }
  }

  async function markInProgress() {
    await updateService(serviceId, { status: 'in-progress' });
  }

  async function completeService() {
    if (!allCompleted) return false;
    await updateService(serviceId, { status: 'completed' });
    return true;
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
