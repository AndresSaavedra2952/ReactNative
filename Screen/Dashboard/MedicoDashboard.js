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

export default function MedicoDashboard({ navigation }) {
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
            // No navegar manualmente, el AuthContext maneja la navegación
          }
        }
      ]
    );
  };

  const medicoActions = [
    {
      title: "Mis Citas",
      description: "Ver y gestionar mis citas",
      icon: "calendar",
      color: ["#4facfe", "#00f2fe"],
      onPress: () => navigation.navigate("MisCitas")
    },
    {
      title: "Pacientes",
      description: "Ver mis pacientes",
      icon: "people",
      color: ["#ff6b6b", "#ee5a24"],
      onPress: () => navigation.navigate("MisPacientes")
    },
    {
      title: "Agenda",
      description: "Mi agenda médica",
      icon: "time",
      color: ["#4ecdc4", "#44a08d"],
      onPress: () => navigation.navigate("Agenda")
    },
    {
      title: "Perfil",
      description: "Actualizar mi información",
      icon: "person",
      color: ["#45b7d1", "#96c93d"],
      onPress: () => navigation.navigate("Perfil")
    },
    {
      title: "Consultorio",
      description: "Información de mi consultorio",
      icon: "home",
      color: ["#96ceb4", "#feca57"],
      onPress: () => navigation.navigate("MiConsultorio")
    },
    {
      title: "Reportes",
      description: "Estadísticas y reportes",
      icon: "bar-chart",
      color: ["#667eea", "#764ba2"],
      onPress: () => navigation.navigate("Reportes")
    },
    {
      title: "Historial",
      description: "Historial médico completo",
      icon: "document-text",
      color: ["#ff9ff3", "#54a0ff"],
      onPress: () => navigation.navigate("HistorialMedico")
    }
  ];

  return (
    <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4facfe" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Bienvenido, Doctor</Text>
              <Text style={styles.userName}>Dr. {user?.nombre} {user?.apellido}</Text>
              <Text style={styles.specialty}>Especialidad: {user?.especialidad?.nombre || "General"}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Panel Médico</Text>
          <Text style={styles.sectionSubtitle}>
            Gestiona tu práctica médica
          </Text>

          <View style={styles.actionsGrid}>
            {medicoActions.map((action, index) => (
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

          {/* Today's Schedule */}
          <View style={styles.scheduleSection}>
            <Text style={styles.scheduleTitle}>Citas de Hoy</Text>
            <View style={styles.scheduleCard}>
              <View style={styles.scheduleItem}>
                <View style={styles.timeSlot}>
                  <Text style={styles.timeText}>09:00</Text>
                </View>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>María González</Text>
                  <Text style={styles.patientReason}>Consulta general</Text>
                </View>
                <TouchableOpacity style={styles.statusButton}>
                  <Text style={styles.statusText}>Confirmada</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.scheduleItem}>
                <View style={styles.timeSlot}>
                  <Text style={styles.timeText}>10:30</Text>
                </View>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>Carlos López</Text>
                  <Text style={styles.patientReason}>Control</Text>
                </View>
                <TouchableOpacity style={styles.statusButton}>
                  <Text style={styles.statusText}>Pendiente</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.statsTitle}>Estadísticas del Día</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Citas Hoy</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Completadas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>2</Text>
                <Text style={styles.statLabel}>Pendientes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Canceladas</Text>
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
  specialty: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
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
  scheduleSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  scheduleCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  timeSlot: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 15,
  },
  timeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  patientReason: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 14,
  },
  statusButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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