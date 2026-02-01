// app/p/[code].tsx
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS } from "../../constants/theme";
import { PROJECTS, Project, MaterialItem } from "../../constants/projects";

export default function ProjectPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string }>();
  const code = String(params.code || "").trim();

  const project: Project | null = useMemo(() => {
    return PROJECTS[code] ?? null;
  }, [code]);

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const width = Dimensions.get("window").width;

  if (!project) {
    return (
      <View style={s.page}>
        <View style={s.header}>
          <Pressable style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>←</Text>
          </Pressable>
          <Text style={s.headerTitle}>Проект</Text>
        </View>

        <View style={s.center}>
          <Text style={s.h1}>Няма такъв проект</Text>
          <Text style={s.p}>Код: {code || "(празен)"}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.page}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backText}>←</Text>
        </Pressable>

        {/* Слот за лого (ти после слагаш image) */}
        <View style={s.logoSlot}>
          <Text style={s.logoText}>LOGO</Text>
        </View>

        <Text style={s.headerTitle} numberOfLines={1}>
          Готов проект
        </Text>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {/* Slider Card */}
        <View style={s.sliderCard}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const idx = Math.round(x / (width - 32));
              setActiveIdx(idx);
            }}
            scrollEventThrottle={16}
          >
            {project.images.map((img: string, idx: number) => (
              <View key={`${project.code}-${idx}`} style={[s.slide, { width: width - 32 }]}>
                <Image source={{ uri: img }} style={s.slideImg} />
              </View>
            ))}
          </ScrollView>

          <View style={s.dots}>
            {project.images.map((_img: string, idx: number) => (
              <View
                key={`dot-${idx}`}
                style={[s.dot, idx === activeIdx ? s.dotActive : null]}
              />
            ))}
          </View>
        </View>

        {/* Title */}
        <Text style={s.codeSmall}>{project.code}</Text>
        <Text style={s.title}>{project.title}</Text>
        {project.subtitle ? <Text style={s.subtitle}>{project.subtitle}</Text> : null}

        {/* Tags */}
        {project.tags?.length ? (
          <View style={s.tagsWrap}>
            {project.tags.map((t: string) => (
              <View key={t} style={s.chip}>
                <Text style={s.chipText}>{t}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Idea */}
        {project.idea ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Идея</Text>
            <Text style={s.sectionText}>{project.idea}</Text>
          </View>
        ) : null}

        {/* Materials */}
        {project.materials?.length ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Използвани материали</Text>

            <View style={s.list}>
              {project.materials.map((m: MaterialItem, idx: number) => (
                <View key={`${m.code}-${idx}`} style={s.item}>
                  <Text style={s.itemName}>{m.name}</Text>
                  <Text style={s.itemSub}>
                    Код: {m.code}
                    {m.qty ? ` • ${m.qty}` : ""}
                    {m.note ? ` • ${m.note}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={{ height: 28 }} />
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
  backBtn: {
    width: 36,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#00000055",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffffff22",
  },
  backText: { color: "#fff", fontSize: 18, fontWeight: "900" },

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

  headerTitle: { flex: 1, color: "#fff", fontSize: 16, fontWeight: "900" },

  content: { padding: 16, paddingBottom: 24 },

  sliderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  slide: { height: 220, backgroundColor: COLORS.soft },
  slideImg: { width: "100%", height: "100%" },

  dots: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: "#fff",
  },
  dot: { width: 8, height: 8, borderRadius: 99, backgroundColor: "#D0D0D0" },
  dotActive: { backgroundColor: COLORS.red },

  codeSmall: { marginTop: 12, color: COLORS.muted, fontSize: 12 },
  title: { marginTop: 4, fontSize: 26, fontWeight: "900", color: COLORS.text },
  subtitle: { marginTop: 6, color: COLORS.muted, fontSize: 14 },

  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  chip: {
    backgroundColor: COLORS.red,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipText: { color: "#fff", fontWeight: "900" },

  section: {
    marginTop: 14,
    backgroundColor: COLORS.soft,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: COLORS.text },
  sectionText: { marginTop: 8, color: COLORS.text, lineHeight: 22 },

  list: { marginTop: 10, gap: 10 },
  item: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },
  itemName: { fontWeight: "900", color: COLORS.text, fontSize: 16 },
  itemSub: { marginTop: 4, color: COLORS.muted },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  h1: { fontSize: 18, fontWeight: "900", color: COLORS.text },
  p: { marginTop: 8, color: COLORS.muted },
});
