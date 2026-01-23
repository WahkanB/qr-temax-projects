// app/p/[code].tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

// ===== TEMAX COLOR PALETTE =====
const COLORS = {
  bg: "#0f1115", // основен фон
  card: "#161a22", // карти
  border: "#262b36", // бордери
  text: "#ffffff", // основен текст
  muted: "#b3b6bf", // вторичен текст
  red: "#c4161c", // акцент червено
  redDark: "#9f1217",
};

// ===== DATA TYPES =====
type ProjectItem = {
  sku: string; // ваш артикулен код
  name: string; // име на продукта
  qty?: string; // количество (по желание)
  note?: string; // бележка (по желание)
};

type Project = {
  code: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  images: string[]; // URL-и на снимки
  idea?: string;
  materials?: ProjectItem[];
  contactUrl?: string; // WhatsApp / сайт / форма
};

// ===== DEMO DATA (после можеш да го изнесеш в constants/projects.ts) =====
const PROJECTS: Record<string, Project> = {
  bathroom_001: {
    code: "bathroom_001",
    title: "Баня • Проект 001",
    subtitle: "Гранитогрес + мебели от нашия магазин",
    tags: ["60×120", "черни акценти", "LED ниша", "огледало LED"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&auto=format&fit=crop&q=60",
    ],
    idea:
      "Съвременна баня в светли тонове: голямоформатни плочки 60×120, черни акценти, ниша в душа с LED лента и огледало с подсветка.",
    materials: [
      { sku: "GR-60120-CL01", name: "Гранитогрес 60×120 (светъл камък)", qty: "18 м²" },
      { sku: "PR-BLACK-SET", name: "Черни смесители комплект", qty: "1 бр", note: "мат" },
      { sku: "LED-IP65-3000K", name: "LED лента IP65 3000K", qty: "3 м" },
      { sku: "MIR-LED-80", name: "Огледало LED 80 см", qty: "1 бр" },
    ],
    // Сложи твоя реален WhatsApp (примерният е фиктивен)
    contactUrl: "https://wa.me/359000000000?text=Здравейте!%20Интересува%20ме%20проект%20bathroom_001",
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionBody}>{children}</View>
    </View>
  );
}

export default function ProjectPage() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const safeCode = String(code || "").trim();

  const project = useMemo(() => PROJECTS[safeCode], [safeCode]);

  const [active, setActive] = useState(0);
  const W = Dimensions.get("window").width;
  const heroH = Math.round(W * 0.62);

  const copyLink = async (url: string) => {
    if (Platform.OS === "web" && typeof navigator !== "undefined" && "clipboard" in navigator) {
      // @ts-ignore
      await navigator.clipboard.writeText(url);
      Alert.alert("Готово", "Линкът е копиран.");
      return;
    }
    Alert.alert("Линк", url);
  };

  if (!project) {
    return (
      <ScrollView style={s.page} contentContainerStyle={s.notFoundWrap}>
        <Text style={s.notFoundTitle}>Проектът не е намерен</Text>
        <Text style={s.notFoundText}>Код: {safeCode || "—"}</Text>
        <Text style={[s.notFoundText, { marginTop: 6 }]}>
          Провери QR кода или адреса.
        </Text>

        <Pressable style={s.btnPrimary} onPress={() => router.replace("/")}>
          <Text style={s.btnPrimaryText}>Към началото</Text>
        </Pressable>
      </ScrollView>
    );
  }

  const onAsk = async () => {
    if (!project.contactUrl) return;
    try {
      await Linking.openURL(project.contactUrl);
    } catch {
      Alert.alert("Грешка", "Не успях да отворя линка за контакт.");
    }
  };

  const shareUrl =
    Platform.OS === "web" && typeof window !== "undefined"
      ? window.location.href
      : `https://max-projects.vercel.app/p/${encodeURIComponent(project.code)}`;

  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      {/* HEADER (Temax style) */}
      <View style={s.header}>
        {/* Placeholder for your logo (you'll replace later with <Image/>) */}
        <View style={s.logoPlaceholder}>
          <Text style={s.logoText}>LOGO</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={s.brand}>TEMAX</Text>
          <Text style={s.brandSub}>Готови интериорни проекти</Text>
        </View>

        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backText}>Назад</Text>
        </Pressable>
      </View>

      {/* HERO / GALLERY */}
      <View style={s.heroCard}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            const idx = Math.round(x / (W - 32)); // ширината на hero
            setActive(Math.max(0, Math.min(idx, project.images.length - 1)));
          }}
        >
          {project.images.map((uri, idx) => (
            <View key={uri + idx} style={{ width: W - 32, height: heroH }}>
              <Image source={{ uri }} style={s.heroImg} />
              <View style={s.heroOverlay} />
            </View>
          ))}
        </ScrollView>

        <View style={s.dotsRow}>
          {project.images.map((_, idx) => (
            <View key={idx} style={[s.dot, idx === active ? s.dotActive : null]} />
          ))}
        </View>

        <View style={s.heroMeta}>
          <Text style={s.codeText}>{project.code}</Text>
          <Text style={s.title}>{project.title}</Text>
          {!!project.subtitle && <Text style={s.subtitle}>{project.subtitle}</Text>}

          {!!project.tags?.length && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
              {project.tags.map((t) => (
                <View key={t} style={s.tag}>
                  <Text style={s.tagText}>{t}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>

      {/* IDEA */}
      {!!project.idea && (
        <Section title="Идея">
          <Text style={s.paragraph}>{project.idea}</Text>
        </Section>
      )}

      {/* MATERIALS */}
      {!!project.materials?.length && (
        <Section title="Използвани материали">
          <View style={{ marginTop: 2 }}>
            {project.materials.map((m) => (
              <View key={m.sku} style={s.itemCard}>
                <View style={s.itemTop}>
                  <Text style={s.itemName}>{m.name}</Text>
                  {!!m.qty && <Text style={s.qty}>{m.qty}</Text>}
                </View>

                <View style={s.itemBottom}>
                  <Text style={s.skuText}>Код: {m.sku}</Text>
                  {!!m.note && <Text style={s.note}>{m.note}</Text>}
                </View>
              </View>
            ))}
          </View>
        </Section>
      )}

      {/* CTA */}
      <View style={s.ctaCard}>
        <Text style={s.ctaTitle}>Искаш оферта по този проект?</Text>
        <Text style={s.ctaText}>
          Изпрати ни кода <Text style={s.ctaCode}>{project.code}</Text> и ще ти дадем цена и наличности.
        </Text>

        <Pressable style={s.btnPrimary} onPress={onAsk}>
          <Text style={s.btnPrimaryText}>Попитай за оферта</Text>
        </Pressable>

        <Pressable style={s.btnGhost} onPress={() => copyLink(shareUrl)}>
          <Text style={s.btnGhostText}>Копирай линк</Text>
        </Pressable>
      </View>

      <Text style={s.footer}>© {new Date().getFullYear()} TEMAX • Projects</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    padding: 16,
    paddingBottom: 28,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },

  logoPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
  },

  brand: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  brandSub: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },

  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "900",
  },

  /* HERO */
  heroCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  heroImg: {
    width: "100%",
    height: "100%",
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },

  dotsRow: {
    position: "absolute",
    bottom: 12,
    left: 16,
    flexDirection: "row",
    gap: 6,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: "#555",
  },

  dotActive: {
    backgroundColor: COLORS.red,
  },

  heroMeta: {
    padding: 14,
  },

  codeText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },

  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "900",
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },

  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  tagText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "700",
  },

  /* SECTION */
  section: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },

  sectionTitle: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
  },

  sectionBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },

  paragraph: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
  },

  /* MATERIALS */
  itemCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#1c212c",
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.red,
  },

  itemTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  itemName: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
  },

  qty: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
  },

  itemBottom: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  skuText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "800",
  },

  note: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
  },

  /* CTA */
  ctaCard: {
    marginTop: 18,
    borderRadius: 18,
    padding: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  ctaTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "900",
  },

  ctaText: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },

  ctaCode: {
    color: COLORS.red,
    fontWeight: "900",
  },

  btnPrimary: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.red,
    alignItems: "center",
  },

  btnPrimaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  btnGhost: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.red,
    alignItems: "center",
  },

  btnGhostText: {
    color: COLORS.red,
    fontSize: 15,
    fontWeight: "900",
  },

  footer: {
    marginTop: 18,
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 12,
  },

  /* NOT FOUND */
  notFoundWrap: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.bg,
  },
  notFoundTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  notFoundText: {
    marginTop: 8,
    color: COLORS.muted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 10,
  },
});
