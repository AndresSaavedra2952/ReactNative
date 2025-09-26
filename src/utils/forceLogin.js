import AsyncStorage from '@react-native-async-storage/async-storage';

export const forceLogin = async (email, password) => {
  try {
    console.log('=== FORCE LOGIN ===');
    
    // Limpiar datos anteriores
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    
    // Simular datos de login (para testing)
    const mockUserData = {
      id: 1,
      email: email,
      role: 'medico', // o 'paciente' según necesites
      name: 'Carlos Saavedra',
      token: 'mock_token_' + Date.now()
    };
    
    const mockToken = mockUserData.token;
    
    // Guardar datos
    await AsyncStorage.setItem('userToken', mockToken);
    await AsyncStorage.setItem('userData', JSON.stringify(mockUserData));
    
    console.log('Datos guardados en Force Login:');
    console.log('Token:', mockToken);
    console.log('UserData:', mockUserData);
    
    return { success: true, token: mockToken, user: mockUserData };
  } catch (error) {
    console.error('Error en force login:', error);
    return { success: false, message: error.message };
  }
};

