import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";

export default function AdminDashboard({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Cerrar Sesión", 
          style: "destructive",
          onPress: async () => {
            await logout();
            navigation.replace("Login");
          }
        }
      ]
    );
  };

  const adminActions = [
    {
      title: "Gestión de Médicos",
      description: "Crear, editar y eliminar médicos",
      icon: "medical",
      color: ["#4facfe", "#00f2fe"],
      onPress: () => navigation.navigate("Medicos")
    },
    {
      title: "Gestión de Pacientes",
      description: "Administrar pacientes del sistema",
      icon: "people",
      color: ["#43e97b", "#38f9d7"],
      onPress: () => navigation.navigate("Pacientes")
    },
    {
      title: "Especialidades",
      description: "Gestionar especialidades médicas",
      icon: "library",
      color: ["#fa709a", "#fee140"],
      onPress: () => navigation.navigate("Especialidades")
    },
    {
      title: "EPS",
      description: "Administrar entidades de salud",
      icon: "business",
      color: ["#a8edea", "#fed6e3"],
      onPress: () => navigation.navigate("Eps")
    },
    {
      title: "Consultorios",
      description: "Gestionar consultorios médicos",
      icon: "home",
      color: ["#ffecd2", "#fcb69f"],
      onPress: () => navigation.navigate("Consultorios")
    },
    {
      title: "Citas Médicas",
      description: "Administrar todas las citas",
      icon: "calendar",
      color: ["#667eea", "#764ba2"],
      onPress: () => navigation.navigate("Citas")
    }
  ];

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Bienvenido, Administrador</Text>
              <Text style={styles.userName}>{user?.nombre} {user?.apellido}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Panel de Administración</Text>
          <Text style={styles.sectionSubtitle}>
            Gestiona todos los aspectos del sistema médico
          </Text>

          <View style={styles.actionsGrid}>
            {adminActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={action.color}
                  style={styles.actionGradient}
                >
                  <Ionicons name={action.icon} size={40} color="#fff" />
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.statsTitle}>Estadísticas Rápidas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>--</Text>
                <Text style={styles.statLabel}>Médicos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>--</Text>
                <Text style={styles.statLabel}>Pacientes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>--</Text>
                <Text style={styles.statLabel}>Citas Hoy</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>--</Text>
                <Text style={styles.statLabel}>Especialidades</Text>
              </View>
            </View>
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
    paddingVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  actionCard: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionGradient: {
    padding: 20,
    alignItems: "center",
    minHeight: 140,
    justifyContent: "center",
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  actionDescription: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 16,
  },
  statsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
    marginTop: 5,
  },
});