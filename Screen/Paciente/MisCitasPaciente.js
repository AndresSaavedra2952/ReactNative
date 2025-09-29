import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { pacienteService } from '../../src/service/pacienteService';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

export default function MisCitasPaciente({ navigation }) {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMisCitas();
  }, []);

  const loadMisCitas = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 MisCitasPaciente - Usuario actual:', user);
      console.log('🔍 MisCitasPaciente - user.id:', user?.id);
      
      const response = await pacienteService.getMisCitas();
      console.log('📅 MisCitasPaciente - Respuesta completa:', response);
      
      if (response.success) {
        console.log('📅 MisCitasPaciente - Citas obtenidas:', response.data);
        setCitas(response.data || []);
      } else {
        console.log('❌ MisCitasPaciente - Error en respuesta:', response.message);
        Alert.alert('Error', response.message || 'Error al cargar citas');
        setCitas([]);
      }
    } catch (error) {
      console.error('❌ MisCitasPaciente - Error al cargar mis citas:', error);
      Alert.alert('Error', 'Error al cargar las citas');
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMisCitas();
    setRefreshing(false);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return moment(timeString, 'HH:mm:ss').format('HH:mm');
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('dddd, DD [de] MMMM [de] YYYY');
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

  const getStatusText = (estado) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'confirmada': return 'Confirmada';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      default: return 'Pendiente';
    }
  };

  const handleCancelarCita = async (citaId) => {
    Alert.alert(
      'Cancelar Cita',
      '¿Estás seguro de que quieres cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await pacienteService.cancelarCita(citaId);
              if (response.success) {
                Alert.alert('Éxito', 'Cita cancelada correctamente');
                loadMisCitas(); // Recargar las citas
              } else {
                Alert.alert('Error', response.message || 'Error al cancelar cita');
              }
            } catch (error) {
              console.error('Error al cancelar cita:', error);
              Alert.alert('Error', 'Error al cancelar la cita');
            }
          }
        }
      ]
    );
  };

  const renderCita = ({ item: cita }) => (
    <View style={styles.citaCard}>
      <View style={styles.citaHeader}>
        <View style={styles.timeContainer}>
          <Ionicons name="time" size={20} color="#007aff" />
          <Text style={styles.timeText}>{formatTime(cita.hora)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cita.estado) }]}>
          <Text style={styles.statusText}>{getStatusText(cita.estado)}</Text>
        </View>
      </View>
      
      <View style={styles.citaContent}>
        <Text style={styles.fechaText}>
          {formatDate(cita.fecha)}
        </Text>
        
        <View style={styles.citaDetails}>
          <Text style={styles.doctorName}>
            Dr. {cita.medico_nombre} {cita.medico_apellido}
          </Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="medical" size={16} color="#666" />
            <Text style={styles.detailText}>
              {cita.especialidad_nombre || 'Sin especialidad'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.detailText}>
              {cita.consultorio_nombre || 'Sin consultorio'}
            </Text>
          </View>
          
          <Text style={styles.motivoText}>
            <Ionicons name="document-text" size={16} color="#666" /> 
            Motivo: {cita.motivo_consulta || 'No especificado'}
          </Text>
          
          {cita.observaciones && (
            <Text style={styles.observacionesText}>
              <Ionicons name="clipboard" size={16} color="#666" /> 
              Observaciones: {cita.observaciones}
            </Text>
          )}
        </View>

        <View style={styles.citaActions}>
          {(cita.estado === 'pendiente' || cita.estado === 'confirmada') && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelarCita(cita.id)}
            >
              <Ionicons name="close-circle" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Cancelar Cita</Text>
            </TouchableOpacity>
          )}
          
          {cita.estado === 'completada' && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.completedText}>Cita Completada</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
        {citas.length} cita{citas.length !== 1 ? 's' : ''} programada{citas.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Cargando mis citas...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.navigationHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.navigationTitle}>Mis Citas</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadMisCitas}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            {user?.nombre} {user?.apellido}
          </Text>
          
          {renderHeader()}

          <FlatList
            data={citas}
            renderItem={renderCita}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#667eea"]}
                tintColor="#667eea"
              />
            }
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar-outline" size={64} color="#fff" />
                <Text style={styles.emptyText}>No tienes citas programadas</Text>
                <Text style={styles.emptySubtext}>
                  Las citas asignadas a tu nombre aparecerán aquí
                </Text>
                <TouchableOpacity
                  style={styles.scheduleButton}
                  onPress={() => navigation.navigate("AgendarCita")}
                >
                  <Text style={styles.scheduleButtonText}>Agendar Nueva Cita</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  navigationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  citaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007aff',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  citaContent: {
    padding: 16,
    paddingTop: 12,
  },
  fechaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  citaDetails: {
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  motivoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontStyle: 'italic',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  observacionesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  citaActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e8f5e8',
    borderRadius: 6,
    gap: 4,
  },
  completedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  scheduleButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  scheduleButtonText: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

