import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

const categories = [
  "Technology",
  "Business",
  "Entertainment",
  "Health",
  "Science",
  "Sports",
];

export default function CategoriesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("HomeScreen", { category: item })
            }
          >
            <Text style={styles.item}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    fontSize: 18,
    padding: 15,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
    borderRadius: 5,
  },
});
