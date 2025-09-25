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
import { medicosService, adminService } from '../../src/service/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MedicosScreen({ navigation }) {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    loadUserRole();
    loadMedicos();
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

  const loadMedicos = async () => {
    try {
      setLoading(true);
      console.log('Cargando médicos...');
      
      // Usar siempre la ruta pública para obtener médicos
      const result = await medicosService.getAll();
      
      console.log('Resultado de médicos:', result);
      
      if (result.success && Array.isArray(result.data)) {
        setMedicos(result.data);
        console.log('Médicos cargados desde API:', result.data.length);
      } else {
        console.log('API falló, usando datos de ejemplo');
        // Si falla la API, usar datos de ejemplo
        const datosEjemplo = [
          { id: 1, nombre: 'Dr. Carlos Saavedra', especialidad: 'Cardiología', experiencia: '10 años' },
          { id: 2, nombre: 'Dra. María González', especialidad: 'Pediatría', experiencia: '8 años' },
          { id: 3, nombre: 'Dr. Juan Pérez', especialidad: 'Dermatología', experiencia: '12 años' },
          { id: 4, nombre: 'Dra. Ana López', especialidad: 'Neurología', experiencia: '15 años' }
        ];
        setMedicos(datosEjemplo);
        console.log('Usando datos de ejemplo:', datosEjemplo.length);
      }
    } catch (error) {
      console.error('Error cargando médicos:', error);
      // Datos de ejemplo en caso de error
      const datosEjemplo = [
        { id: 1, nombre: 'Dr. Carlos Saavedra', especialidad: 'Cardiología', experiencia: '10 años' },
        { id: 2, nombre: 'Dra. María González', especialidad: 'Pediatría', experiencia: '8 años' },
        { id: 3, nombre: 'Dr. Juan Pérez', especialidad: 'Dermatología', experiencia: '12 años' }
      ];
      setMedicos(datosEjemplo);
      console.log('Error - usando datos de ejemplo:', datosEjemplo.length);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMedicos();
    setRefreshing(false);
  };

  const handleAddMedico = () => {
    if (userRole === 'admin') {
      // Pedir todos los datos necesarios
      Alert.prompt(
        'Agregar Médico',
        'Ingresa el nombre del médico:',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Siguiente', 
            onPress: async (nombre) => {
              if (nombre && nombre.trim()) {
                // Pedir apellido
                Alert.prompt(
                  'Agregar Médico',
                  'Ingresa el apellido del médico:',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { 
                      text: 'Siguiente', 
                      onPress: async (apellido) => {
                        if (apellido && apellido.trim()) {
                          // Pedir email
                          Alert.prompt(
                            'Agregar Médico',
                            'Ingresa el email del médico:',
                            [
                              { text: 'Cancelar', style: 'cancel' },
                              { 
                                text: 'Siguiente', 
                                onPress: async (email) => {
                                  if (email && email.trim()) {
                                    // Pedir contraseña
                                    Alert.prompt(
                                      'Agregar Médico',
                                      'Ingresa la contraseña del médico:',
                                      [
                                        { text: 'Cancelar', style: 'cancel' },
                                        { 
                                          text: 'Siguiente', 
                                          onPress: async (password) => {
                                            if (password && password.trim()) {
                                              // Pedir teléfono
                                              Alert.prompt(
                                                'Agregar Médico',
                                                'Ingresa el teléfono del médico:',
                                                [
                                                  { text: 'Cancelar', style: 'cancel' },
                                                  { 
                                                    text: 'Siguiente', 
                                                    onPress: async (telefono) => {
                                                      if (telefono && telefono.trim()) {
                                                        // Pedir número de licencia
                                                        Alert.prompt(
                                                          'Agregar Médico',
                                                          'Ingresa el número de licencia:',
                                                          [
                                                            { text: 'Cancelar', style: 'cancel' },
                                                            { 
                                                              text: 'Crear', 
                                                              onPress: async (numero_licencia) => {
                                                                if (numero_licencia && numero_licencia.trim()) {
                                                                  await createMedico({
                                                                    nombre: nombre.trim(),
                                                                    apellido: apellido.trim(),
                                                                    email: email.trim(),
                                                                    password: password.trim(),
                                                                    telefono: telefono.trim(),
                                                                    numero_licencia: numero_licencia.trim(),
                                                                    especialidad_id: 1 // Por defecto
                                                                  });
                                                                }
                                                              }
                                                            }
                                                          ],
                                                          'plain-text'
                                                        );
                                                      }
                                                    }
                                                  }
                                                ],
                                                'plain-text'
                                              );
                                            }
                                          }
                                        }
                                      ],
                                      'plain-text'
                                    );
                                  }
                                }
                              }
                            ],
                            'plain-text'
                          );
                        }
                      }
                    }
                  ],
                  'plain-text'
                );
              }
            }
          }
        ],
        'plain-text'
      );
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden agregar médicos');
    }
  };

  const createMedico = async (medicoData) => {
    try {
      const result = await adminService.createMedico(medicoData);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Médico creado exitosamente');
        loadMedicos();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al crear médico');
      }
    } catch (error) {
      console.error('Error creando médico:', error);
      Alert.alert('❌ Error', 'Error al crear médico');
    }
  };

  const handleEditMedico = (medico) => {
    if (userRole === 'admin') {
      Alert.prompt(
        'Editar Médico',
        'Modifica el nombre del médico:',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Guardar', 
            onPress: async (nuevoNombre) => {
              if (nuevoNombre && nuevoNombre.trim()) {
                await updateMedico(medico.id, nuevoNombre.trim());
              }
            }
          }
        ],
        'plain-text',
        medico.nombre || medico.name
      );
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden editar médicos');
    }
  };

  const updateMedico = async (id, nombre) => {
    try {
      const result = await adminService.updateMedico(id, { nombre: nombre });
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Médico actualizado exitosamente');
        loadMedicos();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al actualizar médico');
      }
    } catch (error) {
      console.error('Error actualizando médico:', error);
      Alert.alert('❌ Error', 'Error al actualizar médico');
    }
  };

  const handleDeleteMedico = (medico) => {
    if (userRole === 'admin') {
      Alert.alert(
        'Eliminar Médico',
        `¿Estás seguro de que quieres eliminar "${medico.nombre || medico.name}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Eliminar', 
            style: 'destructive',
            onPress: () => deleteMedico(medico.id)
          }
        ]
      );
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden eliminar médicos');
    }
  };

  const deleteMedico = async (id) => {
    try {
      const result = await adminService.deleteMedico(id);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Médico eliminado exitosamente');
        loadMedicos();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al eliminar médico');
      }
    } catch (error) {
      console.error('Error eliminando médico:', error);
      Alert.alert('❌ Error', 'Error al eliminar médico');
    }
  };

  const renderMedico = (medico) => (
    <View key={medico.id} style={styles.medicoCard}>
      <View style={styles.medicoInfo}>
        <Text style={styles.medicoNombre}>{medico.nombre || medico.name}</Text>
        {medico.apellido && (
          <Text style={styles.medicoApellido}>{medico.apellido}</Text>
        )}
        {medico.email && (
          <Text style={styles.medicoEmail}>{medico.email}</Text>
        )}
        {medico.telefono && (
          <Text style={styles.medicoTelefono}>Tel: {medico.telefono}</Text>
        )}
        {medico.especialidad && (
          <Text style={styles.medicoEspecialidad}>
            Especialidad: {typeof medico.especialidad === 'object' ? medico.especialidad.nombre : medico.especialidad}
          </Text>
        )}
        {medico.numero_licencia && (
          <Text style={styles.medicoLicencia}>Licencia: {medico.numero_licencia}</Text>
        )}
      </View>
      
      {userRole === 'admin' && (
        <View style={styles.medicoActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditMedico(medico)}
          >
            <Ionicons name="pencil" size={20} color="#1976D2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteMedico(medico)}
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
        <Text style={styles.loadingText}>Cargando médicos...</Text>
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
          <Text style={styles.headerTitle}>Médicos</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddMedico}
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
            <Text style={styles.title}>Gestión de Médicos</Text>
            <Text style={styles.subtitle}>
              {medicos ? medicos.length : 0} médicos disponibles
            </Text>
          </View>

          {!medicos || medicos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="medical-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No hay médicos disponibles</Text>
              {userRole === 'admin' && (
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={handleAddMedico}
                >
                  <Text style={styles.emptyButtonText}>Agregar Primer Médico</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.medicosContainer}>
              {medicos.map(renderMedico)}
            </View>
          )}

          {userRole === 'admin' && (
            <TouchableOpacity 
              style={styles.addButtonLarge}
              onPress={handleAddMedico}
            >
              <LinearGradient
                colors={["#1976D2", "#42A5F5"]}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={24} color="#fff" />
                <Text style={styles.addButtonText}>Agregar Médico</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
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
  medicosContainer: {
    marginBottom: 20,
  },
  medicoCard: {
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
  medicoInfo: {
    flex: 1,
  },
  medicoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 3,
  },
  medicoApellido: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  medicoEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  medicoTelefono: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  medicoEspecialidad: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  medicoLicencia: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  medicoActions: {
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