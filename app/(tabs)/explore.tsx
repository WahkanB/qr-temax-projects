// app/(tabs)/explore.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/theme";
import { PROJECTS } from "../constants/projects";

export default function ExploreScreen() {
  const router = useRouter();
  const list = Object.values(PROJECTS);

  return (
    <View style={s.page}>
      <View style={s.header}>
        <View style={s.logoSlot}>
          <Text style={s.logoText}>LOGO</Text>
        </View>
        <Text style={s.headerTitle}>Каталог проекти</Text>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {list.map((p) => (
          <Pressable key={p.code} style={s.card} onPress={() => router.push(`/p/${p.code}`)}>
            <Image source={{ uri: p.images[0] }} style={s.cardImg} />
            <View style={s.cardBody}>
              <Text style={s.cardTitle}>{p.title}</Text>
              {p.subtitle ? <Text style={s.cardSub}>{p.subtitle}</Text> : null}
              <Text style={s.cardCode}>{p.code}</Text>
            </View>
          </Pressable>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
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
  logoText: { color: "#fff", fontSize: 11, fontWeight: "900" },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },

  content: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginBottom: 12,
  },
  cardImg: { width: "100%", height: 160, backgroundColor: COLORS.soft },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text },
  cardSub: { marginTop: 4, color: COLORS.muted },
  cardCode: { marginTop: 8, color: COLORS.muted, fontSize: 12 },
});
