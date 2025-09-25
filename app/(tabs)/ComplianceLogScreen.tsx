import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, FlatList } from "react-native";

export default function ComplianceLogScreen() {
  const [logs, setLogs] = useState<{ id: string; text: string }[]>([]);
  const [entry, setEntry] = useState("");

  const addLog = () => {
    if (entry.trim() !== "") {
      setLogs([...logs, { id: Date.now().toString(), text: entry }]);
      setEntry("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compliance Log ✅</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter eco-compliance activity..."
        value={entry}
        onChangeText={setEntry}
      />
      <Button title="Add Log" onPress={addLog} color="#1E90FF" />

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.logItem}>• {item.text}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F0F8FF" },
  title: { fontSize: 22, fontWeight: "bold", color: "#004080", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 8 },
  logItem: { fontSize: 16, marginTop: 5, color: "#006699" },
});
