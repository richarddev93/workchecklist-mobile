import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface ChecklistItemComponentProps {
  item: {
    id: string;
    title: string;
    completed: boolean;
    note?: string;
    photos?: string[];
  };
  onToggle: () => void;
  onNoteChange: (note: string) => void;
  onPhotosChange: (photos: string[]) => void;
}

export function ChecklistItemComponent({
  item,
  onToggle,
  onNoteChange,
  onPhotosChange,
}: ChecklistItemComponentProps) {
  const [note, setNote] = useState(item.note ?? "");

  return (
    <View
      className={`
        rounded-xl border p-4 gap-3
        ${
          item.completed
            ? "border-green-300 bg-green-50"
            : "border-gray-200 bg-white"
        }
      `}
    >
      {/* Header */}
      <Pressable onPress={onToggle} className="flex-row items-center gap-3">
        <MaterialIcons
          name={item.completed ? "check-circle" : "radio-button-unchecked"}
          size={26}
          color={item.completed ? "#10b981" : "#9ca3af"}
        />

        <Text
          className={`
            flex-1 text-base
            ${item.completed ? "text-green-800 line-through" : "text-gray-900"}
          `}
        >
          {item.title}
        </Text>
      </Pressable>

      {/* Observação */}
      <TextInput
        value={note}
        onChangeText={(text) => {
          setNote(text);
          onNoteChange(text);
        }}
        placeholder="Observações (opcional)"
        multiline
        className="
          border border-gray-200 rounded-lg px-3 py-2
          text-gray-900 bg-gray-50
        "
      />

      {/* Fotos / evidências */}
      <Pressable
        onPress={() => {
          // depois você liga com câmera / galeria
          onPhotosChange([...(item.photos ?? [])]);
        }}
        className="
          flex-row items-center gap-2
          rounded-lg border border-dashed border-gray-300
          px-3 py-2
        "
      >
        <MaterialIcons name="photo-camera" size={20} color="#6b7280" />
        <Text className="text-gray-600">
          {item.photos?.length
            ? `${item.photos.length} evidência(s)`
            : "Adicionar evidências"}
        </Text>
      </Pressable>
    </View>
  );
}
