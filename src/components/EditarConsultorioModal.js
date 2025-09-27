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
import { consultoriosService } from '../service/ApiService';

const EditarConsultorioModal = ({ visible, onClose, consultorio, onConsultorioUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    telefono: '',
    numero: '',
    piso: '',
    edificio: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (consultorio) {
      setFormData({
        nombre: consultorio.nombre || '',
        ubicacion: consultorio.ubicacion || '',
        telefono: consultorio.telefono || '',
        numero: consultorio.numero || '',
        piso: consultorio.piso || '',
        edificio: consultorio.edificio || '',
        descripcion: consultorio.descripcion || ''
      });
    }
  }, [consultorio]);

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
    if (!formData.ubicacion.trim()) {
      Alert.alert('Error', 'La ubicación es obligatoria');
      return;
    }
    if (!formData.telefono.trim()) {
      Alert.alert('Error', 'El teléfono es obligatorio');
      return;
    }
    if (!formData.numero.trim()) {
      Alert.alert('Error', 'El número es obligatorio');
      return;
    }

    setLoading(true);
    try {
      const response = await consultoriosService.update(consultorio.id, formData);
      if (response.success) {
        Alert.alert('Éxito', 'Consultorio actualizado exitosamente');
        onConsultorioUpdated();
        onClose();
      } else {
        Alert.alert('Error', response.message || 'Error al actualizar consultorio');
      }
    } catch (error) {
      console.error('Error al actualizar consultorio:', error);
      Alert.alert('Error', 'Error al actualizar consultorio');
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
            <Text style={styles.modalTitle}>Editar Consultorio</Text>
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
                placeholder="Ej: Consultorio de Cardiología"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ubicación *</Text>
              <TextInput
                style={styles.input}
                value={formData.ubicacion}
                onChangeText={(value) => handleInputChange('ubicacion', value)}
                placeholder="Ej: Piso 2, Ala Norte"
                placeholderTextColor="#999"
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
              <Text style={styles.label}>Número *</Text>
              <TextInput
                style={styles.input}
                value={formData.numero}
                onChangeText={(value) => handleInputChange('numero', value)}
                placeholder="Ej: 201"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Piso</Text>
              <TextInput
                style={styles.input}
                value={formData.piso}
                onChangeText={(value) => handleInputChange('piso', value)}
                placeholder="Ej: 2"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Edificio</Text>
              <TextInput
                style={styles.input}
                value={formData.edificio}
                onChangeText={(value) => handleInputChange('edificio', value)}
                placeholder="Ej: Edificio Principal"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.descripcion}
                onChangeText={(value) => handleInputChange('descripcion', value)}
                placeholder="Descripción del consultorio..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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

export default EditarConsultorioModal;
