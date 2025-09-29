import React, { useState, useEffect } from "react";
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
  const [epsId, setEpsId] = useState(null);
  const [epsList, setEpsList] = useState([]);
  const [loadingEps, setLoadingEps] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar lista de EPS al montar el componente
  useEffect(() => {
    loadEps();
  }, []);

  const loadEps = async () => {
    try {
      setLoadingEps(true);
      const response = await api.get('/eps');
      if (response.data.success) {
        setEpsList(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar EPS:', error);
      Alert.alert('Error', 'No se pudieron cargar las EPS disponibles');
    } finally {
      setLoadingEps(false);
    }
  };

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !telefono || !password || !fechaNacimiento || !tipoDocumento || !numeroDocumento || !direccion || !epsId) {
      Alert.alert("Error", "Todos los campos son obligatorios, incluyendo la EPS");
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
      eps_id: epsId,
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
      colors={["#667eea", "#764ba2"]}
      style={{ flex: 1 }}
    >
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

          {/* Selector de EPS */}
          <View style={styles.epsSection}>
            <Text style={styles.epsLabel}>Selecciona tu EPS:</Text>
            {loadingEps ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007aff" />
                <Text style={styles.loadingText}>Cargando EPS...</Text>
              </View>
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.epsScrollView}
              >
                {epsList.map((eps) => (
                  <TouchableOpacity
                    key={eps.id}
                    style={[
                      styles.epsItem,
                      epsId === eps.id && styles.epsItemSelected
                    ]}
                    onPress={() => setEpsId(eps.id)}
                  >
                    <Text style={[
                      styles.epsItemText,
                      epsId === eps.id && styles.epsItemTextSelected
                    ]}>
                      {eps.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

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
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
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
    fontSize: 28,
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
  registerButton: {
    padding: 15,
    borderRadius: 15,
    marginTop: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
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
    color: "#fff",
    opacity: 0.9,
  },
  epsSection: {
    marginTop: 15,
  },
  epsLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  epsScrollView: {
    maxHeight: 60,
  },
  epsItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  epsItemSelected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  epsItemText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  epsItemTextSelected: {
    color: "#667eea",
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
});
