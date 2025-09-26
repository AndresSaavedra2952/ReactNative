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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import api from "../../src/service/conexion";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !telefono || !password || !fechaNacimiento || !tipoDocumento || !numeroDocumento || !direccion) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    const pacienteData = {
      nombre,
      apellido,
      email,
      telefono,
      password,
      fecha_nacimiento: fechaNacimiento,
      tipo_documento: tipoDocumento,
      numero_documento: numeroDocumento,
      direccion,
      activo: 1
    };

    try {
      console.log("Enviando datos del paciente:", pacienteData);
      
      // Usar endpoint público para registro de pacientes (sin autenticación)
      const response = await api.post('/register/paciente', pacienteData);
      
      if (response.data) {
        Alert.alert("✅ Éxito", "Paciente registrado correctamente en la base de datos");
        navigation.replace("Login");
      } else {
        Alert.alert("❌ Error", "Error al registrar el paciente");
      }
    } catch (error) {
      console.error("Error al registrar paciente:", error);
      
      if (error.response?.status === 401) {
        Alert.alert("❌ Error", "El endpoint requiere autenticación. Necesitamos crear un endpoint público para registro de pacientes.");
      } else if (error.response?.status === 422) {
        Alert.alert("❌ Error", "Datos inválidos: " + (error.response.data?.message || "Verifica los campos"));
      } else if (error.response?.status === 500) {
        Alert.alert("❌ Error", "Error del servidor. Verifica que el backend esté funcionando.");
      } else {
        Alert.alert("❌ Error", "Error inesperado: " + (error.message || "Error de conexión"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#e0f7ff", "#f9fbfd"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Registro de Paciente</Text>
          <Text style={styles.subheading}>Completa tus datos para crear tu cuenta</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#888"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#888"
            value={apellido}
            onChangeText={setApellido}
          />
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
            placeholder="Teléfono"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento (YYYY-MM-DD)"
            placeholderTextColor="#888"
            value={fechaNacimiento}
            onChangeText={setFechaNacimiento}
          />
          <TextInput
            style={styles.input}
            placeholder="Tipo de documento (CC, TI, CE)"
            placeholderTextColor="#888"
            value={tipoDocumento}
            onChangeText={setTipoDocumento}
          />
          <TextInput
            style={styles.input}
            placeholder="Número de documento"
            placeholderTextColor="#888"
            value={numeroDocumento}
            onChangeText={setNumeroDocumento}
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            placeholderTextColor="#888"
            multiline
            numberOfLines={2}
            value={direccion}
            onChangeText={setDireccion}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={handleRegister} activeOpacity={0.8} disabled={loading}>
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Registrar</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>
            ¿Ya tienes cuenta?{" "}
            <Text style={{ color: "#007aff", fontWeight: "bold" }}>
              Inicia sesión
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
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
    color: "#007aff",
    marginBottom: 10,
  },
  subheading: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  registerButton: {
    padding: 15,
    borderRadius: 15,
    marginTop: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  loginLink: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
    color: "#555",
  },
});
