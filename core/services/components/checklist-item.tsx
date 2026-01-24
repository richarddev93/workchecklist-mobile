import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

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
  const [photos, setPhotos] = useState<string[]>(item.photos ?? []);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const hasPhotos = photos.length > 0;
  const hasNote = note.trim().length > 0;

  const pickImage = async (source: "camera" | "gallery") => {
    try {
      let result;

      if (source === "camera") {
        const cameraPermission =
          await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) {
          alert("Permissão de câmera necessária");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        const libraryPermission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!libraryPermission.granted) {
          alert("Permissão de galeria necessária");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultiple: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        const newPhotos = [
          ...photos,
          ...(Array.isArray(result.assets)
            ? result.assets.map((asset) => asset.uri)
            : [result.assets[0].uri]),
        ];
        setPhotos(newPhotos);
        onPhotosChange(newPhotos);
        setShowPhotoOptions(false);
      }
    } catch (error) {
      console.error("Erro ao selecionar foto:", error);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);
  };

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

      {/* Se item não está completo, mostra campos com editável */}
      {!item.completed && (
        <View className="gap-3">
          {/* Campo de observação editável */}
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
                      border border-blue-200 rounded-lg px-3 py-2
                      text-blue-800 bg-blue-50
                    "
                  />
                  <Pressable onPress={() => setShowNoteInput(true)}>
                    <Text className="text-blue-600 text-sm">
                      Editar observação
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* Links de ação - Items não completos */}
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
                  onPress={() => setShowPhotoOptions(!showPhotoOptions)}
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
                    {hasPhotos ? `${photos.length}` : ""} Fotos
                  </Text>
                </Pressable>
              </View>

              {/* Photo Options */}
              {showPhotoOptions && (
                <View className="bg-gray-50 rounded-lg p-3 gap-2 border border-gray-200">
                  <Pressable
                    onPress={() => pickImage("camera")}
                    className="flex-row items-center gap-2 p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <MaterialIcons
                      name="camera-alt"
                      size={20}
                      color="#2563eb"
                    />
                    <Text className="text-blue-600 font-medium">
                      Tirar foto
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => pickImage("gallery")}
                    className="flex-row items-center gap-2 p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <MaterialIcons
                      name="image-search"
                      size={20}
                      color="#2563eb"
                    />
                    <Text className="text-blue-600 font-medium">
                      Selecionar da galeria
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* Photo Grid - Items não completos */}
              {hasPhotos && (
                <View className="gap-2">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="gap-2"
                    contentContainerStyle={{ gap: 8, paddingRight: 8 }}
                  >
                    {photos.map((photoUri, index) => (
                      <View key={index} className="relative">
                        <Image
                          source={{ uri: photoUri }}
                          className="w-20 h-20 rounded-lg bg-gray-200"
                        />
                        <Pressable
                          onPress={() => removePhoto(index)}
                          className="absolute top-0.5 right-0.5 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                        >
                          <MaterialIcons name="close" size={16} color="white" />
                        </Pressable>
                      </View>
                    ))}

                    {/* Add Photo Button */}
                    <Pressable
                      onPress={() => setShowPhotoOptions(true)}
                      className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 items-center justify-center"
                    >
                      <MaterialIcons name="add" size={28} color="#9ca3af" />
                    </Pressable>
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </View>
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

              {/* Links de ação - Items completos */}
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
                  onPress={() => setShowPhotoOptions(!showPhotoOptions)}
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
                    {hasPhotos ? `${photos.length}` : ""} Fotos
                  </Text>
                </Pressable>
              </View>

              {/* Photo Options - Items completos */}
              {showPhotoOptions && (
                <View className="bg-green-50 rounded-lg p-3 gap-2 border border-green-200">
                  <Pressable
                    onPress={() => pickImage("camera")}
                    className="flex-row items-center gap-2 p-3 bg-white rounded-lg border border-green-200"
                  >
                    <MaterialIcons
                      name="camera-alt"
                      size={20}
                      color="#10b981"
                    />
                    <Text className="text-green-700 font-medium">
                      Tirar foto
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => pickImage("gallery")}
                    className="flex-row items-center gap-2 p-3 bg-white rounded-lg border border-green-200"
                  >
                    <MaterialIcons
                      name="image-search"
                      size={20}
                      color="#10b981"
                    />
                    <Text className="text-green-700 font-medium">
                      Selecionar da galeria
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* Photo Grid - Items completos */}
              {hasPhotos && (
                <View className="gap-2">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="gap-2"
                    contentContainerStyle={{ gap: 8, paddingRight: 8 }}
                  >
                    {photos.map((photoUri, index) => (
                      <View key={index} className="relative">
                        <Image
                          source={{ uri: photoUri }}
                          className="w-20 h-20 rounded-lg bg-gray-200"
                        />
                        <Pressable
                          onPress={() => removePhoto(index)}
                          className="absolute top-0.5 right-0.5 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                        >
                          <MaterialIcons name="close" size={16} color="white" />
                        </Pressable>
                      </View>
                    ))}

                    {/* Add Photo Button */}
                    <Pressable
                      onPress={() => setShowPhotoOptions(true)}
                      className="w-20 h-20 rounded-lg bg-green-100 border-2 border-dashed border-green-300 items-center justify-center"
                    >
                      <MaterialIcons name="add" size={28} color="#10b981" />
                    </Pressable>
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
}
