import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface TemplateCardProps {
  template: { id: string; name: string; items: string[] };
  isEditing: boolean;
  onEdit: () => void;
  onSave: (name: string, items: string[]) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function TemplateCard({
  template,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: TemplateCardProps) {
  const [editName, setEditName] = useState(template.name);
  const [editItems, setEditItems] = useState<string[]>(template.items);

  useEffect(() => {
    if (isEditing) {
      setEditName(template.name);
      setEditItems(template.items);
    }
  }, [isEditing, template]);

  if (isEditing) {
    return (
      <View className="rounded-lg border border-gray-200 bg-white p-4">
        <View className="gap-3">
          {/* Template name */}
          <TextInput
            value={editName}
            onChangeText={setEditName}
            placeholder="Nome do template"
            placeholderTextColor="#9ca3af"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          {/* Items */}
          {editItems.map((item, index) => (
            <View key={index} className="flex-row gap-2">
              <TextInput
                value={item}
                onChangeText={(text) => {
                  const newItems = [...editItems];
                  newItems[index] = text;
                  setEditItems(newItems);
                }}
                placeholder={`Item ${index + 1}`}
                placeholderTextColor="#9ca3af"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
              />

              {editItems.length > 1 && (
                <Pressable
                  onPress={() =>
                    setEditItems(editItems.filter((_, i) => i !== index))
                  }
                  className="items-center justify-center rounded-lg p-2"
                  hitSlop={8}
                >
                  <Ionicons name="trash" size={18} color="#ef4444" />
                </Pressable>
              )}
            </View>
          ))}

          {/* Add item */}
          <Pressable
            onPress={() => setEditItems([...editItems, ''])}
          >
            <Text className="text-blue-600 font-medium">
              + Adicionar item
            </Text>
          </Pressable>

          {/* Actions */}
          <View className="flex-row gap-2 pt-2">
            <Pressable
              onPress={() => onSave(editName, editItems)}
              disabled={!editName.trim()}
              className={`flex-1 items-center rounded-lg py-2 ${
                editName.trim()
                  ? 'bg-emerald-500'
                  : 'bg-emerald-300'
              }`}
            >
              <Text className="font-medium text-white">Salvar</Text>
            </Pressable>

            <Pressable
              onPress={onCancel}
              className="flex-1 items-center rounded-lg bg-gray-200 py-2"
            >
              <Text className="font-medium text-gray-700">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="rounded-lg border border-gray-200 bg-white p-4">
      {/* Header */}
      <View className="mb-2 flex-row items-start justify-between">
        <Text className="font-semibold text-gray-900">
          {template.name}
        </Text>

        <View className="flex-row gap-2">
          <Pressable onPress={onEdit} className="rounded-lg p-2">
            <Ionicons name="pencil" size={18} color="#2563eb" />
          </Pressable>

          <Pressable onPress={onDelete} className="rounded-lg p-2">
            <Ionicons name="trash" size={18} color="#ef4444" />
          </Pressable>
        </View>
      </View>

      {/* Items list */}
      <View className="gap-1">
        {template.items.map((item, index) => (
          <View
            key={index}
            className="flex-row items-center gap-2"
          >
            <View className="h-5 w-5 items-center justify-center rounded bg-gray-100">
              <Text className="text-xs text-gray-600">
                {index + 1}
              </Text>
            </View>

            <Text className="text-gray-600">{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
