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

export default function MisCitasMedico({ navigation }) {
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
      
      // Debug: Mostrar información del usuario
      console.log('MisCitasMedico - Usuario actual:', user);
      
      const response = await medicoService.getMisCitas();
      console.log('MisCitasMedico - Respuesta completa:', response);
      
      if (response.success) {
        console.log('MisCitasMedico - Citas obtenidas:', response.data);
        setCitas(response.data);
      } else {
        console.log('MisCitasMedico - Error en respuesta:', response.message);
        Alert.alert('Error', response.message || 'Error al cargar citas');
      }
    } catch (error) {
      console.error('MisCitasMedico - Error al cargar mis citas:', error);
      Alert.alert('Error', 'Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMisCitas();
    setRefreshing(false);
  };

  const handleActualizarEstado = async (citaId, nuevoEstado) => {
    try {
      const response = await medicoService.actualizarEstadoCita(citaId, nuevoEstado);
      if (response.success) {
        Alert.alert('Éxito', 'Estado actualizado correctamente');
        loadMisCitas(); // Recargar la lista
      } else {
        Alert.alert('Error', response.message || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Alert.alert('Error', 'Error al actualizar el estado de la cita');
    }
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
        <Text style={styles.citaPaciente}>
          {cita.paciente_nombre} {cita.paciente_apellido}
        </Text>
        <View style={[styles.statusBadge, getStatusStyle(cita.estado)]}>
          <Text style={styles.statusText}>{getStatusText(cita.estado)}</Text>
        </View>
      </View>
      
      <View style={styles.citaDetails}>
        <Text style={styles.citaDetail}>
          <Ionicons name="calendar" size={16} color="#666" /> {formatDate(cita.fecha_hora)}
        </Text>
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
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Cargando mis citas...</Text>
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
          <Text style={styles.headerTitle}>Mis Citas</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadMisCitas}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            Dr. {user?.nombre} {user?.apellido}
          </Text>
          <Text style={styles.subtitle}>
            {citas.length} citas programadas
          </Text>

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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  citaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 12,
  },
  citaPaciente: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
