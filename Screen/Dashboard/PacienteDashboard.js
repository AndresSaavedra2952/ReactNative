import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PacienteDashboard({ navigation }) {
  const handleLogout = async () => {
    console.log("Botón de logout presionado");
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Cerrar Sesión", 
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Iniciando logout...");
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              console.log("Datos eliminados del storage");
              
              navigation.navigate("Inicio");
              console.log("Navegando a Inicio");
            } catch (error) {
              console.error("Error en logout:", error);
              Alert.alert("Error", "Error al cerrar sesión");
            }
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      title: "Mis Citas",
      icon: "calendar-outline",
      color: "#4facfe",
      screen: "Citas"
    },
    {
      title: "Buscar Médicos",
      icon: "search-outline", 
      color: "#00f2fe",
      screen: "Medicos"
    },
    {
      title: "Especialidades",
      icon: "medical-outline",
      color: "#4facfe",
      screen: "Especialidades"
    },
    {
      title: "Consultorios",
      icon: "business-outline",
      color: "#00f2fe",
      screen: "Consultorios"
    },
    {
      title: "Mi Perfil",
      icon: "person-outline",
      color: "#4facfe",
      screen: "Perfil"
    }
  ];

  return (
    <LinearGradient colors={["#e0f7ff", "#f9fbfd"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Panel del Paciente</Text>
              <Text style={styles.subtitle}>Gestiona tus citas médicas</Text>
            </View>
            <TouchableOpacity 
              onPress={handleLogout} 
              style={styles.logoutButton}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={24} color="#007aff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[item.color, item.color + "80"]}
                  style={styles.menuItemGradient}
                >
                  <Ionicons name={item.icon} size={30} color="#fff" />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  menuItemGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});

