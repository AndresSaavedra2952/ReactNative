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
import { epsService, adminService } from '../../src/service/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EpsScreen({ navigation }) {
  const [eps, setEps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    loadUserRole();
    loadEps();
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

  const loadEps = async () => {
    try {
      setLoading(true);
      console.log('Cargando EPS...');
      
      // Usar siempre la ruta pública para obtener EPS
      const result = await epsService.getAll();
      
      console.log('Resultado de EPS:', result);
      
      if (result.success && Array.isArray(result.data)) {
        setEps(result.data);
        console.log('EPS cargadas desde API:', result.data.length);
      } else {
        console.log('API falló, usando datos de ejemplo');
        // Si falla la API, usar datos de ejemplo
        const datosEjemplo = [
          { id: 1, nombre: 'EPS Sura', nit: '890123456-1', direccion: 'Calle 123 #45-67', telefono: '6012345678', email: 'contacto@epssura.com' },
          { id: 2, nombre: 'EPS Sanitas', nit: '890123456-2', direccion: 'Carrera 78 #90-12', telefono: '6012345679', email: 'contacto@epssanitas.com' },
          { id: 3, nombre: 'EPS Coomeva', nit: '890123456-3', direccion: 'Avenida 34 #56-78', telefono: '6012345680', email: 'contacto@epscoomeva.com' },
          { id: 4, nombre: 'EPS Compensar', nit: '890123456-4', direccion: 'Calle 90 #12-34', telefono: '6012345681', email: 'contacto@epscompensar.com' }
        ];
        setEps(datosEjemplo);
        console.log('Usando datos de ejemplo:', datosEjemplo.length);
      }
    } catch (error) {
      console.error('Error cargando EPS:', error);
      // Datos de ejemplo en caso de error
      const datosEjemplo = [
        { id: 1, nombre: 'EPS Sura', nit: '890123456-1', direccion: 'Calle 123 #45-67', telefono: '6012345678', email: 'contacto@epssura.com' },
        { id: 2, nombre: 'EPS Sanitas', nit: '890123456-2', direccion: 'Carrera 78 #90-12', telefono: '6012345679', email: 'contacto@epssanitas.com' }
      ];
      setEps(datosEjemplo);
      console.log('Error - usando datos de ejemplo:', datosEjemplo.length);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEps();
    setRefreshing(false);
  };

  const handleAddEps = () => {
    if (userRole === 'admin') {
      // Pedir todos los datos necesarios
      Alert.prompt(
        'Agregar EPS',
        'Ingresa el nombre de la EPS:',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Siguiente', 
            onPress: async (nombre) => {
              if (nombre && nombre.trim()) {
                // Pedir NIT
                Alert.prompt(
                  'Agregar EPS',
                  'Ingresa el NIT de la EPS:',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { 
                      text: 'Siguiente', 
                      onPress: async (nit) => {
                        if (nit && nit.trim()) {
                          // Pedir dirección
                          Alert.prompt(
                            'Agregar EPS',
                            'Ingresa la dirección:',
                            [
                              { text: 'Cancelar', style: 'cancel' },
                              { 
                                text: 'Siguiente', 
                                onPress: async (direccion) => {
                                  if (direccion && direccion.trim()) {
                                    // Pedir teléfono
                                    Alert.prompt(
                                      'Agregar EPS',
                                      'Ingresa el teléfono:',
                                      [
                                        { text: 'Cancelar', style: 'cancel' },
                                        { 
                                          text: 'Siguiente', 
                                          onPress: async (telefono) => {
                                            if (telefono && telefono.trim()) {
                                              // Pedir email
                                              Alert.prompt(
                                                'Agregar EPS',
                                                'Ingresa el email:',
                                                [
                                                  { text: 'Cancelar', style: 'cancel' },
                                                  { 
                                                    text: 'Crear', 
                                                    onPress: async (email) => {
                                                      if (email && email.trim()) {
                                                        await createEps({
                                                          nombre: nombre.trim(),
                                                          nit: nit.trim(),
                                                          direccion: direccion.trim(),
                                                          telefono: telefono.trim(),
                                                          email: email.trim()
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
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden agregar EPS');
    }
  };

  const createEps = async (epsData) => {
    try {
      const result = await adminService.createEps(epsData);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'EPS creada exitosamente');
        loadEps();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al crear EPS');
      }
    } catch (error) {
      console.error('Error creando EPS:', error);
      Alert.alert('❌ Error', 'Error al crear EPS');
    }
  };

  const handleEditEps = (eps) => {
    if (userRole === 'admin') {
      Alert.prompt(
        'Editar EPS',
        'Modifica el nombre de la EPS:',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Guardar', 
            onPress: async (nuevoNombre) => {
              if (nuevoNombre && nuevoNombre.trim()) {
                await updateEps(eps.id, nuevoNombre.trim());
              }
            }
          }
        ],
        'plain-text',
        eps.nombre
      );
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden editar EPS');
    }
  };

  const updateEps = async (id, nombre) => {
    try {
      const result = await adminService.updateEps(id, { nombre: nombre });
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'EPS actualizada exitosamente');
        loadEps();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al actualizar EPS');
      }
    } catch (error) {
      console.error('Error actualizando EPS:', error);
      Alert.alert('❌ Error', 'Error al actualizar EPS');
    }
  };

  const handleDeleteEps = (eps) => {
    if (userRole === 'admin') {
      Alert.alert(
        'Eliminar EPS',
        `¿Estás seguro de que quieres eliminar "${eps.nombre}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Eliminar', 
            style: 'destructive',
            onPress: () => deleteEps(eps.id)
          }
        ]
      );
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden eliminar EPS');
    }
  };

  const deleteEps = async (id) => {
    try {
      const result = await adminService.deleteEps(id);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'EPS eliminada exitosamente');
        loadEps();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al eliminar EPS');
      }
    } catch (error) {
      console.error('Error eliminando EPS:', error);
      Alert.alert('❌ Error', 'Error al eliminar EPS');
    }
  };

  const renderEps = (eps) => (
    <View key={eps.id} style={styles.epsCard}>
      <View style={styles.epsInfo}>
        <Text style={styles.epsNombre}>{eps.nombre}</Text>
        {eps.nit && (
          <Text style={styles.epsNit}>NIT: {eps.nit}</Text>
        )}
        {eps.direccion && (
          <Text style={styles.epsDireccion}>{eps.direccion}</Text>
        )}
        {eps.telefono && (
          <Text style={styles.epsTelefono}>Tel: {eps.telefono}</Text>
        )}
        {eps.email && (
          <Text style={styles.epsEmail}>{eps.email}</Text>
        )}
      </View>
      
      {userRole === 'admin' && (
        <View style={styles.epsActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditEps(eps)}
          >
            <Ionicons name="pencil" size={20} color="#1976D2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteEps(eps)}
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
        <Text style={styles.loadingText}>Cargando EPS...</Text>
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
          <Text style={styles.headerTitle}>EPS</Text>
          {userRole === 'admin' && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddEps}
            >
              <Ionicons name="add" size={24} color="#1976D2" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Gestión de EPS</Text>
            <Text style={styles.subtitle}>{eps.length} EPS disponibles</Text>
          </View>

          {eps.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>No hay EPS registradas</Text>
              {userRole === 'admin' && (
                <TouchableOpacity style={styles.emptyButton} onPress={handleAddEps}>
                  <Text style={styles.emptyButtonText}>Agregar Primera EPS</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.epsContainer}>
              {eps.map(renderEps)}
            </View>
          )}

          {userRole === 'admin' && eps.length > 0 && (
            <TouchableOpacity style={styles.addButtonLarge} onPress={handleAddEps}>
              <LinearGradient
                colors={["#1976D2", "#1565C0"]}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={24} color="#fff" />
                <Text style={styles.addButtonText}>Agregar Nueva EPS</Text>
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
  epsContainer: {
    marginBottom: 20,
  },
  epsCard: {
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
  epsInfo: {
    flex: 1,
  },
  epsNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 3,
  },
  epsNit: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  epsDireccion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  epsTelefono: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  epsEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  epsActions: {
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