import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ImportResult } from "../domain/types";

interface Props { result: ImportResult; onContinue: () => void; onCancel: () => void; }

export function ValidationScreen({ result, onContinue, onCancel }: Props) {
  const missing = result.missingRequired.length > 0;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>التحقق من ملف الحركة</Text>
      <Text style={styles.subtitle}>تم اكتشاف صف العناوين: {result.headerRowIndex + 1}</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>الأعمدة الأساسية</Text>
        {result.missingRequired.length ? <Text style={styles.error}>❌ الأعمدة المفقودة: {result.missingRequired.join("، ")}</Text> : <Text style={styles.success}>✅ تم التعرف على كل الأعمدة الأساسية</Text>}
        {!!result.optionalMissing.length && <Text style={styles.warning}>⚠️ اختيارية غير موجودة: {result.optionalMissing.join("، ")}</Text>}
      </View>
      <Text style={styles.sectionTitle}>معاينة أول 5 صفوف</Text>
      <ScrollView horizontal style={styles.tableScroll}>
        <View>
          <View style={styles.rowHeader}>{result.preview.headers.map((header, i) => <Text key={`${header}-${i}`} style={styles.headerCell}>{header || `عمود ${i + 1}`}</Text>)}</View>
          {result.preview.rows.map((row, r) => <View key={r} style={styles.row}>{result.preview.headers.map((_, c) => <Text key={c} style={styles.cell}>{row[c] ?? ""}</Text>)}</View>)}
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, missing && styles.disabled]} disabled={missing} onPress={onContinue}><Text style={styles.buttonText}>متابعة الاستيراد</Text></TouchableOpacity>
        <TouchableOpacity style={styles.cancel} onPress={onCancel}><Text style={styles.cancelText}>إلغاء وتعديل الملف</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 14, backgroundColor: "#F6F9FC", flexGrow: 1 },
  title: { fontSize: 24, fontWeight: "700", color: "#17365D", textAlign: "right" },
  subtitle: { fontSize: 14, color: "#60758A", textAlign: "right" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16, gap: 8, borderWidth: 1, borderColor: "#D9EAF7" },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#17365D", textAlign: "right" },
  success: { color: "#177245", textAlign: "right" }, error: { color: "#B42318", textAlign: "right" }, warning: { color: "#9A6700", textAlign: "right" },
  tableScroll: { backgroundColor: "#FFFFFF", borderRadius: 10, borderWidth: 1, borderColor: "#B7C9D6", minHeight: 180 },
  rowHeader: { flexDirection: "row-reverse", backgroundColor: "#D9EAF7" }, row: { flexDirection: "row-reverse", borderTopWidth: 1, borderTopColor: "#E7EEF3" },
  headerCell: { minWidth: 125, padding: 9, color: "#17365D", fontWeight: "700", textAlign: "right" }, cell: { minWidth: 125, padding: 9, color: "#243B53", textAlign: "right" },
  actions: { gap: 10, marginTop: 8 }, button: { backgroundColor: "#17365D", borderRadius: 10, padding: 15, alignItems: "center" }, disabled: { backgroundColor: "#A9B8C5" }, buttonText: { color: "#FFFFFF", fontWeight: "700" }, cancel: { padding: 14, alignItems: "center" }, cancelText: { color: "#17365D", fontWeight: "600" },
});
