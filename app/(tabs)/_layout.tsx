// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { COLORS } from "../constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.red,
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
    </Tabs>
  );
}

