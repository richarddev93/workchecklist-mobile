import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useNavigation } from 'expo-router';
import { saveService } from '../storage/services';
import { Service } from '../models/Service';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const AddServiceScreen: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const navigation = useNavigation();

  const handleSave = async () => {
    const newService: Service = {
      id: uuidv4(),
      clientName,
      serviceType,
      date,
      location,
      notes,
      status: 'in_progress',
    };
    await saveService(newService);
    navigation.goBack();
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <TextInput
        className="border p-2 mb-4"
        placeholder="Client Name"
        value={clientName}
        onChangeText={setClientName}
      />
      <TextInput
        className="border p-2 mb-4"
        placeholder="Service Type"
        value={serviceType}
        onChangeText={setServiceType}
      />
      <TextInput
        className="border p-2 mb-4"
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        className="border p-2 mb-4"
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        className="border p-2 mb-4"
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <Button title="Save Service" onPress={handleSave} />
    </View>
  );
};

export default AddServiceScreen;
