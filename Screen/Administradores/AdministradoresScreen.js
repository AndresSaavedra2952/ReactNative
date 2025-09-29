import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { administradoresService } from '../../src/service/administradoresService';
import CrearAdministradorModal from '../../src/components/CrearAdministradorModal';
import EditarAdministradorModal from '../../src/components/EditarAdministradorModal';

const AdministradoresScreen = ({ navigation }) => {
  const [administradores, setAdministradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [administradorEditando, setAdministradorEditando] = useState(null);

  useEffect(() => {
    loadUserRole();
    loadAdministradores();
  }, []);

  const loadUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserRole(parsedData.tipo || parsedData.role || '');
      }
    } catch (error) {
      console.error('Error al cargar rol de usuario:', error);
    }
  };

  const loadAdministradores = async () => {
    try {
      setLoading(true);
      const response = await administradoresService.getAll();
      if (response.success) {
        setAdministradores(response.data || []);
      } else {
        console.error('Error en respuesta:', response.message);
        setAdministradores([]);
      }
    } catch (error) {
      console.error('Error al cargar administradores:', error);
      setAdministradores([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAdministradores();
    setRefreshing(false);
  };

  const handleAddAdministrador = () => {
    setShowCrearModal(true);
  };

  const handleEditAdministrador = (administrador) => {
    setAdministradorEditando(administrador);
    setShowEditarModal(true);
  };

  const handleAdministradorCreated = () => {
    setShowCrearModal(false);
    loadAdministradores();
  };

  const handleAdministradorUpdated = () => {
    setShowEditarModal(false);
    setAdministradorEditando(null);
    loadAdministradores();
  };

  const handleDeleteAdministrador = (administrador) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar al administrador ${administrador.nombre} ${administrador.apellido}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteAdministrador(administrador.id)
        }
      ]
    );
  };

  const deleteAdministrador = async (id) => {
    try {
      const response = await administradoresService.delete(id);
      if (response.success) {
        Alert.alert('Éxito', 'Administrador eliminado exitosamente');
        loadAdministradores();
      } else {
        Alert.alert('Error', response.message || 'Error al eliminar administrador');
      }
    } catch (error) {
      console.error('Error al eliminar administrador:', error);
      Alert.alert('Error', 'Error al eliminar administrador');
    }
  };

  const renderAdministrador = ({ item: administrador }) => (
    <View style={styles.administradorCard}>
      <View style={styles.administradorHeader}>
        <View style={styles.administradorInfo}>
          <Text style={styles.administradorNombre}>
            {administrador.nombre} {administrador.apellido}
          </Text>
          <Text style={styles.administradorEmail}>{administrador.email}</Text>
          <Text style={styles.administradorTelefono}>{administrador.telefono}</Text>
        </View>
        <View style={styles.administradorStatus}>
          <View style={[
            styles.statusBadge,
            administrador.activo ? styles.statusActive : styles.statusInactive
          ]}>
            <Text style={styles.statusText}>
              {administrador.activo ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
      </View>
      
      {userRole === 'admin' && (
        <View style={styles.administradorActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditAdministrador(administrador)}
          >
            <Ionicons name="pencil" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteAdministrador(administrador)}
          >
            <Ionicons name="trash" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Cargando administradores...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Administradores</Text>
          {userRole === 'admin' && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddAdministrador}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          {administradores.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No hay administradores registrados</Text>
              {userRole === 'admin' && (
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={handleAddAdministrador}
                >
                  <Text style={styles.emptyButtonText}>Crear primer administrador</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <FlatList
              data={administradores}
              renderItem={renderAdministrador}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#1976D2']}
                />
              }
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>

        {/* Modales */}
        <CrearAdministradorModal
          visible={showCrearModal}
          onClose={() => setShowCrearModal(false)}
          onSuccess={handleAdministradorCreated}
        />

        <EditarAdministradorModal
          visible={showEditarModal}
          administrador={administradorEditando}
          onClose={() => {
            setShowEditarModal(false);
            setAdministradorEditando(null);
          }}
          onSuccess={handleAdministradorUpdated}
        />
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
    backgroundColor: '#667eea',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    opacity: 0.9,
  },
  emptyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  administradorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  administradorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  administradorInfo: {
    flex: 1,
  },
  administradorNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  administradorEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  administradorTelefono: {
    fontSize: 14,
    color: '#666',
  },
  administradorStatus: {
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#4CAF50',
  },
  statusInactive: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  administradorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  editButton: {
    backgroundColor: '#667eea',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AdministradoresScreen;
