import { administradoresService as baseService } from './ApiService';

export const administradoresService = {
  // Obtener todos los administradores
  getAll: async () => {
    return await baseService.getAll();
  },

  // Obtener un administrador por ID
  getById: async (id) => {
    return await baseService.getById(id);
  },

  // Crear un nuevo administrador
  create: async (administradorData) => {
    return await baseService.create(administradorData);
  },

  // Actualizar un administrador
  update: async (id, administradorData) => {
    return await baseService.update(id, administradorData);
  },

  // Eliminar un administrador
  delete: async (id) => {
    return await baseService.delete(id);
  }
};
