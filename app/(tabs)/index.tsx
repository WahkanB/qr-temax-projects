import { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOn, setCameraOn] = useState(false);
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

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
    setScanned(true);
    setCameraOn(false); // ⛔ СПИРА камерата
    alert("QR код: " + data);
  };

  return (
    <View style={styles.container}>
      {!cameraOn && (
        <Pressable style={styles.btn} onPress={() => {
          setScanned(false);
          setCameraOn(true);
        }}>
          <Text style={styles.btnText}>📷 Сканирай QR код</Text>
        </Pressable>
      )}

      {cameraOn && (
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  camera: {
    width: "100%",
    height: 400,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  stopBtn: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
