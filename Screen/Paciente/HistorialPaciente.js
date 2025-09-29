import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { pacienteService } from '../../src/service/pacienteService';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const HistorialPaciente = ({ navigation }) => {
  const { user } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos'); // todos, completadas, canceladas
  const [filtroFecha, setFiltroFecha] = useState('todos'); // todos, hoy, semana, mes

  useEffect(() => {
    loadHistorial();
  }, []);

  const loadHistorial = async () => {
    try {
      setLoading(true);
      console.log('🔍 HistorialPaciente - Cargando historial para paciente:', user?.id);
      
      // Obtener todas las citas del paciente (historial completo)
      const response = await pacienteService.getMisCitas();
      
      if (response.success) {
        console.log('📊 HistorialPaciente - Citas obtenidas:', response.data.length);
        setHistorial(response.data || []);
      } else {
        console.error('❌ HistorialPaciente - Error en respuesta:', response.message);
        Alert.alert('Error', response.message || 'Error al cargar el historial');
      }
    } catch (error) {
      console.error('❌ HistorialPaciente - Error al cargar historial:', error);
      Alert.alert('Error', 'Error al cargar el historial médico');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistorial();
    setRefreshing(false);
  };

  const filtrarCitas = (citas) => {
    let citasFiltradas = [...citas];

    // Filtrar por estado
    if (filtroEstado !== 'todos') {
      citasFiltradas = citasFiltradas.filter(cita => cita.estado === filtroEstado);
    }

    // Filtrar por fecha
    if (filtroFecha !== 'todos') {
      const ahora = moment();
      citasFiltradas = citasFiltradas.filter(cita => {
        const fechaCita = moment(cita.fecha);
        switch (filtroFecha) {
          case 'hoy':
            return fechaCita.isSame(ahora, 'day');
          case 'semana':
            return fechaCita.isSame(ahora, 'week');
          case 'mes':
            return fechaCita.isSame(ahora, 'month');
          default:
            return true;
        }
      });
    }

    return citasFiltradas;
  };

  const getEstadoColor = (estado) => {
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

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'completada':
        return 'checkmark-circle';
      case 'confirmada':
        return 'checkmark';
      case 'pendiente':
        return 'time';
      case 'cancelada':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderCitaItem = ({ item: cita }) => (
    <View style={styles.citaCard}>
      <View style={styles.citaHeader}>
        <View style={styles.medicoInfo}>
          <Text style={styles.medicoNombre}>
            Dr. {cita.medico_nombre} {cita.medico_apellido}
          </Text>
          <Text style={styles.especialidad}>
            {cita.especialidad_nombre || 'Sin especialidad'}
          </Text>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(cita.estado) }]}>
          <Ionicons 
            name={getEstadoIcon(cita.estado)} 
            size={16} 
            color="#fff" 
            style={styles.estadoIcon}
          />
          <Text style={styles.estadoText}>
            {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.citaDetalles}>
        <View style={styles.detalleRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.detalleText}>
            {moment(cita.fecha).format('DD [de] MMMM [de] YYYY')}
          </Text>
        </View>
        
        <View style={styles.detalleRow}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.detalleText}>
            {moment(cita.hora, 'HH:mm:ss').format('HH:mm')}
          </Text>
        </View>

        <View style={styles.detalleRow}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.detalleText}>
            {cita.consultorio_nombre || 'Sin consultorio'} 
            {cita.consultorio_ubicacion && ` - ${cita.consultorio_ubicacion}`}
          </Text>
        </View>
      </View>

      <View style={styles.motivoSection}>
        <Text style={styles.motivoLabel}>Motivo de consulta:</Text>
        <Text style={styles.motivoText}>{cita.motivo_consulta}</Text>
      </View>

      {cita.observaciones && (
        <View style={styles.observacionesSection}>
          <Text style={styles.observacionesLabel}>Observaciones del médico:</Text>
          <Text style={styles.observacionesText}>{cita.observaciones}</Text>
        </View>
      )}

      <View style={styles.citaFooter}>
        <Text style={styles.fechaCreacion}>
          Agendada: {moment(cita.created_at).format('DD/MM/YYYY HH:mm')}
        </Text>
        {cita.updated_at !== cita.created_at && (
          <Text style={styles.fechaActualizacion}>
            Actualizada: {moment(cita.updated_at).format('DD/MM/YYYY HH:mm')}
          </Text>
        )}
      </View>
    </View>
  );

  const renderFiltros = () => (
    <View style={styles.filtrosContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* Filtro por estado */}
        <View style={styles.filtroGroup}>
          <Text style={styles.filtroLabel}>Estado:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['todos', 'completadas', 'pendiente', 'confirmada', 'cancelada'].map(estado => (
              <TouchableOpacity
                key={estado}
                style={[
                  styles.filtroButton,
                  filtroEstado === estado && styles.filtroButtonActive
                ]}
                onPress={() => setFiltroEstado(estado)}
              >
                <Text style={[
                  styles.filtroButtonText,
                  filtroEstado === estado && styles.filtroButtonTextActive
                ]}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filtro por fecha */}
        <View style={styles.filtroGroup}>
          <Text style={styles.filtroLabel}>Período:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['todos', 'hoy', 'semana', 'mes'].map(periodo => (
              <TouchableOpacity
                key={periodo}
                style={[
                  styles.filtroButton,
                  filtroFecha === periodo && styles.filtroButtonActive
                ]}
                onPress={() => setFiltroFecha(periodo)}
              >
                <Text style={[
                  styles.filtroButtonText,
                  filtroFecha === periodo && styles.filtroButtonTextActive
                ]}>
                  {periodo.charAt(0).toUpperCase() + periodo.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );

  const citasFiltradas = filtrarCitas(historial);

  if (loading) {
    return (
      <LinearGradient colors={['#e8f5e8', '#c8e6c9']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando tu historial médico...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#e8f5e8', '#c8e6c9']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#e8f5e8" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Historial Médico</Text>
          <TouchableOpacity 
            onPress={loadHistorial} 
            style={styles.refreshButton}
          >
            <Ionicons name="refresh" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {/* Estadísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{historial.length}</Text>
            <Text style={styles.statLabel}>Total Citas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {historial.filter(c => c.estado === 'completada').length}
            </Text>
            <Text style={styles.statLabel}>Completadas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {historial.filter(c => c.estado === 'pendiente').length}
            </Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
        </View>

        {/* Filtros */}
        {renderFiltros()}

        {/* Lista de citas */}
        <View style={styles.listaContainer}>
          <Text style={styles.listaTitle}>
            {citasFiltradas.length} cita{citasFiltradas.length !== 1 ? 's' : ''} encontrada{citasFiltradas.length !== 1 ? 's' : ''}
          </Text>
          
          <FlatList
            data={citasFiltradas}
            renderItem={renderCitaItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4CAF50']}
                tintColor="#4CAF50"
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listaContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No tienes citas en tu historial</Text>
                <Text style={styles.emptySubtext}>
                  Las citas aparecerán aquí una vez que sean agendadas
                </Text>
                <TouchableOpacity 
                  style={styles.agendarButton}
                  onPress={() => navigation.navigate('AgendarCita')}
                >
                  <Text style={styles.agendarButtonText}>Agendar Nueva Cita</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  refreshButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  filtrosContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtroGroup: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filtroLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filtroButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filtroButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filtroButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filtroButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listaContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 12,
  },
  listaContent: {
    paddingBottom: 20,
  },
  citaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicoInfo: {
    flex: 1,
  },
  medicoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  especialidad: {
    fontSize: 14,
    color: '#666',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  estadoIcon: {
    marginRight: 4,
  },
  estadoText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  citaDetalles: {
    marginBottom: 12,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detalleText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  motivoSection: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  motivoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  motivoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  observacionesSection: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  observacionesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  observacionesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  citaFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  fechaCreacion: {
    fontSize: 12,
    color: '#999',
  },
  fechaActualizacion: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  agendarButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  agendarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistorialPaciente;

