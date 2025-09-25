import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import Card from "../../components/Card";
import { awarenessData } from "../../constants/awarenessData";

export default function AwarenessHubScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={awarenessData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card title={item.title} description={item.description} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
