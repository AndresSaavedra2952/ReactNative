import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/service/conexion';

const { width } = Dimensions.get('window');

export default function AgendarCitaPaciente({ navigation }) {
  const { user } = useAuth();
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    medico_id: null,
    especialidad_id: null,
    consultorio_id: null,
    fecha: '',
    hora: '',
    motivo_consulta: '',
    observaciones: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar médicos, especialidades y consultorios en paralelo
      const [medicosResponse, especialidadesResponse, consultoriosResponse] = await Promise.all([
        api.get('/medicos'),
        api.get('/especialidades'),
        api.get('/consultorios')
      ]);

      if (medicosResponse.data.success) {
        setMedicos(medicosResponse.data.data);
      }
      
      if (especialidadesResponse.data.success) {
        setEspecialidades(especialidadesResponse.data.data);
      }
      
      if (consultoriosResponse.data.success) {
        setConsultorios(consultoriosResponse.data.data);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'Error al cargar los datos necesarios');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { medico_id, consultorio_id, fecha, hora, motivo_consulta } = formData;
    
    if (!medico_id) {
      Alert.alert('Error', 'Debes seleccionar un médico');
      return false;
    }
    
    if (!consultorio_id) {
      Alert.alert('Error', 'Debes seleccionar un consultorio');
      return false;
    }
    
    if (!fecha) {
      Alert.alert('Error', 'Debes seleccionar una fecha');
      return false;
    }
    
    if (!hora) {
      Alert.alert('Error', 'Debes seleccionar una hora');
      return false;
    }
    
    if (!motivo_consulta) {
      Alert.alert('Error', 'Debes especificar el motivo de la consulta');
      return false;
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      Alert.alert('Error', 'La fecha debe estar en formato YYYY-MM-DD');
      return false;
    }

    // Validar formato de hora (HH:MM o HH:MM:SS)
    const horaRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    if (!horaRegex.test(hora)) {
      Alert.alert('Error', 'La hora debe estar en formato HH:MM o HH:MM:SS');
      return false;
    }

    // Si es HH:MM, convertir a HH:MM:SS
    if (hora.length === 5) {
      formData.hora = hora + ':00';
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      // Debug: Verificar el objeto user
      console.log('🔍 Debug - Objeto user completo:', user);
      console.log('🔍 Debug - user.id:', user?.id);
      console.log('🔍 Debug - formData completo:', formData);
      
      const citaData = {
        paciente_id: user?.id || 1, // Usar ID 1 como fallback si user.id no existe
        medico_id: formData.medico_id,
        consultorio_id: formData.consultorio_id,
        fecha: formData.fecha,
        hora: formData.hora,
        motivo_consulta: formData.motivo_consulta,
        observaciones: formData.observaciones || '',
        estado: 'pendiente'
      };

      console.log('📤 Enviando datos de la cita:', citaData);

      const response = await api.post('/citas', citaData);
      
      if (response.data.success) {
        Alert.alert(
          '✅ Cita Agendada',
          'Tu cita ha sido agendada exitosamente. Te contactaremos pronto.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', response.data.message || 'Error al agendar la cita');
      }
    } catch (error) {
      console.error('❌ Error al agendar cita:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      if (error.response?.status === 422) {
        Alert.alert('Error', 'Datos inválidos: ' + (error.response.data?.message || 'Verifica los campos'));
      } else if (error.response?.status === 500) {
        Alert.alert('Error', 'Error del servidor: ' + (error.response.data?.message || 'Inténtalo más tarde.'));
      } else {
        Alert.alert('Error', 'Error inesperado: ' + (error.message || 'Error de conexión'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderSelector = (title, data, selectedId, onSelect, keyField = 'id', nameField = 'nombre') => (
    <View style={styles.selectorSection}>
      <Text style={styles.selectorTitle}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.selectorScrollView}
      >
        {data.map((item) => (
          <TouchableOpacity
            key={item[keyField]}
            style={[
              styles.selectorItem,
              selectedId === item[keyField] && styles.selectorItemSelected
            ]}
            onPress={() => onSelect(item[keyField])}
          >
            <Text style={[
              styles.selectorItemText,
              selectedId === item[keyField] && styles.selectorItemTextSelected
            ]}>
              {item[nameField]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const getMedicosByEspecialidad = () => {
    if (!formData.especialidad_id) return medicos;
    return medicos.filter(medico => medico.especialidad_id === formData.especialidad_id);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendar Cita</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.welcomeText}>
            Hola {user?.nombre} {user?.apellido}
          </Text>
          
          <Text style={styles.subtitle}>
            Completa los datos para agendar tu cita médica
          </Text>

          {/* Selector de Especialidad */}
          {renderSelector(
            'Selecciona Especialidad',
            especialidades,
            formData.especialidad_id,
            (especialidadId) => {
              handleInputChange('especialidad_id', especialidadId);
              handleInputChange('medico_id', null); // Reset médico cuando cambia especialidad
            }
          )}

          {/* Selector de Médico */}
          {renderSelector(
            'Selecciona Médico',
            getMedicosByEspecialidad(),
            formData.medico_id,
            (medicoId) => handleInputChange('medico_id', medicoId)
          )}

          {/* Selector de Consultorio */}
          {renderSelector(
            'Selecciona Consultorio',
            consultorios,
            formData.consultorio_id,
            (consultorioId) => handleInputChange('consultorio_id', consultorioId)
          )}

          {/* Campos de fecha y hora */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Fecha de la cita</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD (ej: 2025-10-15)"
              placeholderTextColor="#888"
              value={formData.fecha}
              onChangeText={(text) => handleInputChange('fecha', text)}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Hora de la cita</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM o HH:MM:SS (ej: 09:30 o 09:30:00)"
              placeholderTextColor="#888"
              value={formData.hora}
              onChangeText={(text) => {
                // Auto-formatear a HH:MM:SS si el usuario ingresa HH:MM
                if (text.length === 5 && text.includes(':') && text.split(':').length === 2) {
                  handleInputChange('hora', text + ':00');
                } else {
                  handleInputChange('hora', text);
                }
              }}
            />
          </View>

          {/* Motivo de consulta */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Motivo de la consulta *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe brevemente el motivo de tu consulta"
              placeholderTextColor="#888"
              multiline
              numberOfLines={3}
              value={formData.motivo_consulta}
              onChangeText={(text) => handleInputChange('motivo_consulta', text)}
            />
          </View>

          {/* Observaciones */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Observaciones adicionales</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Información adicional que consideres importante"
              placeholderTextColor="#888"
              multiline
              numberOfLines={2}
              value={formData.observaciones}
              onChangeText={(text) => handleInputChange('observaciones', text)}
            />
          </View>

          {/* Botón de envío */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              style={styles.submitButtonGradient}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="calendar" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Agendar Cita</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  selectorSection: {
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  selectorScrollView: {
    maxHeight: 60,
  },
  selectorItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectorItemSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  selectorItemText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  selectorItemTextSelected: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
