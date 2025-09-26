import api from './conexion';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para registrar usuario
export const registerUser = async (userData) => {
  try {
    console.log('Datos a enviar:', userData);
    
    // Mapear los datos del frontend al formato esperado por el backend 
    const mappedData = {
      name: userData.nombre,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.password_confirmation || userData.password,
      role: userData.rol || 'paciente' // Valor por defecto
    };

    console.log('Datos mapeados:', mappedData);

    const response = await api.post('/register', mappedData);
    
    if (response.data) {
      console.log('Respuesta del servidor:', response.data);
      
      // Guardar token y datos del usuario
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        data: response.data
      };
    }
    
    return {
      success: false,
      message: 'Error en la respuesta del servidor'
    };
    
  } catch (error) {
    console.error('Error en registerUser:', error);
    
    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message
      };
    }
    
    return {
      success: false,
      message: 'Error al registrar usuario'
    };
  }
};

// Función para iniciar sesión
export const loginUser = async (email, password) => {
  try {
    console.log('Intentando login con:', { email, password });
    
    const response = await api.post('/login', {
      email,
      password
    });
    
    if (response.data) {
      console.log('Login exitoso:', response.data);
      
      // Guardar token y datos del usuario
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        data: response.data
      };
    }
    
    return {
      success: false,
      message: 'Error en la respuesta del servidor'
    };
    
  } catch (error) {
    console.error('Error en loginUser:', error);
    
    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message
      };
    }
    
    return {
      success: false,
      message: 'Error al iniciar sesión'
    };
  }
};

// Función para cerrar sesión
export const logoutUser = async () => {
  try {
    // Limpiar datos locales
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    
    return {
      success: true,
      message: 'Sesión cerrada exitosamente'
    };
    
  } catch (error) {
    console.error('Error en logoutUser:', error);
    return {
      success: false,
      message: 'Error al cerrar sesión'
    };
  }
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    
    return {
      isAuthenticated: !!token,
      token,
      userData: userData ? JSON.parse(userData) : null
    };
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    return {
      isAuthenticated: false,
      token: null,
      userData: null
    };
  }
};


