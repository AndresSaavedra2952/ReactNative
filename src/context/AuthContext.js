import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../service/conexion';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      console.log('checkAuthStatus - token:', token ? 'existe' : 'no existe');
      console.log('checkAuthStatus - userData:', userData);
      
      if (token && userData) {
        const parsedUserData = JSON.parse(userData);
        console.log('checkAuthStatus - parsedUserData:', parsedUserData);
        console.log('checkAuthStatus - tipo:', parsedUserData.tipo);
        
        setUser(parsedUserData);
        setUserType(parsedUserData.tipo);
        setIsAuthenticated(true);
        
        console.log('checkAuthStatus - Estado actualizado:', {
          user: parsedUserData,
          userType: parsedUserData.tipo,
          isAuthenticated: true
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Iniciando login para:', email);
      
      // Intentar login secuencialmente para detectar el tipo de usuario
      const loginAttempts = [
        { tipo: 'admin', endpoint: '/login' },
        { tipo: 'medico', endpoint: '/login' },
        { tipo: 'paciente', endpoint: '/login' }
      ];

      for (const attempt of loginAttempts) {
        try {
          console.log(`Intentando login como ${attempt.tipo}...`);
          const response = await api.post(attempt.endpoint, { 
            email, 
            password, 
            tipo: attempt.tipo 
          });
          
          if (response.data.success) {
            console.log(`Login exitoso como ${attempt.tipo}:`, response.data);
            
            // Extraer datos del usuario de manera robusta
            const userData = response.data.data?.user || response.data.user;
            const token = response.data.data?.token || response.data.token;
            const userTipo = response.data.data?.tipo || response.data.tipo || attempt.tipo;
            
            console.log('Datos extraídos:', { userData, token, userTipo });
            
            if (userData && token) {
              // Guardar datos en AsyncStorage
              await AsyncStorage.setItem('userToken', token);
              await AsyncStorage.setItem('userData', JSON.stringify({
                ...userData,
                tipo: userTipo
              }));
              
              // Actualizar estado
              setUser({ ...userData, tipo: userTipo });
              setUserType(userTipo);
              setIsAuthenticated(true);
              
              console.log('Login completado exitosamente como:', userTipo);
              return { success: true, userType: userTipo };
            }
          }
        } catch (error) {
          console.log(`Login falló para ${attempt.tipo}:`, error.response?.status);
          // Continuar con el siguiente intento
        }
      }
      
      // Si llegamos aquí, ningún login fue exitoso
      throw new Error('Credenciales inválidas');
      
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Cerrando sesión...');
      
      // Limpiar AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      // Limpiar estado
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value = {
    user,
    userType,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};