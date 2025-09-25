import { TouchableOpacity, Text,sty } from "react-native";

export default function ButtonComponent({ onPress, title, style }) {
    return (
      <TouchableOpacity style={[StyleSheet, Button, style]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: "#007AFF",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      marginVertical: 10,
    },
    text: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });