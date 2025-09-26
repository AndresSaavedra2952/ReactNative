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

export default function PacienteDashboard({ navigation }) {
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

  const pacienteActions = [
    {
      title: "Agendar Cita",
      description: "Solicitar nueva cita médica",
      icon: "calendar",
      color: ["#4facfe", "#00f2fe"],
      onPress: () => navigation.navigate("AgendarCita")
    },
    {
      title: "Mis Citas",
      description: "Ver mis citas programadas",
      icon: "list",
      color: ["#43e97b", "#38f9d7"],
      onPress: () => navigation.navigate("MisCitas")
    },
    {
      title: "Historial Médico",
      description: "Ver mi historial de consultas",
      icon: "document-text",
      color: ["#fa709a", "#fee140"],
      onPress: () => navigation.navigate("Historial")
    },
    {
      title: "Médicos",
      description: "Ver médicos disponibles",
      icon: "medical",
      color: ["#a8edea", "#fed6e3"],
      onPress: () => navigation.navigate("Medicos")
    },
    {
      title: "Perfil",
      description: "Actualizar mi información",
      icon: "person",
      color: ["#ffecd2", "#fcb69f"],
      onPress: () => navigation.navigate("Perfil")
    },
    {
      title: "Emergencias",
      description: "Contacto de emergencia",
      icon: "call",
      color: ["#ff6b6b", "#ee5a24"],
      onPress: () => navigation.navigate("Emergencias")
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
              <Text style={styles.welcomeText}>Bienvenido</Text>
              <Text style={styles.userName}>{user?.nombre} {user?.apellido}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Panel de Paciente</Text>
          <Text style={styles.sectionSubtitle}>
            Gestiona tu salud y citas médicas
          </Text>

          <View style={styles.actionsGrid}>
            {pacienteActions.map((action, index) => (
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

          {/* Next Appointment */}
          <View style={styles.appointmentSection}>
            <Text style={styles.appointmentTitle}>Próxima Cita</Text>
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Ionicons name="calendar" size={24} color="#4facfe" />
                <Text style={styles.appointmentDate}>15 Dic 2024</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.doctorName}>Dr. Carlos Mendoza</Text>
                <Text style={styles.specialty}>Cardiología</Text>
                <Text style={styles.time}>10:30 AM</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Confirmada</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>Ver Detalles</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Health Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Consejos de Salud</Text>
            <View style={styles.tipCard}>
              <Ionicons name="heart" size={24} color="#ff6b6b" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Mantén una dieta balanceada</Text>
                <Text style={styles.tipDescription}>
                  Incluye frutas, verduras y proteínas en tu alimentación diaria
                </Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <Ionicons name="walk" size={24} color="#4facfe" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Ejercítate regularmente</Text>
                <Text style={styles.tipDescription}>
                  Al menos 30 minutos de actividad física al día
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.statsTitle}>Mi Salud</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Citas Este Mes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Última Consulta</Text>
                <Text style={styles.statNumber}>2 días</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Médicos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Historial</Text>
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
  userEmail: {
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
  appointmentSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  appointmentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  appointmentDate: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  appointmentDetails: {
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  specialty: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  time: {
    fontSize: 16,
    color: "#4facfe",
    fontWeight: "bold",
  },
  statusBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  viewButton: {
    backgroundColor: "#4facfe",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  tipsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  tipContent: {
    flex: 1,
    marginLeft: 15,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  tipDescription: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    lineHeight: 20,
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
    textAlign: "center",
  },
});