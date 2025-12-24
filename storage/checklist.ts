import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChecklistItem } from '../models/ChecklistItem';

const CHECKLIST_ITEMS_KEY = 'checklist_items';

export const getChecklistItems = async (
  serviceId: string
): Promise<ChecklistItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(
      `${CHECKLIST_ITEMS_KEY}_${serviceId}`
    );
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading checklist items', e);
    return [];
  }
};

export const saveChecklistItems = async (
  serviceId: string,
  items: ChecklistItem[]
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(items);
    await AsyncStorage.setItem(`${CHECKLIST_ITEMS_KEY}_${serviceId}`, jsonValue);
  } catch (e) {
    console.error('Error saving checklist items', e);
  }
};
