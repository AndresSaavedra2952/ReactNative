import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CardComponent({ title, description, icon }) {
    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={32} color="#1976D2" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  card: {
    width: "31%",               // 2 cards por fila
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 8,                  
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,            // separación debajo del ícono
  },

  textContainer: {
    alignItems: "center",       // centra texto
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1976D2",
    textAlign: "center",        // evita cortes feos
  },

  description: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
  },
});