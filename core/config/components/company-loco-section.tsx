import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  companyInfo: {
    logo?: string;
  };
  updateCompanyInfo?: (data: { logo?: string }) => void;
  onPickLogo?: () => void;
  cleanLogo: () => void;
};

export function CompanyLogoSection({
  companyInfo,
  updateCompanyInfo,
  onPickLogo,
  cleanLogo,
}: Props) {
  return (
    <View className="gap-2">
      <Text className="text-gray-700 mb-2">Logo da Empresa</Text>

      {/* Preview da logo */}
      {companyInfo.logo && (
        <View className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-700">Preview:</Text>

            <TouchableOpacity onPress={() => cleanLogo()}>
              <Ionicons name="close" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: companyInfo.logo }}
            className="w-[200px] h-[100px] self-center"
            resizeMode="contain"
          />
        </View>
      )}

      {/* Upload da logo */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={onPickLogo}
          className="flex-row items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg"
        >
          <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
          <Text className="text-white">
            {companyInfo.logo ? "Alterar logo" : "Upload da logo"}
          </Text>
        </TouchableOpacity>

        {!companyInfo.logo && (
          <Text className="text-gray-500">Recomendado: 300x100px</Text>
        )}
      </View>
    </View>
  );
}
