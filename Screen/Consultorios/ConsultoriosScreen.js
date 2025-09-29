import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { consultoriosService } from '../service/consultoriosService';
import CrearConsultorioModal from '../../src/components/CrearConsultorioModal';
import EditarConsultorioModal from '../../src/components/EditarConsultorioModal';
import { useAuth } from '../../src/context/AuthContext';

export default function ConsultoriosScreen({ navigation }) {
  const { userType } = useAuth();
  const [consultorios, setConsultorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [consultorioEditando, setConsultorioEditando] = useState(null);

  // Determinar si el usuario es administrador
  const isAdmin = userType === 'admin';

  useEffect(() => {
    loadConsultorios();
  }, []);

  const loadConsultorios = async () => {
    setLoading(true);
    try {
      const response = await consultoriosService.getAll();
      if (response.success) {
        setConsultorios(response.data);
      } else {
        Alert.alert('Error', response.message || 'Error al cargar consultorios');
      }
    } catch (error) {
      console.error('Error al cargar consultorios:', error);
      Alert.alert('Error', 'Error al cargar consultorios');
    } finally {
      setLoading(false);
    }
  };

  const handleAddConsultorio = () => {
    setShowCrearModal(true);
  };

  const handleEditConsultorio = (consultorio) => {
    setConsultorioEditando(consultorio);
    setShowEditarModal(true);
  };

  const handleConsultorioCreated = () => {
    loadConsultorios();
  };

  const handleConsultorioUpdated = () => {
    loadConsultorios();
  };

  const handleDeleteConsultorio = async (consultorio) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar el consultorio "${consultorio.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await consultoriosService.delete(consultorio.id);
              if (response.success) {
                Alert.alert('Éxito', 'Consultorio eliminado exitosamente');
                loadConsultorios();
              } else {
                Alert.alert('Error', response.message || 'Error al eliminar consultorio');
              }
            } catch (error) {
              console.error('Error al eliminar consultorio:', error);
              Alert.alert('Error', 'Error al eliminar consultorio');
            }
          }
        }
      ]
    );
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1976D2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isAdmin ? 'Gestión de Consultorios' : 'Consultorios Disponibles'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {!isAdmin && (
            <View style={styles.infoBanner}>
              <Ionicons name="information-circle" size={20} color="#1976D2" />
              <Text style={styles.infoBannerText}>
                Solo puedes visualizar los consultorios disponibles. Para crear o editar consultorios, contacta al administrador.
              </Text>
            </View>
          )}
          
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>
              {isAdmin ? 'Lista de Consultorios' : 'Consultorios Disponibles'}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {loading ? (
                <ActivityIndicator size="large" color="#1976D2" />
              ) : consultorios.length === 0 ? (
                <Text style={styles.noConsultoriosText}>No hay consultorios registrados.</Text>
              ) : (
                consultorios.map((consultorio, index) => (
                  <View key={consultorio.id} style={styles.consultorioItem}>
                    <View style={styles.consultorioInfo}>
                      <Text style={styles.consultorioText}>{consultorio.nombre}</Text>
                      <Text style={styles.consultorioSubtext}>{consultorio.ubicacion}</Text>
                      <Text style={styles.consultorioSubtext}>Tel: {consultorio.telefono}</Text>
                    </View>
                    {isAdmin && (
                      <View style={styles.consultorioActions}>
                        <TouchableOpacity 
                          style={styles.editButton}
                          onPress={() => handleEditConsultorio(consultorio)}
                        >
                          <Ionicons name="pencil" size={20} color="#1976D2" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => handleDeleteConsultorio(consultorio)}
                        >
                          <Ionicons name="trash" size={20} color="#e74c3c" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          </View>

          {isAdmin && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleAddConsultorio}>
                <Text style={styles.actionText}>Agregar Consultorio</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
      
      {/* Modales */}
      <CrearConsultorioModal
        visible={showCrearModal}
        onClose={() => setShowCrearModal(false)}
        onConsultorioCreated={handleConsultorioCreated}
      />
      
      <EditarConsultorioModal
        visible={showEditarModal}
        onClose={() => {
          setShowEditarModal(false);
          setConsultorioEditando(null);
        }}
        consultorio={consultorioEditando}
        onConsultorioUpdated={handleConsultorioUpdated}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#fff',
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 15,
  },
  noConsultoriosText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  consultorioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  consultorioInfo: {
    flex: 1,
  },
  consultorioText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  consultorioSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  consultorioActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 5,
  },
  deleteButton: {
    padding: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});