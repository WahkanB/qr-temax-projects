import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

/* ================= TEMAX COLORS ================= */
const COLORS = {
  bg: "#ffffff",
  header: "#2b2b2b",
  card: "#b0b0b0",
  border: "#e5e5e5",
  text: "#ffffff",
  muted: "#666666",
  red: "#E2222E",
};

/* ================= DATA ================= */
const PROJECTS: Record<string, any> = {
  bathroom_001: {
    title: "Баня • Проект 001",
    subtitle: "Гранитогрес + мебели от Temax",
    tags: ["60×120", "черни акценти", "LED ниша", "LED огледало"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600",
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1600",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600",
    ],
    idea:
      "Съвременна баня в светли тонове с голямоформатни плочки 60×120, черни смесители и LED акценти.",
    materials: [
      { sku: "GR-60120", name: "Гранитогрес 60×120", qty: "18 м²" },
      { sku: "MX-BLACK", name: "Черни смесители", qty: "1 комплект" },
      { sku: "LED-3000K", name: "LED лента 3000K", qty: "3 м" },
    ],
  },
};

export default function ProjectPage() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const project = useMemo(() => PROJECTS[String(code)], [code]);
  const [active, setActive] = useState(0);

  const W = Dimensions.get("window").width;
  const sliderW = W - 32;
  const sliderH = Math.round(sliderW * 0.6);

  if (!project) {
    return (
      <View style={s.center}>
        <Text>Проектът не е намерен</Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.page}>
      {/* ============ HEADER ============ */}
      <View style={s.header}>
        <View style={s.logoBox}>
          <Text style={s.logoText}>LOGO</Text>
          
        </View>
        <Text style={s.headerTitle}>Готов проект</Text>
      </View>

      {/* ============ CONTENT ============ */}
      <View style={s.container}>
        {/* Slider */}
        <View style={s.sliderCard}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const i = Math.round(
                e.nativeEvent.contentOffset.x / sliderW
              );
              setActive(i);
            }}
          >
            {project.images.map((img: string, i: number) => (
              <Image
                key={i}
                source={{ uri: img }}
                style={{ width: sliderW, height: sliderH }}
              />
            ))}
          </ScrollView>

          <View style={s.dots}>
            {project.images.map((_: any, i: number) => (
              <View
                key={i}
                style={[
                  s.dot,
                  i === active && { backgroundColor: COLORS.red },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Title */}
        <Text style={s.title}>{project.title}</Text>
        <Text style={s.subtitle}>{project.subtitle}</Text>

        {/* Tags */}
        <View style={s.tags}>
          {project.tags.map((t: string) => (
            <View key={t} style={s.tag}>
              <Text style={s.tagText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Idea */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Идея</Text>
          <Text style={s.text}>{project.idea}</Text>
        </View>

        {/* Materials */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Използвани материали</Text>
          {project.materials.map((m: any) => (
            <View key={m.sku} style={s.material}>
              <Text style={s.materialName}>{m.name}</Text>
              <Text style={s.materialMeta}>
                Код: {m.sku} • {m.qty}
              </Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable style={s.cta}>
          <Text style={s.ctaText}>Поискай оферта за този проект</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const s = StyleSheet.create({
  page: { backgroundColor: COLORS.bg, flex: 1 },

  header: {
    backgroundColor: COLORS.header,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBox: {
    width: 48,
    height: 48,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  logoText: { color: "#ccc", fontSize: 10 },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  container: { padding: 16 },

  sliderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 8,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 16,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 12,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: COLORS.red,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: { fontSize: 12, fontWeight: "600" },

  card: {
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  text: { fontSize: 14, color: "#fff", lineHeight: 20 },

  material: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.header,
  },
  materialName: { fontWeight: "600" },
  materialMeta: { fontSize: 12, color:"#fff" },

  cta: {
    backgroundColor: COLORS.red,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
