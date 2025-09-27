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
import { pacientesService, adminService } from '../../src/service/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CrearPacienteModal from '../../src/components/CrearPacienteModal';
import EditarPacienteModal from '../../src/components/EditarPacienteModal';

export default function PacientesScreen({ navigation }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);

  useEffect(() => {
    loadUserRole();
    loadPacientes();
  }, []);

  const loadUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserRole(parsedData.role);
      }
    } catch (error) {
      console.error('Error cargando rol de usuario:', error);
    }
  };

  const loadPacientes = async () => {
    try {
      setLoading(true);
      console.log('Cargando pacientes...');

      const result = await pacientesService.getAll();
      console.log('Resultado de pacientes:', result);

      if (result.success && Array.isArray(result.data)) {
        setPacientes(result.data);
        console.log('Pacientes cargados desde API:', result.data.length);
      } else {
        console.log('API falló o no hay datos, usando datos de ejemplo');
        const datosEjemplo = [
          { 
            id: 1, 
            nombre: 'Juan', 
            apellido: 'Pérez', 
            cedula: '12345678', 
            fecha_nacimiento: '1990-01-15',
            telefono: '3001234567',
            email: 'juan@example.com',
            direccion: 'Calle 123 #45-67',
            eps_id: 1,
            eps: { nombre: 'EPS Sura' }
          },
          { 
            id: 2, 
            nombre: 'María', 
            apellido: 'González', 
            cedula: '87654321', 
            fecha_nacimiento: '1985-05-20',
            telefono: '3007654321',
            email: 'maria@example.com',
            direccion: 'Carrera 78 #90-12',
            eps_id: 2,
            eps: { nombre: 'EPS Sanitas' }
          },
        ];
        setPacientes(datosEjemplo);
        console.log('Usando datos de ejemplo:', datosEjemplo.length);
      }
    } catch (error) {
      console.error('Error cargando pacientes:', error);
      const datosEjemplo = [
        { 
          id: 1, 
          nombre: 'Juan', 
          apellido: 'Pérez', 
          cedula: '12345678', 
          fecha_nacimiento: '1990-01-15',
          telefono: '3001234567',
          email: 'juan@example.com',
          direccion: 'Calle 123 #45-67',
          eps_id: 1,
          eps: { nombre: 'EPS Sura' }
        },
      ];
      setPacientes(datosEjemplo);
      console.log('Error - usando datos de ejemplo:', datosEjemplo.length);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadPacientes();
    setRefreshing(false);
  }, []);

  const handleAddPaciente = () => {
    if (userRole === 'admin') {
      setShowCrearModal(true);
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden agregar pacientes');
    }
  };

  const createPaciente = async (pacienteData) => {
    try {
      console.log('Enviando datos del paciente:', pacienteData);
      const result = await adminService.createPaciente(pacienteData);
      console.log('Respuesta del servidor:', result);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Paciente creado exitosamente');
        loadPacientes();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al crear paciente');
      }
    } catch (error) {
      console.error('Error creando paciente:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.code === 'ECONNABORTED') {
        Alert.alert('❌ Error', 'Timeout: El servidor no respondió a tiempo');
      } else if (error.response?.status === 422) {
        Alert.alert('❌ Error de Validación', error.response?.data?.message || 'Datos inválidos');
      } else if (error.response?.status === 500) {
        Alert.alert('❌ Error del Servidor', 'Error interno del servidor');
      } else {
        Alert.alert('❌ Error', `Error al crear paciente: ${error.message}`);
      }
    }
  };

  const handleEditPaciente = (paciente) => {
    if (userRole === 'admin') {
      setPacienteEditando(paciente);
      setShowEditarModal(true);
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden editar pacientes');
    }
  };

  const handlePacienteCreated = () => {
    loadPacientes();
  };

  const handlePacienteUpdated = () => {
    loadPacientes();
  };

  const handleDeletePaciente = (paciente) => {
    if (userRole === 'admin') {
      Alert.alert(
        'Eliminar Paciente',
        `¿Estás seguro de que quieres eliminar "${paciente.nombre} ${paciente.apellido}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => deletePaciente(paciente.id)
          }
        ]
      );
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden eliminar pacientes');
    }
  };

  const deletePaciente = async (id) => {
    try {
      const result = await adminService.deletePaciente(id);
      if (result.success) {
        Alert.alert('✅ Éxito', 'Paciente eliminado exitosamente');
        loadPacientes();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al eliminar paciente');
      }
    } catch (error) {
      console.error('Error eliminando paciente:', error);
      Alert.alert('❌ Error', 'Error al eliminar paciente');
    }
  };

  const renderPaciente = (paciente) => (
    <View key={paciente.id} style={styles.pacienteCard}>
      <View style={styles.pacienteInfo}>
        <Text style={styles.pacienteNombre}>{paciente.nombre} {paciente.apellido}</Text>
        {paciente.cedula && <Text style={styles.pacienteDetail}>Cédula: {paciente.cedula}</Text>}
        {paciente.telefono && <Text style={styles.pacienteDetail}>Tel: {paciente.telefono}</Text>}
        {paciente.email && <Text style={styles.pacienteDetail}>Email: {paciente.email}</Text>}
        {paciente.fecha_nacimiento && <Text style={styles.pacienteDetail}>Nacimiento: {paciente.fecha_nacimiento}</Text>}
        {paciente.eps && (
          <Text style={styles.pacienteDetail}>
            EPS: {typeof paciente.eps === 'object' ? paciente.eps.nombre : paciente.eps}
          </Text>
        )}
      </View>

      {userRole === 'admin' && (
        <View style={styles.pacienteActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditPaciente(paciente)}
          >
            <Ionicons name="pencil" size={20} color="#1976D2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePaciente(paciente)}
          >
            <Ionicons name="trash" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Cargando pacientes...</Text>
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
          <Text style={styles.headerTitle}>Pacientes</Text>
          {userRole === 'admin' && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddPaciente}
            >
              <Ionicons name="add" size={24} color="#1976D2" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1976D2"]} />
          }
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Gestión de Pacientes</Text>
            <Text style={styles.subtitle}>{pacientes.length} pacientes registrados</Text>
          </View>

          {pacientes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>No hay pacientes registrados.</Text>
              {userRole === 'admin' && (
                <TouchableOpacity style={styles.emptyButton} onPress={handleAddPaciente}>
                  <Text style={styles.emptyButtonText}>Agregar Nuevo Paciente</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.pacientesContainer}>
              {pacientes.map(renderPaciente)}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      
      {/* Modales */}
      <CrearPacienteModal
        visible={showCrearModal}
        onClose={() => setShowCrearModal(false)}
        onPacienteCreated={handlePacienteCreated}
      />
      
      <EditarPacienteModal
        visible={showEditarModal}
        onClose={() => {
          setShowEditarModal(false);
          setPacienteEditando(null);
        }}
        paciente={pacienteEditando}
        onPacienteUpdated={handlePacienteUpdated}
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
    flexGrow: 1,
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
  pacientesContainer: {
    marginBottom: 20,
  },
  pacienteCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pacienteInfo: {
    flex: 1,
  },
  pacienteNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  pacienteDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  pacienteActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 20,
  },
});