// app/scan.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { COLORS } from "./constants/theme";

function parseCode(raw: string): string | null {
  const s = String(raw || "").trim();
  if (!s) return null;

  // Ако QR е линк към /p/xxx
  const m1 = s.match(/\/p\/([^/?#]+)/i);
  if (m1?.[1]) return decodeURIComponent(m1[1]);

  // Ако QR е само "bathroom_001"
  return s;
}

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOn, setCameraOn] = useState<boolean>(true);
  const scannedRef = useRef<boolean>(false);

  useEffect(() => {
    // при излизане от страницата – спира камерата
    return () => {
      setCameraOn(false);
    };
  }, []);

  const canUseCamera = useMemo(() => permission?.granted === true, [permission]);

  const onScanned = useCallback(
    (data: string) => {
      if (scannedRef.current) return;
      const code = parseCode(data);
      if (!code) return;

      scannedRef.current = true;
      setCameraOn(false);
      router.replace(`/p/${encodeURIComponent(code)}`);
    },
    [router]
  );

  return (
    <View style={s.page}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <Text style={s.headerTitle}>Сканиране</Text>
      </View>

      {!canUseCamera ? (
        <View style={s.center}>
          <Text style={s.h1}>Нужен е достъп до камера</Text>
          <Pressable style={s.cta} onPress={requestPermission}>
            <Text style={s.ctaText}>Разреши камера</Text>
          </Pressable>
        </View>
      ) : (
        <View style={s.cameraWrap}>
          {cameraOn ? (
            <CameraView
              style={s.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={(res) => onScanned(res.data)}
            />
          ) : (
            <View style={s.center}>
              <Text style={s.p}>Камерата е спряна.</Text>
              <Pressable
                style={s.cta}
                onPress={() => {
                  scannedRef.current = false;
                  setCameraOn(true);
                }}
              >
                <Text style={s.ctaText}>Пусни отново</Text>
              </Pressable>
            </View>
          )}

          <View style={s.hintBar}>
            <Text style={s.hintText}>Насочи камерата към QR кода</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    backgroundColor: COLORS.headerBg,
    paddingTop: Platform.OS === "web" ? 12 : 12,
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
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },

  cameraWrap: { flex: 1, padding: 14 },
  camera: { flex: 1, borderRadius: 16, overflow: "hidden" },

  hintBar: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    backgroundColor: "#00000099",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  hintText: { color: "#fff", fontWeight: "700" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  h1: { fontSize: 18, fontWeight: "900", color: COLORS.text, textAlign: "center" },
  p: { marginTop: 8, color: COLORS.muted, textAlign: "center" },
  cta: {
    marginTop: 14,
    backgroundColor: COLORS.red,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  ctaText: { color: "#fff", fontWeight: "900" },
});
