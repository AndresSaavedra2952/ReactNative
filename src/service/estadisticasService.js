import api from './conexion';

export const estadisticasService = {
  // Obtener estadísticas generales del sistema
  getEstadisticas: async () => {
    try {
      const response = await api.get('/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  // Obtener estadísticas específicas por entidad
  getEstadisticasMedicos: async () => {
    try {
      const response = await api.get('/medicos');
      if (response.data.success) {
        const medicos = response.data.data || [];
        return {
          total: medicos.length,
          activos: medicos.filter(m => m.activo === 1 || m.activo === true).length,
          inactivos: medicos.filter(m => m.activo === 0 || m.activo === false).length
        };
      }
      return { total: 0, activos: 0, inactivos: 0 };
    } catch (error) {
      console.error('Error al obtener estadísticas de médicos:', error);
      return { total: 0, activos: 0, inactivos: 0 };
    }
  },

  getEstadisticasPacientes: async () => {
    try {
      const response = await api.get('/pacientes');
      if (response.data.success) {
        const pacientes = response.data.data || [];
        return {
          total: pacientes.length,
          activos: pacientes.filter(p => p.activo === 1 || p.activo === true).length,
          inactivos: pacientes.filter(p => p.activo === 0 || p.activo === false).length
        };
      }
      return { total: 0, activos: 0, inactivos: 0 };
    } catch (error) {
      console.error('Error al obtener estadísticas de pacientes:', error);
      return { total: 0, activos: 0, inactivos: 0 };
    }
  },

  getEstadisticasCitas: async () => {
    try {
      const response = await api.get('/citas');
      if (response.data.success) {
        const citas = response.data.data || [];
        const hoy = new Date().toISOString().split('T')[0];
        
        return {
          total: citas.length,
          hoy: citas.filter(c => c.fecha === hoy).length,
          pendientes: citas.filter(c => c.estado === 'pendiente').length,
          confirmadas: citas.filter(c => c.estado === 'confirmada').length,
          completadas: citas.filter(c => c.estado === 'completada').length,
          canceladas: citas.filter(c => c.estado === 'cancelada').length
        };
      }
      return { total: 0, hoy: 0, pendientes: 0, confirmadas: 0, completadas: 0, canceladas: 0 };
    } catch (error) {
      console.error('Error al obtener estadísticas de citas:', error);
      return { total: 0, hoy: 0, pendientes: 0, confirmadas: 0, completadas: 0, canceladas: 0 };
    }
  },

  getEstadisticasConsultorios: async () => {
    try {
      const response = await api.get('/consultorios');
      if (response.data.success) {
        const consultorios = response.data.data || [];
        return {
          total: consultorios.length,
          disponibles: consultorios.filter(c => c.activo === 1 || c.activo === true).length,
          ocupados: consultorios.filter(c => c.activo === 0 || c.activo === false).length
        };
      }
      return { total: 0, disponibles: 0, ocupados: 0 };
    } catch (error) {
      console.error('Error al obtener estadísticas de consultorios:', error);
      return { total: 0, disponibles: 0, ocupados: 0 };
    }
  },

  getEstadisticasEspecialidades: async () => {
    try {
      const response = await api.get('/especialidades');
      if (response.data.success) {
        const especialidades = response.data.data || [];
        return {
          total: especialidades.length
        };
      }
      return { total: 0 };
    } catch (error) {
      console.error('Error al obtener estadísticas de especialidades:', error);
      return { total: 0 };
    }
  },

  getEstadisticasEps: async () => {
    try {
      const response = await api.get('/eps');
      if (response.data.success) {
        const eps = response.data.data || [];
        return {
          total: eps.length,
          activas: eps.filter(e => e.activo === 1 || e.activo === true).length,
          inactivas: eps.filter(e => e.activo === 0 || e.activo === false).length
        };
      }
      return { total: 0, activas: 0, inactivas: 0 };
    } catch (error) {
      console.error('Error al obtener estadísticas de EPS:', error);
      return { total: 0, activas: 0, inactivas: 0 };
    }
  }
};
