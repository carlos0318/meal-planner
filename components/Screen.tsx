import { View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenProps {
  children: React.ReactNode;
}

const Screen = ({ children }: ScreenProps) => {
  const insets = useSafeAreaInsets();

  const styles = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    flex: 1,
  };

  return <View style={styles}>{children}</View>;
};

export default Screen;
