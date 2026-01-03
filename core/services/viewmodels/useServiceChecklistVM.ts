import { useServices } from '@/core/services/context/ServiceContext';

export function useServiceChecklistViewModel(serviceId: string) {
  const { getServiceById, updateService } = useServices();

  const service = getServiceById(serviceId);

  const completedItems = service
    ? service.checklist.filter(i => i.completed).length
    : 0;

  const totalItems = service?.checklist.length ?? 0;

  const hasAnyCompleted = completedItems > 0;
  const allCompleted = totalItems > 0 && completedItems === totalItems;

  function toggleItem(itemId: string) {
    if (!service) return;

    updateService(serviceId, {
      checklist: service.checklist.map(item =>
        item.id === itemId
          ? { ...item, completed: !item.completed }
          : item
      ),
    });
  }

  function updateNote(itemId: string, note: string) {
    if (!service) return;

    updateService(serviceId, {
      checklist: service.checklist.map(item =>
        item.id === itemId ? { ...item, note } : item
      ),
    });
  }

  function updatePhotos(itemId: string, photos: string[]) {
    if (!service) return;

    updateService(serviceId, {
      checklist: service.checklist.map(item =>
        item.id === itemId ? { ...item, photos } : item
      ),
    });
  }

  function markInProgress() {
    updateService(serviceId, { status: 'in-progress' });
  }

  function completeService() {
    if (!allCompleted) return false;
    updateService(serviceId, { status: 'completed' });
    return true;
  }

  return {
    service,
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
