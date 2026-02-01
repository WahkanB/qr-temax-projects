// app/(tabs)/index.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/theme";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={s.page}>
      <View style={s.header}>
        <View style={s.logoSlot}>
          <Text style={s.logoText}>LOGO</Text>
        </View>
        <Text style={s.headerTitle}>Готови проекти</Text>
      </View>

      <View style={s.content}>
        <Text style={s.h1}>Сканирай QR код</Text>
        <Text style={s.p}>
          Насочи камерата към QR кода на проекта, за да отвориш готовия дизайн с нашите продукти.
        </Text>

        <Pressable style={s.cta} onPress={() => router.push("/scan")}>
          <Text style={s.ctaText}>Сканирай</Text>
        </Pressable>

        <Text style={s.smallHint}>
          * Клиентите виждат само готови проекти и материали.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    backgroundColor: COLORS.headerBg,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoSlot: {
    width: 46,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#00000055",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffffff22",
  },
  logoText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },

  content: { padding: 16 },
  h1: { fontSize: 20, fontWeight: "900", color: COLORS.text },
  p: { marginTop: 8, color: COLORS.muted, lineHeight: 20 },
  cta: {
    marginTop: 14,
    backgroundColor: COLORS.red,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  smallHint: { marginTop: 14, color: COLORS.muted, fontSize: 12 },
});
