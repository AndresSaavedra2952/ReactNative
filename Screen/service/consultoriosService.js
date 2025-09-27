import api from '../../src/service/conexion';

export const consultoriosService = {
  // Obtener todos los consultorios
  async getAll() {
    try {
      const response = await api.get('/consultorios');
      return response.data;
    } catch (error) {
      console.error('Error al obtener consultorios:', error);
      return {
        success: false,
        message: 'Error al obtener consultorios',
        data: []
      };
    }
  },

  // Obtener un consultorio por ID
  async getById(id) {
    try {
      const response = await api.get(`/consultorios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener consultorio:', error);
      return {
        success: false,
        message: 'Error al obtener consultorio'
      };
    }
  },

  // Crear un nuevo consultorio
  async create(consultorioData) {
    try {
      const response = await api.post('/consultorios', consultorioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear consultorio:', error);
      return {
        success: false,
        message: 'Error al crear consultorio'
      };
    }
  },

  // Actualizar un consultorio
  async update(id, consultorioData) {
    try {
      const response = await api.put(`/consultorios/${id}`, consultorioData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar consultorio:', error);
      return {
        success: false,
        message: 'Error al actualizar consultorio'
      };
    }
  },

  // Eliminar un consultorio
  async delete(id) {
    try {
      const response = await api.delete(`/consultorios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar consultorio:', error);
      return {
        success: false,
        message: 'Error al eliminar consultorio'
      };
    }
  }
};
