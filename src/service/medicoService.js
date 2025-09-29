import api from './conexion';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const medicoService = {
  // Obtener citas del médico logueado
  getMisCitas: async () => {
    try {
      // Obtener datos del usuario logueado
      const userData = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userData);
      
      console.log('MedicoService - Usuario logueado:', user);
      
      const response = await api.get(`/medico/mis-citas?medico_id=${user.id}`);
      console.log('MedicoService - Respuesta de mis-citas:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis citas:', error);
      throw error;
    }
  },

  // Obtener pacientes del médico logueado
  getMisPacientes: async () => {
    try {
      // Obtener datos del usuario logueado
      const userData = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userData);
      
      const response = await api.get(`/medico/mis-pacientes?medico_id=${user.id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis pacientes:', error);
      throw error;
    }
  },

  // Obtener agenda del médico
  getMiAgenda: async () => {
    try {
      // Obtener datos del usuario logueado
      const userData = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userData);
      
      const response = await api.get(`/medico/mi-agenda?medico_id=${user.id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener mi agenda:', error);
      throw error;
    }
  },

  // Actualizar estado de una cita
  actualizarEstadoCita: async (citaId, estado) => {
    try {
      const response = await api.put(`/medico/citas/${citaId}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado de cita:', error);
      throw error;
    }
  },

  // Agregar observaciones a una cita
  agregarObservaciones: async (citaId, observaciones) => {
    try {
      const response = await api.put(`/medico/citas/${citaId}/observaciones`, { observaciones });
      return response.data;
    } catch (error) {
      console.error('Error al agregar observaciones:', error);
      throw error;
    }
  },

  // Obtener reportes del médico
  getReportes: async (periodo = 'hoy') => {
    try {
      // Obtener datos del usuario logueado
      const userData = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userData);
      
      console.log('MedicoService - Usuario logueado para reportes:', user);
      console.log('MedicoService - Período solicitado:', periodo);
      
      const response = await api.get(`/medico/reportes?medico_id=${user.id}&periodo=${periodo}`);
      console.log('MedicoService - Respuesta de reportes:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      throw error;
    }
  }
};
