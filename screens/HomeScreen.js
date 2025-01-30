import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskItem from "../components/TaskItem";
import { useColorScheme } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api/tasks";

export default function HomeScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const styles = theme === "dark" ? darkTheme : lightTheme;

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error.message);
    }
  };

  const addTask = async () => {
    if (task.trim()) {
      if (tasks.some((t) => t.title === task.trim())) {
        alert("Task already exists!");
        return;
      }
      try {
        const res = await axios.post(API_URL, { title: task });
        setTasks([...tasks, res.data]);
        setTask("");
      } catch (error) {
        console.error("Failed to add task:", error.message);
      }
    } else {
      alert("Task cannot be empty!");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error.message);
    }
  };

  // Handle task completion
  const toggleTaskCompletion = async (id) => {
    // Find the task in the current state
    const updatedTasks = tasks.map((task) =>
      task._id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks); // Update the local state with the new task list

    try {
      const taskToUpdate = updatedTasks.find((task) => task._id === id);
      await axios.patch(`${API_URL}/${id}`, {
        completed: taskToUpdate.completed,
      });
    } catch (error) {
      console.error("Failed to update task completion:", error.message);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      Alert.alert("Success", "You have been logged out");
      navigation.replace("LoginScreen");
    } catch (error) {
      console.error("Error during logout", error);
      Alert.alert("Error", "An error occurred while logging out.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Icon
          name={theme === "dark" ? "sun-o" : "moon-o"}
          size={20}
          color="#fff"
        />
        <Text style={styles.buttonText}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Add a task"
        placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onDelete={deleteTask}
            onToggleCompletion={toggleTaskCompletion}
          />
        )}
      />
    </View>
  );
}

const lightTheme = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    color: "#000",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    width: "80%",
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: "#FF4F4F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

const darkTheme = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    width: "80%",
  },
  addButton: {
    backgroundColor: "#BB86FC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#BB86FC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: "#FF4F4F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
