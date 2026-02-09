import { getRemoteConfigValue } from "@/lib/remoteConfig";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  message?: string;
  description?: string;
}

const DEFAULT_EMPTY_STATE_MESSAGE = "Você não tem nenhum serviço pendente";
const DEFAULT_EMPTY_STATE_DESCRIPTION = "Vamos começar um novo";

export function EmptyState({ message, description }: EmptyStateProps) {
  const [remoteMessage, setRemoteMessage] = useState("");
  const [remoteDescription, setRemoteDescription] = useState("");

  useEffect(() => {
    const messageValue = getRemoteConfigValue("empty_state_message");
    const descriptionValue = getRemoteConfigValue("empty_state_description");

    setRemoteMessage(String(messageValue || ""));
    setRemoteDescription(String(descriptionValue || ""));
  }, []);

  const normalizedMessage = (message || "").trim();
  const normalizedDescription = (description || "").trim();
  const isDefaultMessage =
    !normalizedMessage || normalizedMessage === DEFAULT_EMPTY_STATE_MESSAGE;

  const resolvedMessage = (() => {
    if (!isDefaultMessage) return normalizedMessage;

    const remote = (remoteMessage || "").trim();
    if (remote && remote !== DEFAULT_EMPTY_STATE_MESSAGE) return remote;

    return DEFAULT_EMPTY_STATE_MESSAGE;
  })();

  const resolvedDescription = (() => {
    if (normalizedDescription) return normalizedDescription;
    if (!isDefaultMessage) return undefined;

    const remote = (remoteDescription || "").trim();
    if (remote && remote !== DEFAULT_EMPTY_STATE_DESCRIPTION) return remote;

    return DEFAULT_EMPTY_STATE_DESCRIPTION;
  })();

  return (
    <View className="flex-1 justify-center items-center px-6">
      <Text className="text-gray-500 text-lg text-center mb-2">
        {resolvedMessage}
      </Text>
      {resolvedDescription && (
        <Text className="text-gray-400 text-sm text-center mb-4">
          {resolvedDescription}
        </Text>
      )}
    </View>
  );
}
