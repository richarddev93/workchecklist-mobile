import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { getServices } from '../storage/services';
import { Service } from '../models/Service';

const ServicesScreen: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchServices = async () => {
      const storedServices = await getServices();
      setServices(storedServices);
    };
    fetchServices();
  }, []);

  const renderItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200"
      onPress={() => navigation.navigate('service/[id]', { id: item.id })}
    >
      <Text className="text-lg font-bold">{item.clientName}</Text>
      <Text className="text-gray-600">{item.serviceType}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ServicesScreen;
