// app/p/[code].tsx
import React, { useMemo, useState } from "react";
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { PROJECTS } from "@/constants/projects";

const { width } = Dimensions.get("window");

export default function ProjectScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const safeCode = String(code || "").trim();

  const project = useMemo(() => PROJECTS[safeCode], [safeCode]);
  const [active, setActive] = useState(0);

  if (!project) {
    return (
      <View style={s.center}>
        <Text style={s.title}>Проектът не е намерен</Text>
        <Text style={s.textMuted}>Код: {safeCode || "—"}</Text>
        <Pressable style={[s.btn, s.btnDark]} onPress={() => router.replace("/")}>
          <Text style={s.btnText}>Към скенера</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={s.page} contentContainerStyle={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.kicker}>{project.code}</Text>
        <Text style={s.title}>{project.title}</Text>
        {!!project.subtitle && <Text style={s.subtitle}>{project.subtitle}</Text>}

        {/* Tags */}
        {!!project.tags?.length && (
          <View style={s.tagsRow}>
            {project.tags.slice(0, 6).map((t) => (
              <View key={t} style={s.tag}>
                <Text style={s.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Gallery (horizontal swipe) */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const i = Math.round(x / width);
          if (i !== active) setActive(i);
        }}
        scrollEventThrottle={16}
        style={s.galleryWrap}
      >
        {project.images.map((uri, idx) => (
          <View key={`${uri}-${idx}`} style={{ width }}>
            <Image source={{ uri }} style={s.hero} />
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={s.dots}>
        {project.images.map((_, i) => (
          <View key={i} style={[s.dot, i === active && s.dotActive]} />
        ))}
      </View>

      {/* Idea card */}
      <View style={s.card}>
        <Text style={s.h2}>Идея</Text>
        <Text style={s.text}>{project.idea}</Text>
      </View>

      {/* Products (optional) */}
      {!!project.products?.length && (
        <View style={s.card}>
          <Text style={s.h2}>Използвани материали</Text>
          <View style={{ marginTop: 10 }}>
            {project.products.map((p, i) => (
              <View key={i} style={s.row}>
                <Text style={s.rowLabel}>{p.label}</Text>
                <Text style={s.rowValue}>{p.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* CTA */}
      <View style={s.ctaRow}>
        <Pressable
          style={[s.btn, s.btnPrimary]}
          onPress={() => {
            // TODO: по-късно може да стане mailto / WhatsApp / форма
            alert("Кажи ми: (1) име (2) град (3) размери на банята – и ти правим оферта.");
          }}
        >
          <Text style={s.btnText}>Искам оферта</Text>
        </Pressable>

        <Pressable style={[s.btn, s.btnDark]} onPress={() => router.replace("/")}>
          <Text style={s.btnText}>Сканирай друг QR</Text>
        </Pressable>
      </View>

      <Text style={s.footerNote}>
        * Проектите са примерни визии. Изпълняваме с наличните серии и налични мебели в магазина.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  container: { paddingBottom: 26 },

  header: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 8 },
  kicker: { fontSize: 12, color: "#777", marginBottom: 6 },
  title: { fontSize: 26, fontWeight: "800", color: "#111", lineHeight: 30 },
  subtitle: { marginTop: 6, fontSize: 15, color: "#444" },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  tag: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "#f3f4f6" },
  tagText: { fontSize: 12, color: "#333", fontWeight: "700" },

  galleryWrap: { marginTop: 10 },
  hero: { width: "100%", height: 320, backgroundColor: "#f2f2f2" },

  dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 10, marginBottom: 6 },
  dot: { width: 7, height: 7, borderRadius: 999, backgroundColor: "#ddd" },
  dotActive: { backgroundColor: "#111" },

  card: {
    marginTop: 12,
    marginHorizontal: 18,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },
  h2: { fontSize: 16, fontWeight: "800", color: "#111", marginBottom: 8 },
  text: { fontSize: 15, color: "#333", lineHeight: 22 },
  textMuted: { fontSize: 13, color: "#777", marginTop: 6 },

  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#eee" },
  rowLabel: { fontSize: 14, color: "#333", fontWeight: "700" },
  rowValue: { fontSize: 14, color: "#444", maxWidth: "60%", textAlign: "right" },

  ctaRow: { marginTop: 14, paddingHorizontal: 18, gap: 10 },
  btn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#2b6cff" },
  btnDark: { backgroundColor: "#111827" },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  footerNote: { marginTop: 14, paddingHorizontal: 18, fontSize: 12, color: "#777", lineHeight: 18 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 18, gap: 10 },
});
