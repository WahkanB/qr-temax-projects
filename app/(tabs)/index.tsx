// app/(tabs)/index.tsx
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import { router } from "expo-router";

export default function HomeScreen() {
  const [permissionAsked, setPermissionAsked] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [scanned, setScanned] = useState(false);

  const requestPermission = async () => {
    setPermissionAsked(true);
    setCameraOn(true);
    setScanned(false);
  };

  const onBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    const raw = String(data || "").trim();
    if (!raw) return;

    let code = raw;
    const m = raw.match(/\/p\/([^/?#]+)/i);
    if (m?.[1]) code = decodeURIComponent(m[1]);

    setScanned(true);
    setCameraOn(false);
    router.push(`/p/${encodeURIComponent(code)}`);
  };

  return (
    <View style={s.page}>
      <View style={s.top}>
        <Text style={s.brand}>QR Showroom</Text>
        <Text style={s.sub}>Сканирай QR и виж готови проекти с материали от магазина.</Text>
      </View>

      <View style={s.card}>
        {!cameraOn ? (
          <>
            <Text style={s.h2}>Сканиране</Text>
            <Text style={s.note}>
              {permissionAsked ? "Натисни пак, ако браузърът е отказал камерата." : "Ще поиска разрешение за камера."}
            </Text>

            <Pressable style={[s.btn, s.btnPrimary]} onPress={requestPermission}>
              <Text style={s.btnText}>📷 Сканирай QR код</Text>
            </Pressable>

            <Pressable style={[s.btn, s.btnDark]} onPress={() => router.push("/p/bathroom_001")}>
              <Text style={s.btnText}>Виж пример (bathroom_001)</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={s.h2}>Насочи камерата към QR кода</Text>
            <View style={s.cameraWrap}>
              <CameraView
                style={s.camera}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={onBarcodeScanned}
              />
            </View>

            <Pressable style={[s.btn, s.btnDark]} onPress={() => setCameraOn(false)}>
              <Text style={s.btnText}>Затвори камерата</Text>
            </Pressable>
          </>
        )}
      </View>

      <Text style={s.footer}>© Showroom • Темакс</Text>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff", padding: 18 },
  top: { paddingTop: 6, paddingBottom: 14 },
  brand: { fontSize: 28, fontWeight: "900", color: "#111" },
  sub: { marginTop: 6, fontSize: 15, color: "#444", lineHeight: 22 },

  card: { borderWidth: 1, borderColor: "#eee", borderRadius: 18, padding: 16, backgroundColor: "#fff" },
  h2: { fontSize: 16, fontWeight: "900", color: "#111" },
  note: { marginTop: 6, fontSize: 13, color: "#666", marginBottom: 12 },

  cameraWrap: { marginTop: 12, borderRadius: 16, overflow: "hidden", backgroundColor: "#f2f2f2" },
  camera: { width: "100%", height: 340 },

  btn: { paddingVertical: 14, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 10 },
  btnPrimary: { backgroundColor: "#2b6cff" },
  btnDark: { backgroundColor: "#111827" },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  footer: { marginTop: 14, fontSize: 12, color: "#777", textAlign: "center" },
});
