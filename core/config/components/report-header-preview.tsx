import { Image, Text, View } from "react-native";

type Props = {
  companyInfo: {
    logo?: string;
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
};

export function ReportHeaderPreview({ companyInfo }: Props) {
  return (
    <View className="bg-white rounded-lg border border-gray-200 p-4">
      <Text className="text-gray-900 mb-3">
        Preview do Cabeçalho do Relatório
      </Text>

      <View className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <View className="flex-row items-start gap-4">
          {companyInfo.logo && (
            <Image
              source={{ uri: companyInfo.logo }}
              className="w-[120px] h-[60px]"
              resizeMode="contain"
            />
          )}

          <View className="flex-1">
            {companyInfo.name && (
              <Text className="font-semibold text-gray-900 mb-1">
                {companyInfo.name}
              </Text>
            )}

            {companyInfo.address && (
              <Text className="text-gray-600">
                {companyInfo.address}
              </Text>
            )}

            <View className="flex-row  mt-1 flex-wrap">
              {companyInfo.phone && (
                <Text className="text-gray-600">
                  {companyInfo.phone}
                </Text>
              )}

              {companyInfo.email && (
                <Text className="text-gray-600">
                  {companyInfo.email}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
