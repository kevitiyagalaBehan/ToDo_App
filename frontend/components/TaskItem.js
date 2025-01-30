import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Add icons

export default function TaskItem({ task, onDelete, onToggleCompletion }) {
  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => onToggleCompletion(task._id)}>
        <Icon
          name={task.completed ? "check-square-o" : "square-o"}
          size={20}
          color={task.completed ? "#4CAF50" : "#000"}
        />
      </TouchableOpacity>
      <Text
        style={[
          styles.text,
          task.completed && { textDecorationLine: "line-through" },
        ]}
      >
        {task.title}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task._id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "100%",
  },
  text: {
    color: "red",
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
