import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { saveReport } from '../storage/reports';
import { Report } from '../models/Report';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const CreateReportScreen: React.FC = () => {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const [summary, setSummary] = useState('');
  const navigation = useNavigation();

  const handleSave = async () => {
    if (serviceId) {
      const newReport: Report = {
        id: uuidv4(),
        serviceId,
        date: new Date().toISOString(),
        summary,
      };
      await saveReport(newReport);
      navigation.goBack();
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <TextInput
        className="border p-2 mb-4"
        placeholder="Report Summary"
        value={summary}
        onChangeText={setSummary}
        multiline
      />
      <Button title="Save Report" onPress={handleSave} />
    </View>
  );
};

export default CreateReportScreen;
