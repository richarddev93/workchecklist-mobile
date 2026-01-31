import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from "react-native";

interface OnboardingScreen {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  buttonColor: string;
}

const screens: OnboardingScreen[] = [
  {
    id: "1",
    title: "Bem-vindo ao WorkChecklist",
    description:
      "Seu assistente profissional para gerenciar checklists, agendar serviços e gerir relacionamentos destacados em campo.",
    icon: "check-circle",
    color: "#2563eb",
    buttonColor: "#2563eb",
  },
  {
    id: "2",
    title: "Checklists Inteligentes",
    description:
      "Crie templates personalizáveis, alinhe fotos como evidências e tenha controle total sobre cada etapa do serviço.",
    icon: "check-circle",
    color: "#2563eb",
    buttonColor: "#2563eb",
  },
  {
    id: "3",
    title: "Organize seus Agendamentos",
    description:
      "Gerencie todos os serviços em um só lugar, acompanhe status e nunca perca um compromisso importante.",
    icon: "calendar-today",
    color: "#10b981",
    buttonColor: "#10b981",
  },
  {
    id: "4",
    title: "Relatórios Profissionais",
    description:
      "Gere relatórios completos com evidências fotográficas, exportáveis e prontos para enviar aos clientes.",
    icon: "description",
    color: "#f59e0b",
    buttonColor: "#f59e0b",
  },
  {
    id: "5",
    title: "Funciona 100% Offline",
    description:
      "Trabalhe em campo sem preocupações. Todos os dados ficam salvos localmente.",
    icon: "wifi-off",
    color: "#2563eb",
    buttonColor: "#2563eb",
  },
];

const { width, height } = Dimensions.get("window");

interface OnboardingCarouselProps {
  onComplete: () => void;
}

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderScreen = ({ item }: { item: OnboardingScreen }) => (
    <View
      style={{ width, height }}
      className="items-center justify-between px-6 pt-12 pb-24"
    >
      <Pressable onPress={handleSkip} className="absolute top-10 right-6 z-10">
        <Text className="text-gray-400 text-sm">Pular</Text>
      </Pressable>

      <View className="flex-1 items-center justify-center gap-8">
        {currentIndex === 0 ? (
          <Image
            source={require("@/assets/images/Logo-horizontal.png")}
            className="w-48 h-16 mt-20"
            resizeMode="contain"
          />
        ) : (
          <View
            style={{ backgroundColor: item.color + "20" }}
            className="w-24 h-24 rounded-full items-center justify-center"
          >
            <MaterialIcons
              name={item.icon as any}
              size={48}
              color={item.color}
            />
          </View>
        )}

        <View className="gap-4 items-center">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            {item.title}
          </Text>
          <Text className="text-base text-gray-600 text-center leading-relaxed">
            {item.description}
          </Text>
        </View>
      </View>

      {/* Dots Indicator */}
      <View className="flex-row gap-1.5 mb-6">
        {screens.map((_, index) => (
          <View
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            style={{
              width: index === currentIndex ? 32 : 8,
            }}
          />
        ))}
      </View>

      {/* Button */}
      <Pressable
        onPress={handleNext}
        style={{ backgroundColor: item.buttonColor }}
        className="w-full py-4 rounded-2xl items-center flex-row justify-center gap-2"
      >
        <Text className="text-white font-bold text-base">Próximo</Text>
        <MaterialIcons name="arrow-forward" size={20} color="white" />
      </Pressable>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <FlatList
        ref={flatListRef}
        data={screens}
        renderItem={renderScreen}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
      />
    </View>
  );
}
