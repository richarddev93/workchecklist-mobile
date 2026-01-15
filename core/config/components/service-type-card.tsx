import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface ServiceTypeCardProps {
  type: { id: string; name: string };
  isEditing: boolean;
  onEdit: () => void;
  onSave: (name: string) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function ServiceTypeCard({
  type,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: ServiceTypeCardProps) {
  const [editName, setEditName] = useState(type.name);

  useEffect(() => {
    if (isEditing) {
      setEditName(type.name);
    }
  }, [isEditing, type.name]);

  if (isEditing) {
    return (
      <View className="rounded-lg border border-gray-200 bg-white p-4">
        <View className="flex-row gap-2">
          <TextInput
            value={editName}
            onChangeText={setEditName}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
            placeholderTextColor="#9ca3af"
          />

          <Pressable
            onPress={() => onSave(editName)}
            className="items-center justify-center rounded-lg bg-emerald-500 px-4"
          >
            <Ionicons name="save-outline" size={20} color="#fff" />
          </Pressable>

          <Pressable
            onPress={onCancel}
            className="items-center justify-center rounded-lg bg-gray-200 px-4"
          >
            <Ionicons name="close" size={20} color="#374151" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="rounded-lg border border-gray-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-900">{type.name}</Text>

        <View className="flex-row gap-2">
          <Pressable
            onPress={onEdit}
            className="rounded-lg p-2"
          >
            <Ionicons name="pencil" size={18} color="#2563eb" />
          </Pressable>

          <Pressable
            onPress={onDelete}
            className="rounded-lg p-2"
          >
            <Ionicons name="trash" size={18} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
