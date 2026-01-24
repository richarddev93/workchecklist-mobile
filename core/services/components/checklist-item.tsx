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
  disabledToggle?: boolean;
}

export function ChecklistItemComponent({
  item,
  onToggle,
  onNoteChange,
  onPhotosChange,
  disabledToggle = false,
}: ChecklistItemComponentProps) {
  const [note, setNote] = useState(item.note ?? "");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const hasPhotos = (item.photos?.length ?? 0) > 0;
  const hasNote = note.trim().length > 0;

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
      <Pressable
        onPress={disabledToggle ? undefined : onToggle}
        className="flex-row items-center gap-3"
      >
        <MaterialIcons
          name={item.completed ? "check-circle" : "radio-button-unchecked"}
          size={26}
          color={
            disabledToggle ? "#d1d5db" : item.completed ? "#10b981" : "#9ca3af"
          }
        />

        <Text
          className={`
            flex-1 text-base
            ${item.completed ? "text-green-800 line-through" : "text-gray-900"}
          `}
        >
          {item.title || "Item sem descrição"}
        </Text>
      </Pressable>

      {/* Se item não está completo, mostra campos normais */}
      {!item.completed && (
        <>
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

          <Pressable
            onPress={() => {
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
              {hasPhotos
                ? `${item.photos.length} evidência(s)`
                : "Adicionar evidências"}
            </Text>
          </Pressable>
        </>
      )}

      {/* Se item está completo, mostra links ou campos preenchidos */}
      {item.completed && (
        <View className="gap-3">
          {/* Campo de observação editável quando showNoteInput = true */}
          {showNoteInput ? (
            <View className="gap-2">
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Digite a observação"
                multiline
                autoFocus
                className="
                  border border-gray-300 rounded-lg px-3 py-2
                  text-gray-900 bg-white min-h-[80px]
                "
              />
              <View className="flex-row gap-2 justify-end">
                <Pressable
                  onPress={() => {
                    setNote(item.note ?? "");
                    setShowNoteInput(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200"
                >
                  <Text className="text-gray-700 font-medium">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    onNoteChange(note);
                    setShowNoteInput(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600"
                >
                  <Text className="text-white font-medium">Salvar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              {/* Se tem nota, mostra readonly */}
              {hasNote && (
                <View className="gap-2">
                  <TextInput
                    value={note}
                    editable={false}
                    multiline
                    className="
                      border border-green-200 rounded-lg px-3 py-2
                      text-green-800 bg-green-50
                    "
                  />
                  <Pressable onPress={() => setShowNoteInput(true)}>
                    <Text className="text-blue-600 text-sm">
                      Editar observação
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* Links de ação */}
              <View className="flex-row gap-3 items-center">
                {!hasNote && (
                  <Pressable onPress={() => setShowNoteInput(true)}>
                    <Text className="text-blue-600 text-base">
                      Adicionar observação
                    </Text>
                  </Pressable>
                )}

                {!hasNote && <View className="w-px h-5 bg-gray-300" />}

                <Pressable
                  onPress={() => {
                    onPhotosChange([...(item.photos ?? [])]);
                  }}
                  className="flex-row items-center gap-1"
                >
                  <MaterialIcons
                    name="photo-camera"
                    size={20}
                    color={hasPhotos ? "#10b981" : "#2563eb"}
                  />
                  <Text
                    className={hasPhotos ? "text-green-800" : "text-blue-600"}
                  >
                    {hasPhotos ? `${item.photos.length}` : ""} Fotos
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}
