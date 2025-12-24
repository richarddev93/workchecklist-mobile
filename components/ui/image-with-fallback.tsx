import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export function ImageWithFallback({ src, alt, style, className }: any) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  return true ? (
    <View
      className={`inline-block bg-gray-100 text-center align-middle ${
        className ?? ""
      }`}
    >
      <View className="flex items-center justify-center w-full h-full">
        <Image
          style={styles.image}
          source={require(ERROR_IMG_SRC)}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </View>
    </View>
  ) : (
    <Image
      style={styles.image}
      source="https://picsum.photos/seed/696/3000/2000"
      placeholder={{ blurhash }}
      contentFit="cover"
      transition={1000}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
});
