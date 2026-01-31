import { Ionicons } from "@expo/vector-icons";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { ServiceTypeCard } from "./service-type-card";

type ServiceType = {
  id: string;
  name: string;
};

type ServicesTypesProps = {
  serviceTypes: ServiceType[];
  showNewType: boolean;
  newType: string;
  editingType: string | null;

  setShowNewType: (value: boolean) => void;
  setNewType: (value: string) => void;
  setEditingType: (value: string | null) => void;

  onAdd: () => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
};

export function ServicesTypes({
  serviceTypes,
  showNewType,
  newType,
  editingType,
  setShowNewType,
  setNewType,
  setEditingType,
  onAdd,
  onUpdate,
  onDelete,
}: ServicesTypesProps) {
  return (
    <View className="flex-1 gap-3 px-3 pt-3">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-500">
          {serviceTypes.length} {serviceTypes.length === 1 ? "tipo" : "tipos"}
        </Text>

        <Pressable
          onPress={() => {
            setEditingType(null); // garante 1 edição por vez
            setShowNewType(true);
          }}
          className="flex-row items-center gap-2 rounded-lg bg-blue-600 px-4 py-2"
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text className="font-medium text-white">Novo tipo</Text>
        </Pressable>
      </View>

      {/* New Type Form */}
      {showNewType && (
        <View className="rounded-xl border border-gray-200 bg-white p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-semibold text-gray-900">
              Novo Tipo de Serviço
            </Text>

            <Pressable
              onPress={() => {
                setShowNewType(false);
                setNewType("");
              }}
              hitSlop={8}
            >
              <Ionicons name="close" size={22} color="#9ca3af" />
            </Pressable>
          </View>

          <View className="flex-row gap-2">
            <TextInput
              value={newType}
              onChangeText={setNewType}
              placeholder="Ex: Manutenção Corretiva"
              placeholderTextColor="#9ca3af"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
            />

            <Pressable
              onPress={onAdd}
              disabled={!newType.trim()}
              className={`items-center justify-center rounded-lg px-4 ${
                newType.trim() ? "bg-emerald-500" : "bg-emerald-300"
              }`}
            >
              <Ionicons name="save-outline" size={22} color="#fff" />
            </Pressable>
          </View>
        </View>
      )}

      {/* Service Types List */}
      <FlatList
        data={serviceTypes}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <ServiceTypeCard
            type={item}
            isEditing={editingType === item.id}
            onEdit={() => {
              setShowNewType(false); // fecha form novo
              setEditingType(item.id);
            }}
            onSave={(name: string) => onUpdate(item.id, name)}
            onCancel={() => setEditingType(null)}
            onDelete={() => onDelete(item.id)}
          />
        )}
      />
    </View>
  );
}
