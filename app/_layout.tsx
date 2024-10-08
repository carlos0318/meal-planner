import { Stack } from "expo-router";
import { ModalPortal } from "react-native-modals";

export default function RootLayout() {
  return (
    <Stack>
      <ModalPortal />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="menu" options={{ headerShown: false }} />
    </Stack>
  );
}
