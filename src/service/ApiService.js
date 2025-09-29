import api from './conexion';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Servicio general para operaciones CRUD
export class ApiService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getAll() {
    try {
      const response = await api.get(`/${this.endpoint}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`Error al obtener ${this.endpoint}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || `Error al obtener ${this.endpoint}` 
      };
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`/${this.endpoint}/${id}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`Error al obtener ${this.endpoint} por ID:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || `Error al obtener ${this.endpoint} por ID` 
      };
    }
  }

  async create(data) {
    try {
      const response = await api.post(`/${this.endpoint}`, data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`Error al crear ${this.endpoint}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || `Error al crear ${this.endpoint}` 
      };
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`/${this.endpoint}/${id}`, data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`Error al actualizar ${this.endpoint}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || `Error al actualizar ${this.endpoint}` 
      };
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`/${this.endpoint}/${id}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`Error al eliminar ${this.endpoint}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || `Error al eliminar ${this.endpoint}` 
      };
    }
  }
}

// Servicios específicos para cada entidad según las rutas de Laravel
export const administradoresService = new ApiService('administradores');
export const citasService = new ApiService('citas');
export const medicosService = new ApiService('medicos');
export const pacientesService = new ApiService('pacientes');
export const consultoriosService = new ApiService('consultorios');
export const especialidadesService = new ApiService('especialidades');
export const epsService = new ApiService('eps');

// Servicios específicos para admin
export const adminService = {
  // Gestión de usuarios
  async getUsers() {
    try {
      const response = await api.get('/users');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener usuarios' 
      };
    }
  },

  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener usuario' 
      };
    }
  },

  async updateUser(id, data) {
    try {
      const response = await api.put(`/users/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar usuario' 
      };
    }
  },

  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al eliminar usuario' 
      };
    }
  },

  // Gestión de pacientes (admin)
  async getPacientes() {
    try {
      const response = await api.get('/admin/pacientes');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener pacientes' 
      };
    }
  },

  async createPaciente(data) {
    try {
      const response = await api.post('/admin/pacientes', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al crear paciente:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al crear paciente' 
      };
    }
  },

  async updatePaciente(id, data) {
    try {
      const response = await api.put(`/admin/pacientes/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar paciente' 
      };
    }
  },

  async deletePaciente(id) {
    try {
      const response = await api.delete(`/admin/pacientes/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al eliminar paciente' 
      };
    }
  },

  // Gestión de médicos (admin)
  async getMedicos() {
    try {
      const response = await api.get('/admin/medicos');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener médicos:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener médicos' 
      };
    }
  },

  async createMedico(data) {
    try {
      const response = await api.post('/medicos', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al crear médico:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al crear médico' 
      };
    }
  },

  async updateMedico(id, data) {
    try {
      const response = await api.put(`/medicos/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar médico:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar médico' 
      };
    }
  },

  async deleteMedico(id) {
    try {
      const response = await api.delete(`/medicos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al eliminar médico:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al eliminar médico' 
      };
    }
  },

  // Gestión de especialidades (admin)
  async createEspecialidad(data) {
    try {
      const response = await api.post('/especialidades', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al crear especialidad:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al crear especialidad' 
      };
    }
  },

  async updateEspecialidad(id, data) {
    try {
      const response = await api.put(`/especialidades/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar especialidad:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar especialidad' 
      };
    }
  },

  async deleteEspecialidad(id) {
    try {
      const response = await api.delete(`/especialidades/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al eliminar especialidad:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al eliminar especialidad' 
      };
    }
  },

  // Gestión de especialidades (para todos los usuarios)
  async createEspecialidadPublic(data) {
    try {
      const response = await api.post('/especialidades', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al crear especialidad:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al crear especialidad' 
      };
    }
  },

  async updateEspecialidadPublic(id, data) {
    try {
      const response = await api.put(`/especialidades/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar especialidad:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar especialidad' 
      };
    }
  },

  async deleteEspecialidadPublic(id) {
    try {
      const response = await api.delete(`/especialidades/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al eliminar especialidad:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al eliminar especialidad' 
      };
    }
  },

  // Gestión de EPS (admin)
  async createEps(data) {
    try {
      const response = await api.post('/eps', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al crear EPS:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al crear EPS' 
      };
    }
  },

  async updateEps(id, data) {
    try {
      const response = await api.put(`/eps/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar EPS:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar EPS' 
      };
    }
  },

  async deleteEps(id) {
    try {
      const response = await api.delete(`/eps/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al eliminar EPS:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al eliminar EPS' 
      };
    }
  },

  // Gestión de pacientes (admin) - Now using public routes for authenticated users
  async createPaciente(data) {
    try {
      const response = await api.post('/pacientes', data); // Changed from /admin/pacientes
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al crear paciente:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al crear paciente' 
      };
    }
  },

  async updatePaciente(id, data) {
    try {
      const response = await api.put(`/pacientes/${id}`, data); // Changed from /admin/pacientes
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar paciente' 
      };
    }
  },

  async deletePaciente(id) {
    try {
      const response = await api.delete(`/pacientes/${id}`); // Changed from /admin/pacientes
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al eliminar paciente' 
      };
    }
  },

  // Gestión de consultorios (admin)
  async createConsultorio(data) {
    try {
      const response = await api.post('/admin/consultorios', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al crear consultorio:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al crear consultorio' 
      };
    }
  },

  async updateConsultorio(id, data) {
    try {
      const response = await api.put(`/admin/consultorios/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar consultorio:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar consultorio' 
      };
    }
  },

  async deleteConsultorio(id) {
    try {
      const response = await api.delete(`/admin/consultorios/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al eliminar consultorio:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al eliminar consultorio' 
      };
    }
  },

  // Gestión de citas (admin)
  async getCitas() {
    try {
      const response = await api.get('/admin/citas');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener citas:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener citas' 
      };
    }
  },

  async createCita(data) {
    try {
      const response = await api.post('/admin/citas', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al crear cita:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al crear cita' 
      };
    }
  },

  async updateCita(id, data) {
    try {
      const response = await api.put(`/admin/citas/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar cita' 
      };
    }
  },

  async deleteCita(id) {
    try {
      const response = await api.delete(`/admin/citas/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al eliminar cita' 
      };
    }
  }
};

// Servicio para perfil de usuario
export const profileService = {
  // Obtener perfil del usuario actual
  async getProfile() {
    try {
      const response = await api.get('/me');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener perfil' 
      };
    }
  },

  // Actualizar perfil del usuario (paciente)
  async updateProfilePaciente(data) {
    try {
      const response = await api.put('/paciente/profile', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar perfil de paciente:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar perfil de paciente' 
      };
    }
  },

  // Actualizar perfil del usuario (médico)
  async updateProfileMedico(data) {
    try {
      const response = await api.put('/medico/profile', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar perfil de médico:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar perfil de médico' 
      };
    }
  },

  // Actualizar perfil del usuario - usar endpoint correcto según el rol
  async updateProfile(data) {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      console.log('userDataString:', userDataString);
      
      if (!userDataString) {
        console.log('No hay datos de usuario en AsyncStorage, usando datos por defecto');
        const defaultUserData = { tipo: 'medico', id: 1 };
        const endpoint = '/profile/update';
        console.log('Usando endpoint por defecto:', endpoint);
        const response = await api.put(endpoint, {
          ...data,
          user_id: defaultUserData.id,
          user_type: defaultUserData.tipo
        });
        return { success: true, data: response.data };
      }
      
      const userData = JSON.parse(userDataString);
      console.log('Datos del usuario:', userData);
      
      // Usar el nuevo endpoint que funciona para todos
      const endpoint = '/profile/update';
      
      console.log('Actualizando perfil en endpoint:', endpoint);
      console.log('Datos a enviar:', data);
      console.log('Token actual:', await AsyncStorage.getItem('userToken'));
      
      const response = await api.put(endpoint, {
        ...data,
        user_id: userData.id,
        user_type: userData.tipo || userData.role || 'paciente'
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar perfil' 
      };
    }
  },

  // Logout
  async logout() {
    try {
      const response = await api.post('/logout');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al cerrar sesión' 
      };
    }
  }
};

// Servicio específico para citas con funcionalidades adicionales
export const citasAdvancedService = {
  // Obtener citas por médico
  async getByMedico(medicoId) {
    try {
      const response = await api.get(`/citas/medico/${medicoId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener citas por médico:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener citas del médico' 
      };
    }
  },

  // Obtener citas por paciente
  async getByPaciente(pacienteId) {
    try {
      const response = await api.get(`/citas/paciente/${pacienteId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener citas por paciente:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener citas del paciente' 
      };
    }
  },

  // Confirmar cita
  async confirmarCita(id) {
    try {
      const response = await api.put(`/citas/${id}/confirmar`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al confirmar cita:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al confirmar cita' 
      };
    }
  },

  // Cancelar cita
  async cancelarCita(id) {
    try {
      const response = await api.put(`/citas/${id}/cancelar`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al cancelar cita' 
      };
    }
  }
};

