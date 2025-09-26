import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { citasService, adminService } from "../../src/service/ApiService";

export default function CrearCitaScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [medicos, setMedicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [formData, setFormData] = useState({
    medico_id: "",
    consultorio_id: "",
    especialidad_id: "",
    fecha_hora: new Date(),
    motivo: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [medicosResult, consultoriosResult, especialidadesResult] = await Promise.all([
        adminService.getMedicos(),
        adminService.getConsultorios(),
        adminService.getEspecialidades(),
      ]);

      if (medicosResult.success) setMedicos(medicosResult.data);
      if (consultoriosResult.success) setConsultorios(consultoriosResult.data);
      if (especialidadesResult.success) setEspecialidades(especialidadesResult.data);
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
      Alert.alert("Error", "Error al cargar los datos necesarios");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prev => ({ ...prev, fecha_hora: selectedDate }));
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDateTime = new Date(formData.fecha_hora);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setFormData(prev => ({ ...prev, fecha_hora: newDateTime }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.medico_id || !formData.consultorio_id || !formData.especialidad_id || !formData.fecha_hora || !formData.motivo) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const result = await citasService.create({
        ...formData,
        fecha_hora: formData.fecha_hora.toISOString(),
      });

      if (result.success) {
        Alert.alert("✅ Éxito", "Cita agendada correctamente", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert("❌ Error", result.message || "Error al agendar cita");
      }
    } catch (error) {
      console.error("Error al agendar cita:", error);
      Alert.alert("❌ Error", "Error inesperado al agendar cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#e0f7ff", "#f9fbfd"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1976D2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendar Cita</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Nueva Cita Médica</Text>
            <Text style={styles.subtitle}>
              Completa los datos para agendar tu cita
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Médico *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.medico_id}
                  onValueChange={(value) => handleInputChange("medico_id", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecciona un médico" value="" />
                  {medicos.map((medico) => (
                    <Picker.Item 
                      key={medico.id} 
                      label={medico.name || medico.nombre} 
                      value={medico.id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Consultorio *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.consultorio_id}
                  onValueChange={(value) => handleInputChange("consultorio_id", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecciona un consultorio" value="" />
                  {consultorios.map((consultorio) => (
                    <Picker.Item 
                      key={consultorio.id} 
                      label={consultorio.nombre} 
                      value={consultorio.id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Especialidad *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.especialidad_id}
                  onValueChange={(value) => handleInputChange("especialidad_id", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecciona una especialidad" value="" />
                  {especialidades.map((especialidad) => (
                    <Picker.Item 
                      key={especialidad.id} 
                      label={especialidad.nombre} 
                      value={especialidad.id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha *</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {formData.fecha_hora.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#1976D2" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hora *</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {formData.fecha_hora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
                <Ionicons name="time-outline" size={20} color="#1976D2" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Motivo de la Cita *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.motivo}
                onChangeText={(value) => handleInputChange("motivo", value)}
                placeholder="Describe el motivo de tu cita"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <LinearGradient
                colors={["#1976D2", "#42A5F5"]}
                style={styles.submitButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="calendar" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Agendar Cita</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={formData.fecha_hora}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={formData.fecha_hora}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
      </SafeAreaView>
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
    marginLeft: 15,
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


