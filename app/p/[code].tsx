import { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Platform, Linking, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PROJECTS } from "../../constants/projects";

function getBaseUrl() {
  // На web: взима текущия домейн
  if (Platform.OS === "web" && typeof window !== "undefined") return window.location.origin;
  return ""; // mobile: няма нужда за share линк по домейн тук
}

export default function ProjectScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();

  const project = useMemo(() => {
    const key = String(code || "").trim();
    return PROJECTS[key];
  }, [code]);

  const shareUrl = useMemo(() => {
    const base = getBaseUrl();
    const safe = encodeURIComponent(String(code || ""));
    return base ? `${base}/p/${safe}` : "";
  }, [code]);

  if (!project) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>Няма такъв проект</Text>
        <Text style={styles.desc}>Код: {String(code || "")}</Text>

        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => router.push("/")}>
          <Text style={styles.btnText}>Сканирай друг код</Text>
        </Pressable>
      </View>
    );
  }

  const onWhatsApp = async () => {
    const msg = `Здравей! Интересувам се от: ${project.title}${shareUrl ? `\n${shareUrl}` : ""}`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    await Linking.openURL(url);
  };

  const onEmail = async () => {
    const subject = `Запитване: ${project.title}`;
    const body = `Здравейте,\n\nИнтересувам се от проекта:\n${project.title}\nКод: ${project.code}\n${shareUrl ? `Линк: ${shareUrl}\n` : ""}\nПоздрави,`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    await Linking.openURL(url);
  };

  const onCopyLink = async () => {
    if (Platform.OS === "web" && typeof navigator !== "undefined" && "clipboard" in navigator && shareUrl) {
      // @ts-ignore
      await navigator.clipboard.writeText(shareUrl);
      Alert.alert("Готово", "Линкът е копиран.");
      return;
    }
    Alert.alert("Линк", shareUrl || "Няма линк (само web показва домейн автоматично).");
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>{project.title}</Text>
      <Text style={styles.desc}>{project.subtitle}</Text>

      <Text style={styles.h2}>Идея</Text>
      <Text style={styles.text}>{project.idea}</Text>

      <Text style={styles.h2}>Снимки</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
        {project.images.map((src, idx) => (
          <Image key={src + idx} source={{ uri: src }} style={styles.img} />
        ))}
      </ScrollView>

      <View style={styles.row}>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={onWhatsApp}>
          <Text style={styles.btnText}>WhatsApp</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.btnDark]} onPress={onEmail}>
          <Text style={styles.btnText}>Email</Text>
        </Pressable>
      </View>

      <View style={styles.row2}>
        <Pressable style={[styles.btn, styles.btnGhost]} onPress={onCopyLink}>
          <Text style={styles.btnGhostText}>Копирай линк</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => router.push("/")}>
          <Text style={styles.btnGhostText}>Сканирай друг код</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>Код: {project.code}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 18, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 6 },
  desc: { fontSize: 15, color: "#444", marginBottom: 14 },

  h2: { fontSize: 16, fontWeight: "800", marginTop: 10, marginBottom: 6 },
  text: { fontSize: 15, color: "#333", lineHeight: 22 },

  gallery: { marginTop: 6, marginBottom: 10 },
  img: { width: 290, height: 190, borderRadius: 14, marginRight: 12, backgroundColor: "#f2f2f2" },

  row: { flexDirection: "row", gap: 12, marginTop: 12 },
  row2: { flexDirection: "row", gap: 12, marginTop: 10 },

  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  btnPrimary: { backgroundColor: "#2563eb" },
  btnDark: { backgroundColor: "#111827" },
  btnGhost: { backgroundColor: "#f3f4f6" },

  btnText: { color: "white", fontWeight: "800", fontSize: 16 },
  btnGhostText: { color: "#111827", fontWeight: "800", fontSize: 15 },

  footer: { marginTop: 14, fontSize: 13, color: "#777" },
});

