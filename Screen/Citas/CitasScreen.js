import React, { useState, useEffect } from 'react';
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
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { citasService, adminService } from '../../src/service/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/es'; // Import Spanish locale
import CrearCitaModal from '../../src/components/CrearCitaModal';
import EditarCitaModal from '../../src/components/EditarCitaModal';

moment.locale('es'); // Set locale to Spanish

export default function CitasScreen({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [citaEditando, setCitaEditando] = useState(null);

  // Función para asegurar que citas siempre sea un array
  const getCitasArray = () => {
    return Array.isArray(citas) ? citas : [];
  };

  useEffect(() => {
    loadUserDataAndRole();
    loadCitas();
  }, []);

  const loadUserDataAndRole = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        console.log('Datos del usuario:', parsedData);
        setUserRole(parsedData.tipo || parsedData.role);
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  };

  const loadCitas = async () => {
    setLoading(true);
    try {
      let result;
      
      if (userRole === 'admin') {
        result = await adminService.getCitas();
      } else {
        result = await citasService.getAll();
      }
      
      console.log("Respuesta de citas:", result);
      
      if (result && result.success && Array.isArray(result.data)) {
        setCitas(result.data);
        console.log("Citas cargadas:", result.data.length);
      } else {
        console.log("Error en respuesta o datos no válidos:", result);
        setCitas([]);
        if (result && result.message) {
          Alert.alert("Error", result.message);
        }
      }
      
    } catch (error) {
      console.error("Error al cargar citas:", error);
      setCitas([]);
      Alert.alert("Error", "Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCitas();
    setRefreshing(false);
  };

  const handleViewCita = (cita) => {
    setCitaEditando(cita);
    setShowEditarModal(true);
  };

  const handleAddCita = () => {
    setShowCrearModal(true);
  };

  const handleCitaCreated = () => {
    loadCitas();
  };

  const handleCitaUpdated = () => {
    loadCitas();
  };

  const handleConfirmCita = async (citaId) => {
    try {
      const result = await citasService.update(citaId, { estado: 'confirmada' });
      if (result.success) {
        Alert.alert("Éxito", "Cita confirmada correctamente");
        loadCitas();
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Error al confirmar la cita");
    }
  };

  const handleCancelCita = async (citaId) => {
    Alert.alert(
      "Cancelar Cita",
      "¿Estás seguro de que quieres cancelar esta cita?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await citasService.update(citaId, { estado: 'cancelada' });
              if (result.success) {
                Alert.alert("Éxito", "Cita cancelada correctamente");
                loadCitas();
              } else {
                Alert.alert("Error", result.message);
              }
            } catch (error) {
              Alert.alert("Error", "Error al cancelar la cita");
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pendiente': return styles.statusPending;
      case 'confirmada': return styles.statusConfirmed;
      case 'cancelada': return styles.statusCancelled;
      case 'completada': return styles.statusCompleted;
      default: return styles.statusPending;
    }
  };

  // Debug: verificar el estado de citas
  console.log("Render - citas:", citas, "tipo:", typeof citas, "es array:", Array.isArray(citas));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#e0f7ff", "#f9fbfd"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#e0f7ff" />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1976D2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Citas</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddCita}
          >
            <Ionicons name="add" size={24} color="#1976D2" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Tus Citas Médicas</Text>
            <Text style={styles.subtitle}>
              {getCitasArray().length} citas encontradas
            </Text>
          </View>

          {getCitasArray().length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No tienes citas agendadas</Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={handleAddCita}
              >
                <Text style={styles.emptyButtonText}>Agendar Primera Cita</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.citasList}>
              {getCitasArray().map((cita) => (
                <View key={cita.id} style={styles.citaCard}>
                  <View style={styles.citaHeader}>
                    <Text style={styles.citaDoctor}>Dr. {cita.medico?.nombre || 'N/A'}</Text>
                    <Text style={[styles.citaStatus, getStatusStyle(cita.estado)]}>
                      {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.citaDetails}>
                    Especialidad: {cita.especialidad?.nombre || 'N/A'}
                  </Text>
                  <Text style={styles.citaDetails}>
                    Consultorio: {cita.consultorio?.nombre || 'N/A'}
                  </Text>
                  <Text style={styles.citaDate}>
                    Fecha y Hora: {formatDate(cita.fecha_hora)}
                  </Text>
                  <Text style={styles.citaMotivo}>
                    Motivo: {cita.motivo || 'No especificado'}
                  </Text>

                  <View style={styles.citaActions}>
                    <TouchableOpacity 
                      style={styles.actionButtonEdit}
                      onPress={() => handleViewCita(cita)}
                    >
                      <Text style={styles.actionButtonText}>Editar</Text>
                    </TouchableOpacity>
                    {cita.estado === 'pendiente' && (
                      <>
                        <TouchableOpacity 
                          style={styles.actionButtonConfirm}
                          onPress={() => handleConfirmCita(cita.id)}
                        >
                          <Text style={styles.actionButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.actionButtonCancel}
                          onPress={() => handleCancelCita(cita.id)}
                        >
                          <Text style={styles.actionButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {cita.estado === 'confirmada' && (
                      <TouchableOpacity 
                        style={styles.actionButtonCancel}
                        onPress={() => handleCancelCita(cita.id)}
                      >
                        <Text style={styles.actionButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      
      {/* Modales */}
      <CrearCitaModal
        visible={showCrearModal}
        onClose={() => setShowCrearModal(false)}
        onCitaCreated={handleCitaCreated}
      />
      
      <EditarCitaModal
        visible={showEditarModal}
        onClose={() => {
          setShowEditarModal(false);
          setCitaEditando(null);
        }}
        cita={citaEditando}
        onCitaUpdated={handleCitaUpdated}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fbfd',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  addButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  citasList: {
    gap: 15,
  },
  citaCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  citaDoctor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  citaStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusConfirmed: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusCancelled: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  statusCompleted: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
  },
  citaDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  citaDate: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10,
  },
  citaMotivo: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  citaActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButtonEdit: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonConfirm: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonCancel: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});