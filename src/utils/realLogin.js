import { loginUser } from '../service/AuthService';

export const realLogin = async (email, password) => {
  try {
    console.log('=== REAL LOGIN ===');
    console.log('Email:', email);
    console.log('Password:', password);
    
    const result = await loginUser(email, password);
    
    console.log('Login result:', result);
    
    return result;
  } catch (error) {
    console.error('Error en real login:', error);
    return { 
      success: false, 
      message: error.message || 'Error inesperado en el login' 
    };
  }
};

