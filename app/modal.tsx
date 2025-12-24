import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <View className="justify-center ">
      <Text>This is a modal</Text>
      <Link href="/" dismissTo className="mt-5">
        <Text>Go to home screen</Text>
      </Link>
    </View>
  );
}

