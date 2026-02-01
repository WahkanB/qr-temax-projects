// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="scan" />
      <Stack.Screen name="p/[code]" />
    </Stack>
  );
}
