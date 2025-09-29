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
import { medicoService } from '../../src/service/medicoService';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

export default function MiAgendaMedico({ navigation }) {
  const { user } = useAuth();
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    loadMiAgenda();
  }, [selectedDate]);

  const loadMiAgenda = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 MiAgendaMedico - Usuario actual:', user);
      console.log('🔍 MiAgendaMedico - Fecha seleccionada:', selectedDate);
      
      const response = await medicoService.getMiAgenda();
      console.log('📅 MiAgendaMedico - Respuesta completa:', response);
      
      if (response.success) {
        console.log('📅 MiAgendaMedico - Agenda obtenida:', response.data);
        
        // Filtrar citas por fecha seleccionada
        const agendaFiltrada = response.data.filter(cita => {
          const fechaCita = moment(cita.fecha).format('YYYY-MM-DD');
          const fechaSeleccionada = moment(selectedDate).format('YYYY-MM-DD');
          console.log('🔍 Comparando fechas:', fechaCita, '===', fechaSeleccionada);
          return fechaCita === fechaSeleccionada;
        });
        
        console.log('📅 MiAgendaMedico - Citas filtradas para', selectedDate, ':', agendaFiltrada.length);
        setAgenda(agendaFiltrada);
      } else {
        console.log('❌ MiAgendaMedico - Error en respuesta:', response.message);
        Alert.alert('Error', response.message || 'Error al cargar agenda');
        setAgenda([]);
      }
    } catch (error) {
      console.error('❌ MiAgendaMedico - Error al cargar mi agenda:', error);
      Alert.alert('Error', 'Error al cargar la agenda');
      setAgenda([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMiAgenda();
    setRefreshing(false);
  };

  const handleActualizarEstado = async (citaId, nuevoEstado) => {
    try {
      const response = await medicoService.actualizarEstadoCita(citaId, nuevoEstado);
      if (response.success) {
        Alert.alert('Éxito', 'Estado actualizado correctamente');
        loadMiAgenda(); // Recargar la agenda
      } else {
        Alert.alert('Error', response.message || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Alert.alert('Error', 'Error al actualizar el estado de la cita');
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5); // HH:MM
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('dddd, DD [de] MMMM [de] YYYY');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pendiente': return styles.statusPending;
      case 'confirmada': return styles.statusConfirmed;
      case 'completada': return styles.statusCompleted;
      case 'cancelada': return styles.statusCancelled;
      default: return styles.statusPending;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'confirmada': return 'Confirmada';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      default: return 'Pendiente';
    }
  };

  const renderCita = ({ item: cita }) => (
    <View style={styles.citaCard}>
      <View style={styles.citaHeader}>
        <View style={styles.timeContainer}>
          <Ionicons name="time" size={20} color="#007aff" />
          <Text style={styles.timeText}>{formatTime(cita.hora)}</Text>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(cita.estado)]}>
          <Text style={styles.statusText}>{getStatusText(cita.estado)}</Text>
        </View>
      </View>
      
      <View style={styles.citaContent}>
        <Text style={styles.pacienteName}>
          {cita.paciente_nombre} {cita.paciente_apellido}
        </Text>
        
        <View style={styles.citaDetails}>
          <Text style={styles.citaDetail}>
            <Ionicons name="location" size={16} color="#666" /> {cita.consultorio_nombre || 'N/A'}
          </Text>
          <Text style={styles.citaDetail}>
            <Ionicons name="medical" size={16} color="#666" /> {cita.especialidad_nombre || 'N/A'}
          </Text>
          <Text style={styles.citaMotivo}>
            <Ionicons name="document-text" size={16} color="#666" /> {cita.motivo_consulta || 'No especificado'}
          </Text>
          {cita.observaciones && (
            <Text style={styles.citaObservaciones}>
              <Ionicons name="clipboard" size={16} color="#666" /> {cita.observaciones}
            </Text>
          )}
        </View>

        <View style={styles.citaActions}>
          {cita.estado === 'pendiente' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={() => handleActualizarEstado(cita.id, 'confirmada')}
              >
                <Ionicons name="checkmark" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleActualizarEstado(cita.id, 'cancelada')}
              >
                <Ionicons name="close" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
          
          {cita.estado === 'confirmada' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleActualizarEstado(cita.id, 'completada')}
            >
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Completar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderDateHeader = () => (
    <View style={styles.dateHeader}>
      <Text style={styles.dateTitle}>
        {formatDate(selectedDate)}
      </Text>
      <Text style={styles.dateSubtitle}>
        {agenda.length} citas programadas
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Cargando mi agenda...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Agenda</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadMiAgenda}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            Dr. {user?.nombre} {user?.apellido}
          </Text>
          
          {/* Selector de fecha */}
          <View style={styles.dateSelector}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                const yesterday = moment(selectedDate).subtract(1, 'day').format('YYYY-MM-DD');
                setSelectedDate(yesterday);
              }}
            >
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dateDisplay}
              onPress={() => {
                // Por ahora mostrar solo la fecha actual, después se puede agregar un date picker
                setSelectedDate(moment().format('YYYY-MM-DD'));
              }}
            >
              <Text style={styles.dateText}>
                {moment(selectedDate).format('DD/MM/YYYY')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                const tomorrow = moment(selectedDate).add(1, 'day').format('YYYY-MM-DD');
                setSelectedDate(tomorrow);
              }}
            >
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {renderDateHeader()}

          <FlatList
            data={agenda}
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
                <Text style={styles.emptyText}>No hay citas programadas</Text>
                <Text style={styles.emptySubtext}>
                  Tu agenda está libre para esta fecha
                </Text>
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
  header: {
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
  headerTitle: {
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  dateButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  dateDisplay: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
  },
  dateSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
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
  statusPending: {
    backgroundColor: '#ff9500',
  },
  statusConfirmed: {
    backgroundColor: '#34c759',
  },
  statusCompleted: {
    backgroundColor: '#007aff',
  },
  statusCancelled: {
    backgroundColor: '#ff3b30',
  },
  citaContent: {
    padding: 16,
    paddingTop: 12,
  },
  pacienteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  citaDetails: {
    marginBottom: 12,
  },
  citaDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  citaMotivo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  citaObservaciones: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
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
  confirmButton: {
    backgroundColor: '#34c759',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  completeButton: {
    backgroundColor: '#007aff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
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
  },
});
