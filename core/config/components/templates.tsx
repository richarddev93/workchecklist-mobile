import { Ionicons } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { TemplateCard } from "./template-card";

type Template = {
  id: string;
  name: string;
  items: string[];
};

type TemplatesProps = {
  templates: Template[];
  showNewTemplate: boolean;
  newTemplate: { name: string; items: string[] };
  editingTemplate: string | null;

  setShowNewTemplate: (value: boolean) => void;
  setNewTemplate: Dispatch<SetStateAction<{ name: string; items: string[] }>>;
  setEditingTemplate: (value: string | null) => void;

  onAdd: () => void;
  onUpdate: (id: string, name: string, items: string[]) => void;
  onDelete: (id: string) => void;
};

export function Templates({
  templates,
  showNewTemplate,
  newTemplate,
  editingTemplate,
  setShowNewTemplate,
  setNewTemplate,
  setEditingTemplate,
  onAdd,
  onUpdate,
  onDelete,
}: TemplatesProps) {
  return (
    <View className="gap-3">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-500">
          {templates.length} {templates.length === 1 ? "template" : "templates"}
        </Text>

        <Pressable
          onPress={() => {
            setEditingTemplate(null);
            setShowNewTemplate(true);
          }}
          className="flex-row items-center gap-2 rounded-lg bg-blue-600 px-4 py-2"
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text className="font-medium text-white">Novo template</Text>
        </Pressable>
      </View>

      {/* New Template Form */}
      {showNewTemplate && (
        <View className="rounded-xl border border-gray-200 bg-white p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-semibold text-gray-900">Novo Template</Text>

            <Pressable
              onPress={() => {
                setShowNewTemplate(false);
                setNewTemplate({ name: "", items: [""] });
              }}
              hitSlop={8}
            >
              <Ionicons name="close" size={22} color="#9ca3af" />
            </Pressable>
          </View>

          <View className="gap-3">
            {/* Template name */}
            <View>
              <Text className="mb-1 text-gray-700">Nome do template</Text>

              <TextInput
                value={newTemplate.name}
                onChangeText={(text) =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    name: text,
                  }))
                }
                placeholder="Ex: Manutenção Preventiva"
                placeholderTextColor="#9ca3af"
                className="rounded-lg border border-gray-300 px-3 py-2"
              />
            </View>

            {/* Items */}
            <View>
              <Text className="mb-1 text-gray-700">Itens do checklist</Text>

              {newTemplate.items.map((item, index) => (
                <View key={index} className="mb-2 flex-row gap-2">
                  <TextInput
                    value={item}
                    onChangeText={(text) => {
                      const newItems = [...newTemplate.items];
                      newItems[index] = text;
                      setNewTemplate((prev) => ({
                        ...prev,
                        items: newItems,
                      }));
                    }}
                    placeholder={`Item ${index + 1}`}
                    placeholderTextColor="#9ca3af"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
                  />

                  {newTemplate.items.length > 1 && (
                    <Pressable
                      onPress={() => {
                        const newItems = newTemplate.items.filter(
                          (_, i) => i !== index
                        );
                        setNewTemplate((prev) => ({
                          ...prev,
                          items: newItems,
                        }));
                      }}
                      className="items-center justify-center rounded-lg p-2"
                      hitSlop={8}
                    >
                      <Ionicons name="trash" size={18} color="#ef4444" />
                    </Pressable>
                  )}
                </View>
              ))}

              <Pressable
                onPress={() =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    items: [...prev.items, ""],
                  }))
                }
              >
                <Text className="font-medium text-blue-600">
                  + Adicionar item
                </Text>
              </Pressable>
            </View>

            {/* Save */}
            <Pressable
              onPress={onAdd}
              disabled={!newTemplate.name.trim()}
              className={`flex-row items-center justify-center gap-2 rounded-lg px-4 py-2 ${
                newTemplate.name.trim() ? "bg-emerald-500" : "bg-emerald-300"
              }`}
            >
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text className="font-medium text-white">Salvar template</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Templates List */}
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <TemplateCard
            template={item}
            isEditing={editingTemplate === item.id}
            onEdit={() => {
              setShowNewTemplate(false);
              setEditingTemplate(item.id);
            }}
            onSave={(name, items) => onUpdate(item.id, name, items)}
            onCancel={() => setEditingTemplate(null)}
            onDelete={() => onDelete(item.id)}
          />
        )}
      />
    </View>
  );
}
