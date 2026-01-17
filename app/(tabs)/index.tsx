import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

type Project = {
  title: string;
  description: string;
  idea: string;
  images: string[];
};

const PROJECTS: Record<string, Project> = {
  bathroom_001: {
    title: "Баня • Проект 001",
    description: "Гранитогрес + мебели от нашия магазин",
    idea:
      "Съвременна баня в светли тонове: голямоформатни плочки 60×120, черни акценти, ниша в душа с LED лента и огледало с подсветка.",
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1600566753104-55f4f4b1b37b?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1600566753040-7f4c7a2d8d57?auto=format&fit=crop&w=1400&q=70",
    ],
  },

  bathroom_002: {
    title: "Баня • Проект 002",
    description: "Модерна баня • тъмни плочки",
    idea:
      "Луксозно усещане: тъмни матови плочки, златни/месингови смесители, стъклен параван и плот от камък. Контраст с топло осветление.",
    images: [
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3b?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1600566753131-8f31d3d0f2d5?auto=format&fit=crop&w=1400&q=70",
    ],
  },

  test_123: {
    title: "Тестов проект",
    description: "Само за проверка",
    idea: "Тестова идея за UI.",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=70",
    ],
  },
};

// ======= ПОПЪЛНИ ТУК =======
const WHATSAPP_PHONE_E164 = "+359888123456"; // пример: +35988xxxxxxx (задължително с + и код)
const EMAIL_TO = "sales@yourshop.bg"; // пример: sales@temax.bg
// ===========================

function normalizeCode(raw: string) {
  return raw.replace(/\s+/g, "").trim();
}

function buildInquiryText(projectCode: string, project: Project) {
  // текстът, който ще се изпрати към WhatsApp и Email
  return `Здравейте! Интересувам се от проект: ${project.title} (код: ${projectCode}).
Описание: ${project.description}

Моля за оферта/информация:`;
}

async function safeOpenUrl(url: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("Не може да се отвори", "Няма подходящо приложение за това действие.");
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert("Грешка", "Не успях да отворя връзката.");
  }
}

function openWhatsApp(phoneE164: string, text: string) {
  // wa.me изисква телефон без + и без интервали
  const digits = phoneE164.replace(/[^\d]/g, "");
  const msg = encodeURIComponent(text);
  const url = `https://wa.me/${digits}?text=${msg}`;
  return safeOpenUrl(url);
}

function openEmail(to: string, subject: string, body: string) {
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);

  // mailto works on iOS/Android if mail app exists
  const url = `mailto:${to}?subject=${s}&body=${b}`;
  return safeOpenUrl(url);
}

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const [scanning, setScanning] = useState(true);
  const [raw, setRaw] = useState<string>("");
  const [code, setCode] = useState<string | null>(null);

  const lockRef = useRef(false);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  const project = useMemo(() => {
    if (!code) return null;
    return PROJECTS[code] ?? null;
  }, [code]);

  const onScanned = (data: string) => {
    if (lockRef.current) return;
    lockRef.current = true;

    setRaw(data);
    const normalized = normalizeCode(data);
    setCode(normalized);
    setScanning(false);

    setTimeout(() => {
      lockRef.current = false;
    }, 900);
  };

  const resetScan = () => {
    setRaw("");
    setCode(null);
    setScanning(true);
  };

  const onInquiryWhatsApp = () => {
    if (!project || !code) return;
    const text = buildInquiryText(code, project);
    openWhatsApp(WHATSAPP_PHONE_E164, text);
  };

  const onInquiryEmail = () => {
    if (!project || !code) return;
    const subject = `Запитване за ${project.title} (${code})`;
    const body = buildInquiryText(code, project);
    openEmail(EMAIL_TO, subject, body);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Искам достъп до камерата…</Text>
        <Pressable style={styles.btn} onPress={() => requestPermission()}>
          <Text style={styles.btnText}>Разреши камера</Text>
        </Pressable>
      </View>
    );
  }

  // === SCAN MODE ===
  if (scanning) {
    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={(result) => {
            const data = (result as any)?.data;
            if (typeof data === "string" && data.length > 0) onScanned(data);
          }}
        />

        <View style={styles.overlay}>
          <Text style={styles.title}>QR Scanner</Text>
          <Text style={styles.codeHint}>Насочи камерата към QR кода</Text>

          <View style={{ height: 10 }} />

          <Pressable style={styles.btnGhost} onPress={resetScan}>
            <Text style={styles.btnGhostText}>Нулирай</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // === RESULT MODE ===
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <Text style={styles.h1}>QR: {code ?? "-"}</Text>
      <Text style={styles.muted}>RAW: {JSON.stringify(raw)}</Text>

      <View style={{ height: 14 }} />

      {project ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{project.title}</Text>
          <Text style={styles.cardDesc}>{project.description}</Text>

          <View style={{ height: 10 }} />

          <Text style={styles.ideaLabel}>Идея</Text>
          <Text style={styles.ideaText}>{project.idea}</Text>

          <View style={{ height: 14 }} />

          <Text style={styles.ideaLabel}>Снимки</Text>
          <Gallery images={project.images} />

          <View style={{ height: 16 }} />

          {/* Запитване (WhatsApp + Email) */}
          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.btnHalf]} onPress={onInquiryWhatsApp}>
              <Text style={styles.btnText}>WhatsApp</Text>
            </Pressable>

            <View style={{ width: 10 }} />

            <Pressable style={[styles.btnDark, styles.btnHalf]} onPress={onInquiryEmail}>
              <Text style={styles.btnText}>Email</Text>
            </Pressable>
          </View>

          <View style={{ height: 12 }} />

          <Pressable style={styles.btnOutline} onPress={resetScan}>
            <Text style={styles.btnOutlineText}>Сканирай друг код</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Няма проект за този код</Text>
          <Text style={styles.cardDesc}>Провери дали кодът е добавен в PROJECTS.</Text>

          <View style={{ height: 14 }} />
          <Pressable style={styles.btn} onPress={resetScan}>
            <Text style={styles.btnText}>Сканирай отново</Text>
          </Pressable>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function Gallery({ images }: { images: string[] }) {
  const w = Dimensions.get("window").width;
  const imgW = Math.min(w - 48, 520);
  const imgH = Math.round(imgW * 0.62);

  if (!images?.length) return <Text style={styles.muted}>Няма добавени снимки.</Text>;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
      {images.map((uri, idx) => (
        <View key={`${uri}_${idx}`} style={[styles.imgWrap, { width: imgW }]}>
          <Image
            source={{ uri }}
            style={{ width: imgW, height: imgH, borderRadius: 14 }}
            resizeMode="cover"
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  page: { flex: 1, backgroundColor: "#fff" },
  pageContent: { padding: 16, paddingBottom: 40 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },

  overlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: "rgba(0,0,0,0.70)",
    padding: 14,
    borderRadius: 16,
  },

  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  codeHint: { color: "#fff", fontSize: 14, opacity: 0.9, marginTop: 6 },

  h1: { fontSize: 22, fontWeight: "800" },
  muted: { color: "#666", marginTop: 6 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9e9e9",
    padding: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: "800" },
  cardDesc: { marginTop: 6, fontSize: 15, color: "#333" },

  ideaLabel: { fontSize: 13, fontWeight: "800", color: "#555", marginTop: 2 },
  ideaText: { marginTop: 6, fontSize: 14.5, color: "#222", lineHeight: 20 },

  imgWrap: { marginRight: 12 },

  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  btnHalf: { flex: 1 },

  btn: {
    backgroundColor: "#2F66FF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnDark: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  btnOutline: {
    borderWidth: 1,
    borderColor: "#d7d7d7",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnOutlineText: { color: "#111", fontSize: 16, fontWeight: "700" },

  btnGhost: {
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  btnGhostText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
