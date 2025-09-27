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
import { especialidadesService, adminService } from '../../src/service/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CrearEspecialidadModal from '../../src/components/CrearEspecialidadModal';
import EditarEspecialidadModal from '../../src/components/EditarEspecialidadModal';

export default function EspecialidadesScreen({ navigation }) {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [especialidadEditando, setEspecialidadEditando] = useState(null);

  useEffect(() => {
    loadUserRole();
    loadEspecialidades();
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

  const loadEspecialidades = async () => {
    try {
      setLoading(true);
      console.log('Cargando especialidades...');
      
      const result = await especialidadesService.getAll();
      console.log('Resultado de especialidades:', result);
      
      if (result.success && Array.isArray(result.data)) {
        setEspecialidades(result.data);
        console.log('Especialidades cargadas desde API:', result.data.length);
      } else {
        console.log('API falló, usando datos de ejemplo');
        // Si falla la API, usar datos de ejemplo
        const datosEjemplo = [
          { id: 1, nombre: 'Cardiología', descripcion: 'Especialidad médica que se ocupa del corazón y sistema cardiovascular' },
          { id: 2, nombre: 'Pediatría', descripcion: 'Especialidad médica que se ocupa de la salud de los niños' },
          { id: 3, nombre: 'Dermatología', descripcion: 'Especialidad médica que se ocupa de la piel y sus enfermedades' },
          { id: 4, nombre: 'Neurología', descripcion: 'Especialidad médica que se ocupa del sistema nervioso' },
          { id: 5, nombre: 'Ginecología', descripcion: 'Especialidad médica que se ocupa de la salud femenina' },
          { id: 6, nombre: 'Ortopedia', descripcion: 'Especialidad médica que se ocupa del sistema musculoesquelético' }
        ];
        setEspecialidades(datosEjemplo);
        console.log('Usando datos de ejemplo:', datosEjemplo.length);
      }
    } catch (error) {
      console.error('Error cargando especialidades:', error);
      // Datos de ejemplo en caso de error
      const datosEjemplo = [
        { id: 1, nombre: 'Cardiología', descripcion: 'Especialidad médica que se ocupa del corazón y sistema cardiovascular' },
        { id: 2, nombre: 'Pediatría', descripcion: 'Especialidad médica que se ocupa de la salud de los niños' },
        { id: 3, nombre: 'Dermatología', descripcion: 'Especialidad médica que se ocupa de la piel y sus enfermedades' },
        { id: 4, nombre: 'Neurología', descripcion: 'Especialidad médica que se ocupa del sistema nervioso' }
      ];
      setEspecialidades(datosEjemplo);
      console.log('Error - usando datos de ejemplo:', datosEjemplo.length);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEspecialidades();
    setRefreshing(false);
  };

  const handleAddEspecialidad = () => {
    if (userRole === 'admin') {
      setShowCrearModal(true);
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden agregar especialidades');
    }
  };

  const createEspecialidad = async (nombre) => {
    try {
      const result = await adminService.createEspecialidad({ nombre });
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Especialidad creada exitosamente');
        loadEspecialidades(); // Recargar la lista
      } else {
        Alert.alert('❌ Error', result.message || 'Error al crear especialidad');
      }
    } catch (error) {
      console.error('Error creando especialidad:', error);
      Alert.alert('❌ Error', 'Error al crear especialidad');
    }
  };

  const handleEditEspecialidad = (especialidad) => {
    if (userRole === 'admin') {
      setEspecialidadEditando(especialidad);
      setShowEditarModal(true);
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden editar especialidades');
    }
  };

  const handleEspecialidadCreated = () => {
    loadEspecialidades();
  };

  const handleEspecialidadUpdated = () => {
    loadEspecialidades();
  };

  const handleDeleteEspecialidad = (especialidad) => {
    if (userRole === 'admin') {
      Alert.alert(
        'Eliminar Especialidad',
        `¿Estás seguro de que quieres eliminar "${especialidad.nombre}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Eliminar', 
            style: 'destructive',
            onPress: () => deleteEspecialidad(especialidad.id)
          }
        ]
      );
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden eliminar especialidades');
    }
  };

  const deleteEspecialidad = async (id) => {
    try {
      const result = await adminService.deleteEspecialidad(id);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Especialidad eliminada exitosamente');
        loadEspecialidades(); // Recargar la lista
      } else {
        Alert.alert('❌ Error', result.message || 'Error al eliminar especialidad');
      }
    } catch (error) {
      console.error('Error eliminando especialidad:', error);
      Alert.alert('❌ Error', 'Error al eliminar especialidad');
    }
  };

  const renderEspecialidad = (especialidad) => (
    <View key={especialidad.id} style={styles.especialidadCard}>
      <View style={styles.especialidadInfo}>
        <Text style={styles.especialidadNombre}>{especialidad.nombre}</Text>
        {especialidad.descripcion && (
          <Text style={styles.especialidadDescripcion}>{especialidad.descripcion}</Text>
        )}
      </View>
      
      {userRole === 'admin' && (
        <View style={styles.especialidadActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditEspecialidad(especialidad)}
          >
            <Ionicons name="pencil" size={20} color="#1976D2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteEspecialidad(especialidad)}
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
        <Text style={styles.loadingText}>Cargando especialidades...</Text>
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
          <Text style={styles.headerTitle}>Especialidades</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddEspecialidad}
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
            <Text style={styles.title}>Gestión de Especialidades</Text>
            <Text style={styles.subtitle}>
              {especialidades ? especialidades.length : 0} especialidades disponibles
            </Text>
          </View>

          {!especialidades || especialidades.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="medical-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No hay especialidades disponibles</Text>
              {userRole === 'admin' && (
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={handleAddEspecialidad}
                >
                  <Text style={styles.emptyButtonText}>Agregar Primera Especialidad</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.especialidadesContainer}>
              {especialidades.map(renderEspecialidad)}
            </View>
          )}

          {userRole === 'admin' && (
            <TouchableOpacity 
              style={styles.addButtonLarge}
              onPress={handleAddEspecialidad}
            >
              <LinearGradient
                colors={["#1976D2", "#42A5F5"]}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={24} color="#fff" />
                <Text style={styles.addButtonText}>Agregar Especialidad</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
      
      {/* Modales */}
      <CrearEspecialidadModal
        visible={showCrearModal}
        onClose={() => setShowCrearModal(false)}
        onEspecialidadCreated={handleEspecialidadCreated}
      />
      
      <EditarEspecialidadModal
        visible={showEditarModal}
        onClose={() => {
          setShowEditarModal(false);
          setEspecialidadEditando(null);
        }}
        especialidad={especialidadEditando}
        onEspecialidadUpdated={handleEspecialidadUpdated}
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
  especialidadesContainer: {
    marginBottom: 20,
  },
  especialidadCard: {
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
  especialidadInfo: {
    flex: 1,
  },
  especialidadNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  especialidadDescripcion: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  especialidadActions: {
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
  addButtonLarge: {
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
