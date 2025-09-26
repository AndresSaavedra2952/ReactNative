import AsyncStorage from '@react-native-async-storage/async-storage';

export const debugAuth = async () => {
  try {
    console.log('=== DEBUG AUTENTICACIÓN ===');
    
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    
    console.log('Token:', token ? 'Presente' : 'Ausente');
    console.log('Token length:', token ? token.length : 0);
    console.log('Token value:', token);
    console.log('UserData:', userData ? 'Presente' : 'Ausente');
    
    if (userData) {
      const parsed = JSON.parse(userData);
      console.log('Rol del usuario:', parsed.role);
      console.log('Email del usuario:', parsed.email);
      console.log('Nombre del usuario:', parsed.name);
    }
    
    console.log('=== FIN DEBUG ===');
    
    return { token, userData: userData ? JSON.parse(userData) : null };
  } catch (error) {
    console.error('Error en debug auth:', error);
    return { token: null, userData: null };
  }
};

export const clearAuth = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    console.log('Datos de autenticación limpiados.');
  } catch (error) {
    console.error('Error al limpiar autenticación:', error);
  }
};

