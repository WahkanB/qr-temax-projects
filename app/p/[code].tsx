import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Platform, Linking } from "react-native";

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
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  bathroom_002: {
    title: "Баня • Проект 002",
    description: "Модерна баня • тъмни плочки",
    idea:
      "Тъмни плочки 60×120, топло LED осветление, душ зона с черни профили и матово стъкло, акцентна ниша и дървесни детайли.",
    images: [
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1400&q=80",
    ],
  },
};

function openWhatsApp(message: string) {
  const text = encodeURIComponent(message);
  // телефон по желание: https://wa.me/3598XXXXXXXX?text=...
  const url = `https://wa.me/?text=${text}`;
  Linking.openURL(url);
}

function openEmail(subject: string, body: string) {
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  const url = `mailto:?subject=${s}&body=${b}`;
  Linking.openURL(url);
}

export default function ProjectPage() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const clean = (code ?? "").trim().replace(/\s+/g, "").replace(/\n/g, "");
  const project = PROJECTS[clean];

  const pageTitle = project ? project.title : "Проект";

  return (
    <>
      <Stack.Screen options={{ title: pageTitle }} />
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.kicker}>Код: {clean || "—"}</Text>

        {!project ? (
          <View style={styles.card}>
            <Text style={styles.title}>Няма проект за този код</Text>
            <Text style={styles.desc}>
              Провери дали QR кодът сочи към правилния адрес (пример: /p/bathroom_001)
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>{project.title}</Text>
              <Text style={styles.desc}>{project.description}</Text>

              <Text style={styles.h2}>Идея</Text>
              <Text style={styles.text}>{project.idea}</Text>

              <Text style={styles.h2}>Снимки</Text>

              {project.images.map((src, i) => (
                <Image key={i} source={{ uri: src }} style={styles.img} resizeMode="cover" />
              ))}

              <View style={styles.row}>
                <Pressable
                  style={[styles.btn, styles.btnPrimary]}
                  onPress={() => openWhatsApp(`Здравейте! Интересувам се от ${project.title} (${clean}).`)}
                >
                  <Text style={styles.btnText}>WhatsApp</Text>
                </Pressable>

                <Pressable
                  style={[styles.btn, styles.btnDark]}
                  onPress={() =>
                    openEmail(
                      `Запитване за ${project.title}`,
                      `Здравейте,\n\nИнтересувам се от ${project.title} (код: ${clean}).\nМоля за оферта и срок.\n\nБлагодаря!`
                    )
                  }
                >
                  <Text style={styles.btnText}>Email</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.footerNote}>
              <Text style={styles.footerText}>
                Съвет: Генерирай QR кодове към линкове (URL), не към “plain text”.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, paddingBottom: 40, backgroundColor: "#fff" },
  kicker: { fontSize: 14, color: "#666", marginBottom: 12 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
  desc: { fontSize: 16, color: "#444", marginBottom: 14 },

  h2: { fontSize: 16, fontWeight: "800", marginTop: 10, marginBottom: 8 },
  text: { fontSize: 16, color: "#333", lineHeight: 22 },

  img: { width: "100%", height: 220, borderRadius: 14, marginTop: 10, backgroundColor: "#f2f2f2" },

  row: { flexDirection: "row", gap: 12, marginTop: 16 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#2b6cff" },
  btnDark: { backgroundColor: "#111827" },
  btnText: { color: "white", fontWeight: "800", fontSize: 16 },

  footerNote: { paddingTop: 12 },
  footerText: { fontSize: 13, color: "#777" },
});
