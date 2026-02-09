import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

export interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (liked: boolean, feedback?: string | null) => void;
}

export function FeedbackModal({
  visible,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const [feedbackText, setFeedbackText] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);

  const handleYes = () => {
    // 👍 Sim → fecha modal
    if (onSubmit) onSubmit(true, null);
    handleClose();
  };

  const handleNo = () => {
    // 👎 Não → mostra campo de feedback
    setShowTextInput(true);
  };

  const handleSubmitFeedback = () => {
    // Enviar feedback (texto opcional)
    if (onSubmit) onSubmit(false, feedbackText.trim() || null);
    handleClose();
  };

  const handleClose = () => {
    setFeedbackText("");
    setShowTextInput(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-xs gap-6">
          {/* Título */}
          <View className="gap-2">
            <Text className="text-xl font-bold text-gray-900 text-center">
              O WorkChecklist te ajudou hoje?
            </Text>
          </View>

          {!showTextInput ? (
            /* Botões Sim/Não */
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleYes}
                className="flex-1 bg-emerald-500 rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">👍 Sim</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNo}
                className="flex-1 bg-red-500 rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">👎 Não</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Campo de feedback opcional */
            <View className="gap-3">
              <TextInput
                placeholder="O que faltou ou poderia melhorar?"
                placeholderTextColor="#d1d5db"
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                numberOfLines={4}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
                textAlignVertical="top"
              />

              <TouchableOpacity
                onPress={handleSubmitFeedback}
                className="bg-blue-500 rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">Enviar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
