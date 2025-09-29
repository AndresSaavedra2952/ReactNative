import api from './conexion';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const pacienteService = {
  // Obtener citas del paciente logueado
  getMisCitas: async () => {
    try {
      // Obtener datos del usuario logueado
      const userData = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userData);
      
      console.log('PacienteService - Usuario logueado:', user);
      
      const response = await api.get(`/paciente/mis-citas?paciente_id=${user.id}`);
      console.log('PacienteService - Respuesta de mis-citas:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis citas:', error);
      throw error;
    }
  },

  // Agendar nueva cita
  agendarCita: async (citaData) => {
    try {
      const response = await api.post('/paciente/agendar-cita', citaData);
      return response.data;
    } catch (error) {
      console.error('Error al agendar cita:', error);
      throw error;
    }
  },

  // Cancelar cita
  cancelarCita: async (citaId) => {
    try {
      const response = await api.put(`/paciente/citas/${citaId}/cancelar`);
      return response.data;
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      throw error;
    }
  },

  // Obtener historial médico
  getMiHistorial: async () => {
    try {
      const response = await api.get('/paciente/mi-historial');
      return response.data;
    } catch (error) {
      console.error('Error al obtener mi historial:', error);
      throw error;
    }
  },

  // Obtener médicos disponibles
  getMedicosDisponibles: async () => {
    try {
      const response = await api.get('/paciente/medicos-disponibles');
      return response.data;
    } catch (error) {
      console.error('Error al obtener médicos disponibles:', error);
      throw error;
    }
  }
};
