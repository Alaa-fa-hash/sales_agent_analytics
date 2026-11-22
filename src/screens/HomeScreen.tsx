import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import { importMovementsFromExcel } from "../domain/excelImporter";
import { ImportResult } from "../domain/types";
import { ValidationScreen } from "../components/ValidationScreen";

export function HomeScreen() {
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const pickFile = async () => {
    try {
      const picked = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.xls, DocumentPicker.types.xlsx], copyTo: "cachesDirectory" });
      const path = picked.fileCopyUri?.replace("file://", "") || picked.uri;
      const binary = await RNFS.readFile(path, "base64");
      const parsed = importMovementsFromExcel(binary, "base64");
      setResult(parsed);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) return;
      Alert.alert("تعذر قراءة الملف", error instanceof Error ? error.message : "حدث خطأ غير متوقع");
    }
  };
  if (result) return <ValidationScreen result={result} onContinue={() => setLoadedCount(result.movements.length)} onCancel={() => setResult(null)} />;
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>sales_agent_analytics</Text>
      <Text style={styles.title}>حركة المواد والمندوبين</Text>
      <Text style={styles.description}>استورد ملف Excel لمعاينة الحركة قبل إدخالها. يدعم التطبيق عددًا غير محدود من المواد والمندوبين ويعمل محليًا دون إنترنت.</Text>
      <TouchableOpacity style={styles.button} onPress={pickFile}><Text style={styles.buttonText}>اختيار ملف Excel</Text></TouchableOpacity>
      {loadedCount > 0 && <Text style={styles.loaded}>تم تحميل {loadedCount} سجل حركة</Text>}
      <View style={styles.note}><Text style={styles.noteTitle}>المرحلة الأولى</Text><Text style={styles.noteText}>استيراد Excel + كشف الأعمدة + معاينة أول 5 صفوف</Text></View>
    </View>
  );
}

export default HomeScreen;
const styles = StyleSheet.create({ container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#F6F9FC", gap: 16 }, kicker: { color: "#3E78A4", textAlign: "right", fontSize: 13, fontWeight: "700" }, title: { color: "#17365D", fontSize: 29, fontWeight: "800", textAlign: "right" }, description: { color: "#526A7D", fontSize: 16, lineHeight: 26, textAlign: "right" }, button: { backgroundColor: "#17365D", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 10 }, buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" }, loaded: { color: "#177245", textAlign: "center" }, note: { marginTop: 18, padding: 16, backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#D9EAF7" }, noteTitle: { color: "#17365D", fontWeight: "700", textAlign: "right" }, noteText: { color: "#60758A", marginTop: 5, textAlign: "right" } });
