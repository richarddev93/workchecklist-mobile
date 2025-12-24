import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getReports } from '../storage/reports';
import { Report } from '../models/Report';

const ReportsScreen: React.FC = () => {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const [reports, setReports] = useState<Report[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (serviceId) {
      const fetchReports = async () => {
        const storedReports = await getReports(serviceId);
        setReports(storedReports);
      };
      fetchReports();
    }
  }, [serviceId]);

  const renderItem = ({ item }: { item: Report }) => (
    <View className="p-4 border-b border-gray-200">
      <Text className="text-lg font-bold">Report</Text>
      <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text>Summary: {item.summary}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Button
        title="Create New Report"
        onPress={() => navigation.navigate('create-report', { serviceId })}
      />
    </View>
  );
};

export default ReportsScreen;
