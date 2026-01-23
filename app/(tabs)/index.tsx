import { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOn, setCameraOn] = useState(false);
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Нужен е достъп до камерата</Text>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Разреши камера</Text>
        </Pressable>
      </View>
    );
  }

  const onBarcodeScanned = ({ data }: { data: string }) => {
  const raw = String(data || "").trim();
  if (!raw) return;

  // приема и "bathroom_001" и "https://site.com/p/bathroom_001"
  let code = raw;
  const m = raw.match(/\/p\/([^/?#]+)/i);
  if (m?.[1]) code = decodeURIComponent(m[1]);

  setScanned(true);
  setCameraOn(false);
  router.push(`/p/${encodeURIComponent(code)}`);
};


  return (
    <View style={styles.container}>
      {!cameraOn ? (
        <>
          <Text style={styles.h1}>QR Scanner</Text>
          <Text style={styles.p}>Сканирай код и виж проекта веднага.</Text>

          <Pressable
            style={styles.btn}
            onPress={() => {
              setScanned(false);
              setCameraOn(true);
            }}
          >
            <Text style={styles.btnText}>📷 Сканирай QR код</Text>
          </Pressable>
        </>
      ) : (
        <>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
          />

          <Pressable style={styles.stopBtn} onPress={() => setCameraOn(false)}>
            <Text style={styles.btnText}>⛔ Спри камерата</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 18 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 18 },
  h1: { fontSize: 24, fontWeight: "800", marginBottom: 6 },
  p: { fontSize: 15, color: "#444", marginBottom: 14, textAlign: "center" },
  text: { fontSize: 16, marginBottom: 12, textAlign: "center" },
  camera: { width: "100%", height: 420, borderRadius: 14, overflow: "hidden" },
  btn: { backgroundColor: "#2563eb", paddingVertical: 14, paddingHorizontal: 18, borderRadius: 12 },
  stopBtn: { backgroundColor: "#111827", paddingVertical: 14, paddingHorizontal: 18, borderRadius: 12, marginTop: 10 },
  btnText: { color: "white", fontSize: 16, fontWeight: "700" },
});
