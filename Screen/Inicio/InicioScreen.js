import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar 
} from "react-native";

export default function InicioScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header con botones de login/registro */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Citas Médicas</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.headerButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerButton, styles.registerButton]} 
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.headerButtonText, styles.registerButtonText]}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Citas Médicas</Text>
        <Text style={styles.subtitle}>Tu salud en tus manos</Text>
        
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>¡Hola, Juan!</Text>
          <Text style={styles.question}>¿Cómo te sientes hoy?</Text>
        </View>

        <View style={styles.appointmentCard}>
          <Text style={styles.cardTitle}>Próxima Cita</Text>
          <Text style={styles.doctorName}>Dr. Carlos Mendoza</Text>
          <Text style={styles.specialty}>Cardiología</Text>
          <Text style={styles.dateTime}>15 Dic 2024 - 10:30 AM</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Confirmada</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Citas')}
            >
              <Text style={styles.actionText}>Citas</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Pacientes')}
            >
              <Text style={styles.actionText}>Pacientes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Medicos')}
            >
              <Text style={styles.actionText}>Médicos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Especialidades')}
            >
              <Text style={styles.actionText}>Especialidades</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Consultorios')}
            >
              <Text style={styles.actionText}>Consultorios</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Eps')}
            >
              <Text style={styles.actionText}>EPS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1976D2",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonText: {
    fontSize: 14,
    color: "#1976D2",
  },
  registerButton: {
    backgroundColor: "#1976D2",
    borderRadius: 15,
  },
  registerButtonText: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1976D2",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  welcomeSection: {
    backgroundColor: "#E3F2FD",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 8,
  },
  question: {
    fontSize: 16,
    color: "#666",
  },
  appointmentCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 10,
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
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  statusBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  actionButton: {
    width: "30%",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
