import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getChecklistItems, saveChecklistItems } from '../storage/checklist';
import { ChecklistItem } from '../models/ChecklistItem';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const ChecklistScreen: React.FC = () => {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    if (serviceId) {
      const fetchItems = async () => {
        const storedItems = await getChecklistItems(serviceId);
        setItems(storedItems);
      };
      fetchItems();
    }
  }, [serviceId]);

  const handleAddItem = async () => {
    if (newItemText.trim() && serviceId) {
      const newItem: ChecklistItem = {
        id: uuidv4(),
        serviceId,
        text: newItemText,
        completed: false,
      };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      await saveChecklistItems(serviceId, updatedItems);
      setNewItemText('');
    }
  };

  const handleToggleItem = async (id: string) => {
    if (serviceId) {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      setItems(updatedItems);
      await saveChecklistItems(serviceId, updatedItems);
    }
  };

  const renderItem = ({ item }: { item: ChecklistItem }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200"
      onPress={() => handleToggleItem(item.id)}
    >
      <Text className={`flex-1 ${item.completed ? 'line-through' : ''}`}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View className="p-4">
        <TextInput
          className="border p-2 mb-2"
          placeholder="New checklist item"
          value={newItemText}
          onChangeText={setNewItemText}
        />
        <Button title="Add Item" onPress={handleAddItem} />
      </View>
    </View>
  );
};

export default ChecklistScreen;
