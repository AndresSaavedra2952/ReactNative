import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { adminService, especialidadesService } from '../service/ApiService';

const EditarMedicoModal = ({ visible, onClose, medico, onMedicoUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    numero_licencia: '',
    especialidad_id: null
  });
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(true);

  useEffect(() => {
    if (medico) {
      setFormData({
        nombre: medico.nombre || '',
        apellido: medico.apellido || '',
        email: medico.email || '',
        telefono: medico.telefono || '',
        numero_licencia: medico.numero_licencia || '',
        especialidad_id: medico.especialidad_id || null
      });
    }
  }, [medico]);

  useEffect(() => {
    if (visible) {
      loadEspecialidades();
    }
  }, [visible]);

  const loadEspecialidades = async () => {
    try {
      const response = await especialidadesService.getAll();
      if (response.success) {
        setEspecialidades(response.data);
      }
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
    } finally {
      setLoadingEspecialidades(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validar campos obligatorios
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    if (!formData.apellido.trim()) {
      Alert.alert('Error', 'El apellido es obligatorio');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'El email es obligatorio');
      return;
    }
    if (!formData.telefono.trim()) {
      Alert.alert('Error', 'El teléfono es obligatorio');
      return;
    }
    if (!formData.numero_licencia.trim()) {
      Alert.alert('Error', 'El número de licencia es obligatorio');
      return;
    }
    if (!formData.especialidad_id) {
      Alert.alert('Error', 'Debe seleccionar una especialidad');
      return;
    }

    setLoading(true);
    try {
      const response = await adminService.updateMedico(medico.id, formData);
      if (response.success) {
        Alert.alert('Éxito', 'Médico actualizado exitosamente');
        onMedicoUpdated();
        onClose();
      } else {
        Alert.alert('Error', response.message || 'Error al actualizar médico');
      }
    } catch (error) {
      console.error('Error al actualizar médico:', error);
      Alert.alert('Error', 'Error al actualizar médico');
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.modalTitle}>Editar Médico</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                value={formData.nombre}
                onChangeText={(value) => handleInputChange('nombre', value)}
                placeholder="Ej: Juan"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apellido *</Text>
              <TextInput
                style={styles.input}
                value={formData.apellido}
                onChangeText={(value) => handleInputChange('apellido', value)}
                placeholder="Ej: Pérez"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Ej: juan.perez@email.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono *</Text>
              <TextInput
                style={styles.input}
                value={formData.telefono}
                onChangeText={(value) => handleInputChange('telefono', value)}
                placeholder="Ej: 300-123-4567"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número de Licencia *</Text>
              <TextInput
                style={styles.input}
                value={formData.numero_licencia}
                onChangeText={(value) => handleInputChange('numero_licencia', value)}
                placeholder="Ej: 12345"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Especialidad *</Text>
              {loadingEspecialidades ? (
                <ActivityIndicator size="small" color="#1976D2" />
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.especialidadesContainer}>
                  {especialidades.map((especialidad) => (
                    <TouchableOpacity
                      key={especialidad.id}
                      style={[
                        styles.especialidadButton,
                        formData.especialidad_id === especialidad.id && styles.especialidadButtonSelected
                      ]}
                      onPress={() => handleInputChange('especialidad_id', especialidad.id)}
                    >
                      <Text style={[
                        styles.especialidadButtonText,
                        formData.especialidad_id === especialidad.id && styles.especialidadButtonTextSelected
                      ]}>
                        {especialidad.nombre}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Actualizar</Text>
              )}
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
    maxHeight: '80%',
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
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  especialidadesContainer: {
    flexDirection: 'row',
  },
  especialidadButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  especialidadButtonSelected: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  especialidadButtonText: {
    fontSize: 14,
    color: '#666',
  },
  especialidadButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
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
  submitButton: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: '#1976D2',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditarMedicoModal;
