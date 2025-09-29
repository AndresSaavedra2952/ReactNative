import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import { pacienteService } from "../../src/service/pacienteService";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

export default function PacienteDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const [proximaCita, setProximaCita] = useState(null);
  const [loadingCita, setLoadingCita] = useState(true);

  useEffect(() => {
    loadProximaCita();
  }, []);

  const loadProximaCita = async () => {
    try {
      setLoadingCita(true);
      console.log('🔍 PacienteDashboard - Cargando próxima cita para paciente:', user?.id);
      
      const response = await pacienteService.getMisCitas();
      
      if (response.success && response.data && response.data.length > 0) {
        // Filtrar citas futuras y ordenar por fecha
        const citasFuturas = response.data
          .filter(cita => {
            const fechaCita = moment(cita.fecha);
            return fechaCita.isAfter(moment()) || 
                   (fechaCita.isSame(moment(), 'day') && moment(cita.hora, 'HH:mm:ss').isAfter(moment()));
          })
          .sort((a, b) => {
            const fechaA = moment(`${a.fecha} ${a.hora}`);
            const fechaB = moment(`${b.fecha} ${b.hora}`);
            return fechaA.diff(fechaB);
          });
        
        if (citasFuturas.length > 0) {
          setProximaCita(citasFuturas[0]);
          console.log('📅 Próxima cita encontrada:', citasFuturas[0]);
        } else {
          setProximaCita(null);
          console.log('📅 No hay citas futuras');
        }
      } else {
        setProximaCita(null);
        console.log('📅 No hay citas disponibles');
      }
    } catch (error) {
      console.error('❌ Error al cargar próxima cita:', error);
      setProximaCita(null);
    } finally {
      setLoadingCita(false);
    }
  };

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
            // navigation.replace("Login");
          }
        }
      ]
    );
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'completada':
        return '#4CAF50';
      case 'confirmada':
        return '#2196F3';
      case 'pendiente':
        return '#FF9800';
      case 'cancelada':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const pacienteActions = [
    {
      title: "Agendar Cita",
      description: "Solicitar nueva cita médica",
      icon: "calendar",
      color: ["#667eea", "#764ba2"],
      onPress: () => navigation.navigate("AgendarCita")
    },
    {
      title: "Mis Citas",
      description: "Ver mis citas programadas",
      icon: "list",
      color: ["#ff6b6b", "#ee5a24"],
      onPress: () => navigation.navigate("MisCitas")
    },
    {
      title: "Historial Médico",
      description: "Ver mi historial de consultas",
      icon: "document-text",
      color: ["#4ecdc4", "#44a08d"],
      onPress: () => navigation.navigate("Historial")
    },
    {
      title: "Médicos",
      description: "Ver médicos disponibles",
      icon: "medical",
      color: ["#45b7d1", "#96c93d"],
      onPress: () => navigation.navigate("Medicos")
    },
    {
      title: "Perfil",
      description: "Actualizar mi información",
      icon: "person",
      color: ["#96ceb4", "#feca57"],
      onPress: () => navigation.navigate("Perfil")
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
            {loadingCita ? (
              <View style={styles.appointmentCard}>
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#667eea" />
                  <Text style={styles.loadingText}>Cargando próxima cita...</Text>
                </View>
              </View>
            ) : proximaCita ? (
              <View style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Ionicons name="calendar" size={24} color="#667eea" />
                  <Text style={styles.appointmentDate}>
                    {moment(proximaCita.fecha).format('DD MMM YYYY')}
                  </Text>
                </View>
                <View style={styles.appointmentDetails}>
                  <Text style={styles.doctorName}>
                    Dr. {proximaCita.medico_nombre} {proximaCita.medico_apellido}
                  </Text>
                  <Text style={styles.specialty}>
                    {proximaCita.especialidad_nombre || 'Sin especialidad'}
                  </Text>
                  <Text style={styles.time}>
                    {moment(proximaCita.hora, 'HH:mm:ss').format('HH:mm')}
                  </Text>
                  <Text style={styles.motivo}>
                    Motivo: {proximaCita.motivo_consulta}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(proximaCita.estado) }]}>
                    <Text style={styles.statusText}>
                      {proximaCita.estado.charAt(0).toUpperCase() + proximaCita.estado.slice(1)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => navigation.navigate("MisCitas")}
                >
                  <Text style={styles.viewButtonText}>Ver Todas las Citas</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.appointmentCard}>
                <View style={styles.noAppointmentContainer}>
                  <Ionicons name="calendar-outline" size={48} color="#ccc" />
                  <Text style={styles.noAppointmentText}>No tienes citas programadas</Text>
                  <Text style={styles.noAppointmentSubtext}>
                    Agenda una nueva cita médica
                  </Text>
                  <TouchableOpacity 
                    style={styles.scheduleButton}
                    onPress={() => navigation.navigate("AgendarCita")}
                  >
                    <Text style={styles.scheduleButtonText}>Agendar Cita</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    color: "#667eea",
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
    backgroundColor: "#667eea",
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
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  motivo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontStyle: "italic",
  },
  noAppointmentContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noAppointmentText: {
    fontSize: 18,
    color: "#666",
    marginTop: 15,
    fontWeight: "bold",
  },
  noAppointmentSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
  scheduleButton: {
    backgroundColor: "#667eea",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 15,
  },
  scheduleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});