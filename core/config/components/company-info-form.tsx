import { Input, type TextInputProps } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import React from "react";
import { View } from "react-native";
import { CompanyLogoSection } from "./company-loco-section";

type CompanyInfo = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: string;
};

type Props = {
  data: CompanyInfo;
  onChange: (data: Partial<CompanyInfo>) => void;
  onPickLogo: () => void;
  onCleanLogo: () => void;
};

export function CompanyInfoForm({
  data,
  onChange,
  onPickLogo,
  onCleanLogo,
}: Props) {
  const InputForm = ({
    label,
    ...props
  }: {
    label: string;
  } & TextInputProps) => (
    <View className="pb-2">
      <Text>{label}</Text>
      <Input {...props} />
    </View>
  );
  return (
    <View>
      {/* INFO */}
      <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
        <Text className="text-blue-700 text-sm">
          Essas informações aparecerão no cabeçalho e rodapé dos relatórios
        </Text>
      </View>

      {/* FORM */}
      <View className="bg-white rounded-xl p-4 border border-border gap-2">
        <InputForm
          label={"Empresa"}
          value={data.name}
          onChangeText={(v) => onChange({ name: v })}
        />
        <InputForm
          label={"Telefone"}
          value={data.phone}
          onChangeText={(v) => {
            onChange({ phone: v });
          }}
          keyboardType="phone-pad"
        />

        <InputForm
          label={"E-mail"}
          value={data.email}
          onChangeText={(v) => onChange({ email: v })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputForm
          label={"Endereço"}
          value={data.address}
          onChangeText={(v) => onChange({ address: v })}
        />

        <CompanyLogoSection
          companyInfo={data}
          onPickLogo={onPickLogo}
          cleanLogo={onCleanLogo}
        />
      </View>
    </View>
  );
}
