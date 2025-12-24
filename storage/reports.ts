import AsyncStorage from '@react-native-async-storage/async-storage';
import { Report } from '../models/Report';

const REPORTS_KEY = 'reports';

export const getReports = async (serviceId: string): Promise<Report[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${REPORTS_KEY}_${serviceId}`);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading reports', e);
    return [];
  }
};

export const saveReport = async (report: Report): Promise<void> => {
  try {
    const reports = await getReports(report.serviceId);
    reports.push(report);
    const jsonValue = JSON.stringify(reports);
    await AsyncStorage.setItem(`${REPORTS_KEY}_${report.serviceId}`, jsonValue);
  } catch (e) {
    console.error('Error saving report', e);
  }
};
