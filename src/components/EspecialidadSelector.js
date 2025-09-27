import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { especialidadesService } from '../service/ApiService';

const EspecialidadSelector = ({ visible, onClose, onSelect, selectedId = null }) => {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadEspecialidades();
    }
  }, [visible]);

  const loadEspecialidades = async () => {
    setLoading(true);
    try {
      const response = await especialidadesService.getAll();
      if (response.success) {
        setEspecialidades(response.data);
      }
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (especialidad) => {
    onSelect(especialidad);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Especialidad</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1976D2" />
                <Text style={styles.loadingText}>Cargando especialidades...</Text>
              </View>
            ) : especialidades.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay especialidades disponibles</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {especialidades.map((especialidad) => (
                  <TouchableOpacity
                    key={especialidad.id}
                    style={[
                      styles.especialidadItem,
                      selectedId === especialidad.id && styles.especialidadItemSelected
                    ]}
                    onPress={() => handleSelect(especialidad)}
                  >
                    <View style={styles.especialidadInfo}>
                      <Text style={[
                        styles.especialidadNombre,
                        selectedId === especialidad.id && styles.especialidadNombreSelected
                      ]}>
                        {especialidad.nombre}
                      </Text>
                      {especialidad.descripcion && (
                        <Text style={[
                          styles.especialidadDescripcion,
                          selectedId === especialidad.id && styles.especialidadDescripcionSelected
                        ]}>
                          {especialidad.descripcion}
                        </Text>
                      )}
                    </View>
                    {selectedId === especialidad.id && (
                      <View style={styles.checkIcon}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '70%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  especialidadItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  especialidadItemSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
  },
  especialidadInfo: {
    flex: 1,
  },
  especialidadNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  especialidadNombreSelected: {
    color: '#1976D2',
  },
  especialidadDescripcion: {
    fontSize: 14,
    color: '#666',
  },
  especialidadDescripcionSelected: {
    color: '#1976D2',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});

export default EspecialidadSelector;
