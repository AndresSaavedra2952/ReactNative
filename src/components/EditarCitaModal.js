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
import { citasService, pacientesService, medicosService, consultoriosService } from '../service/ApiService';

const EditarCitaModal = ({ visible, onClose, cita, onCitaUpdated }) => {
  const [formData, setFormData] = useState({
    paciente_id: '',
    medico_id: '',
    consultorio_id: '',
    fecha: '',
    hora: '',
    motivo_consulta: '',
    observaciones: '',
    estado: 'pendiente'
  });
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (cita) {
      console.log("Cita recibida:", cita);
      setFormData({
        paciente_id: cita.paciente_id || '',
        medico_id: cita.medico_id || '',
        consultorio_id: cita.consultorio_id || '',
        fecha: cita.fecha || '',
        hora: cita.hora || '',
        motivo_consulta: cita.motivo_consulta || cita.motivo || '',
        observaciones: cita.observaciones || '',
        estado: cita.estado || 'pendiente'
      });
      console.log("FormData inicializado:", {
        paciente_id: cita.paciente_id || '',
        medico_id: cita.medico_id || '',
        fecha: cita.fecha || '',
        hora: cita.hora || '',
        motivo_consulta: cita.motivo_consulta || cita.motivo || '',
        observaciones: cita.observaciones || '',
        estado: cita.estado || 'pendiente'
      });
    }
  }, [cita]);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      // Cargar pacientes
      const pacientesResponse = await pacientesService.getAll();
      if (pacientesResponse.success) {
        setPacientes(pacientesResponse.data);
      }

      // Cargar médicos
      const medicosResponse = await medicosService.getAll();
      if (medicosResponse.success) {
        setMedicos(medicosResponse.data);
      }

      // Cargar consultorios
      const consultoriosResponse = await consultoriosService.getAll();
      if (consultoriosResponse.success) {
        setConsultorios(consultoriosResponse.data);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field, value) => {
    // Formatear automáticamente la hora si se ingresa HH:MM
    if (field === 'hora' && value.match(/^\d{2}:\d{2}$/)) {
      value = value + ':00';
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validar campos obligatorios
    if (!formData.paciente_id) {
      Alert.alert('Error', 'Debes seleccionar un paciente');
      return;
    }
    if (!formData.medico_id) {
      Alert.alert('Error', 'Debes seleccionar un médico');
      return;
    }
    if (!formData.consultorio_id) {
      Alert.alert('Error', 'Debes seleccionar un consultorio');
      return;
    }
    if (!formData.fecha.trim()) {
      Alert.alert('Error', 'La fecha es obligatoria');
      return;
    }
    if (!formData.hora.trim()) {
      Alert.alert('Error', 'La hora es obligatoria');
      return;
    }
    if (!formData.motivo_consulta.trim()) {
      Alert.alert('Error', 'El motivo es obligatorio');
      return;
    }

    setLoading(true);
    try {
      console.log("Datos a enviar:", formData);
      const response = await citasService.update(cita.id, formData);
      if (response.success) {
        Alert.alert('Éxito', 'Cita actualizada exitosamente');
        onCitaUpdated();
        onClose();
      } else {
        Alert.alert('Error', response.message || 'Error al actualizar cita');
      }
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      Alert.alert('Error', 'Error al actualizar cita');
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
            <Text style={styles.modalTitle}>Editar Cita</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {loadingData ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1976D2" />
                <Text style={styles.loadingText}>Cargando datos...</Text>
              </View>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Paciente *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorContainer}>
                    {pacientes.map((paciente) => (
                      <TouchableOpacity
                        key={paciente.id}
                        style={[
                          styles.selectorItem,
                          formData.paciente_id === paciente.id && styles.selectorItemSelected
                        ]}
                        onPress={() => handleInputChange('paciente_id', paciente.id)}
                      >
                        <Text style={[
                          styles.selectorText,
                          formData.paciente_id === paciente.id && styles.selectorTextSelected
                        ]}>
                          {paciente.nombre} {paciente.apellido}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Médico *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorContainer}>
                    {medicos.map((medico) => (
                      <TouchableOpacity
                        key={medico.id}
                        style={[
                          styles.selectorItem,
                          formData.medico_id === medico.id && styles.selectorItemSelected
                        ]}
                        onPress={() => handleInputChange('medico_id', medico.id)}
                      >
                        <Text style={[
                          styles.selectorText,
                          formData.medico_id === medico.id && styles.selectorTextSelected
                        ]}>
                          Dr. {medico.nombre} {medico.apellido}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Consultorio *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorContainer}>
                    {consultorios.map((consultorio) => (
                      <TouchableOpacity
                        key={consultorio.id}
                        style={[
                          styles.selectorItem,
                          formData.consultorio_id === consultorio.id && styles.selectorItemSelected
                        ]}
                        onPress={() => handleInputChange('consultorio_id', consultorio.id)}
                      >
                        <Text style={[
                          styles.selectorText,
                          formData.consultorio_id === consultorio.id && styles.selectorTextSelected
                        ]}>
                          {consultorio.nombre} - {consultorio.numero}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Fecha *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.fecha}
                    onChangeText={(value) => handleInputChange('fecha', value)}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Hora *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.hora}
                    onChangeText={(value) => handleInputChange('hora', value)}
                    placeholder="HH:MM:SS"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Motivo *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.motivo_consulta}
                    onChangeText={(value) => {
                      console.log("Cambiando motivo_consulta:", value);
                      handleInputChange('motivo_consulta', value);
                    }}
                    placeholder="Motivo de la consulta..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Observaciones</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.observaciones}
                    onChangeText={(value) => handleInputChange('observaciones', value)}
                    placeholder="Observaciones adicionales..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Estado</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorContainer}>
                    {['pendiente', 'confirmada', 'completada', 'cancelada'].map((estado) => (
                      <TouchableOpacity
                        key={estado}
                        style={[
                          styles.selectorItem,
                          formData.estado === estado && styles.selectorItemSelected
                        ]}
                        onPress={() => handleInputChange('estado', estado)}
                      >
                        <Text style={[
                          styles.selectorText,
                          formData.estado === estado && styles.selectorTextSelected
                        ]}>
                          {estado.charAt(0).toUpperCase() + estado.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
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
              disabled={loading || loadingData}
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  selectorContainer: {
    flexDirection: 'row',
  },
  selectorItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  selectorItemSelected: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  selectorText: {
    fontSize: 14,
    color: '#666',
  },
  selectorTextSelected: {
    color: '#fff',
    fontWeight: '600',
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

export default EditarCitaModal;
