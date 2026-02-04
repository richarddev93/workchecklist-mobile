import Container from "@/components/container";
import { Header } from "@/components/ui/header";
import { getRemoteConfigValue } from "@/lib/remoteConfig";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import pkg from "../package.json";

export default function AboutScreen() {
  const router = useRouter();
  const version = pkg.version ?? "1.0.0";
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    (async () => {
      const email = await getRemoteConfigValue("contact_email");
      setContactEmail(String(email || ""));
    })();
  }, []);

  return (
    <Container>
      <Header
        title="Sobre o app"
        subtitle="WorkCheckList"
        onBackHandler={() => router.back()}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <View className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
          <Text className="text-gray-900 text-lg font-semibold mb-2">
            Informações do aplicativo
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Versão</Text>
              <Text className="text-gray-900">{version}</Text>
            </View>
            {contactEmail ? (
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Contato</Text>
                <Text className="text-gray-900">{contactEmail}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View className="bg-white rounded-xl p-5 border border-gray-200">
          <Text className="text-gray-900 text-lg font-semibold mb-3">
            Termos de uso
          </Text>

          <Text className="text-gray-700 mb-3">
            Ao utilizar o WorkCheckList, você concorda com os termos descritos
            abaixo. O aplicativo é fornecido para auxiliar na gestão de serviços
            e checklists, podendo ser atualizado a qualquer momento para melhorar
            a experiência e a segurança.
          </Text>

          <Text className="text-gray-700 mb-3">
            1. Responsabilidade: Os dados inseridos no aplicativo são de
            responsabilidade do usuário. Recomendamos manter cópias de
            segurança.
          </Text>

          <Text className="text-gray-700 mb-3">
            2. Privacidade: As informações cadastradas são usadas apenas para o
            funcionamento do aplicativo. Não compartilhamos dados pessoais sem
            autorização.
          </Text>

          <Text className="text-gray-700 mb-3">
            3. Uso adequado: É proibido utilizar o app para atividades ilegais ou
            que violem direitos de terceiros.
          </Text>

          <Text className="text-gray-700 mb-3">
            4. Limitações: O app é fornecido "como está". Não garantimos
            disponibilidade contínua ou ausência de erros.
          </Text>

          <Text className="text-gray-700">
            5. Atualizações: Podemos alterar estes termos a qualquer momento. O
            uso contínuo do app implica concordância com as atualizações.
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}
