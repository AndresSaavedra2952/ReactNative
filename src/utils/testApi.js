import api from '../service/conexion';

export const testApiConnection = async () => {
  try {
    console.log('=== TEST API CONNECTION ===');
    
    const response = await api.get('/me');
    console.log('API Response:', response.data);
    
    return {
      success: true,
      message: 'Conexión exitosa',
      data: response.data
    };
  } catch (error) {
    console.error('Error en test API:', error);
    
    if (error.response) {
      return {
        success: false,
        message: `Error ${error.response.status}: ${error.response.data?.message || 'Error del servidor'}`
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'No se pudo conectar con el servidor'
      };
    } else {
      return {
        success: false,
        message: 'Error inesperado'
      };
    }
  }
};

