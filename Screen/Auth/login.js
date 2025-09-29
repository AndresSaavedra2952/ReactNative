import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Picker,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        Alert.alert("✅ Éxito", `Bienvenido, ${result.userType === 'admin' ? 'Administrador' : result.userType === 'medico' ? 'Doctor' : 'Paciente'}`);
        // La navegación se maneja automáticamente por el AuthContext
        // No necesitamos navegar manualmente aquí
      } else {
        Alert.alert("❌ Error", result.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert("❌ Error", "Error inesperado al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="calendar" size={40} color="#fff" />
            </View>
            <Text style={styles.logoText}>Citas_ADSO</Text>
          </View>
          
          <Text style={styles.heading}>Bienvenido</Text>
          <Text style={styles.subheading}>Inicia sesión para continuar</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => Alert.alert("Olvidaste tu contraseña", "Próximamente")}
          >
            <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} disabled={loading}>
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Ingresar</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerLink}>
            ¿No tienes cuenta?{" "}
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Crear cuenta
            </Text>
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoIcon: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },
  heading: {
    textAlign: "center",
    fontWeight: "900",
    fontSize: 32,
    color: "#fff",
    marginBottom: 10,
  },
  subheading: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 30,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  forgotPasswordContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#fff",
    textAlign: "right",
    opacity: 0.8,
  },
  loginButton: {
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  registerLink: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 25,
    color: "#fff",
    opacity: 0.9,
  },
});
