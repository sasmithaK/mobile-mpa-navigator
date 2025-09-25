import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function ReportIssueScreen() {
  const [report, setReport] = useState("");

  const submitReport = () => {
    if (!report.trim()) return;
    console.log("Reported issue:", report);
    setReport("");
    alert("Issue submitted successfully ✅");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 Report Marine Issue</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the issue..."
        value={report}
        onChangeText={setReport}
        multiline
      />
      <Button title="Submit Report" onPress={submitReport} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    height: 100,
    marginBottom: 10,
  },
});
