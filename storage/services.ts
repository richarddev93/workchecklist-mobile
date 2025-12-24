import AsyncStorage from '@react-native-async-storage/async-storage';
import { Service } from '../models/Service';

const SERVICES_KEY = 'services';

export const getServices = async (): Promise<Service[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SERVICES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading services', e);
    return [];
  }
};

export const getService = async (id: string): Promise<Service | null> => {
  try {
    const services = await getServices();
    return services.find((service) => service.id === id) || null;
  } catch (e) {
    console.error('Error reading service', e);
    return null;
  }
};

export const saveService = async (service: Service): Promise<void> => {
  try {
    const services = await getServices();
    const index = services.findIndex((s) => s.id === service.id);
    if (index !== -1) {
      services[index] = service;
    } else {
      services.push(service);
    }
    const jsonValue = JSON.stringify(services);
    await AsyncStorage.setItem(SERVICES_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving service', e);
  }
};
