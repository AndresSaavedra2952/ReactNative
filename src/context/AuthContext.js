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
      
      if (token && userData) {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setUserType(parsedUserData.tipo);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Intentar login en todas las tablas para detectar el tipo de usuario
      const loginPromises = [
        api.post('/login', { email, password, tipo: 'admin' }),
        api.post('/login', { email, password, tipo: 'medico' }),
        api.post('/login', { email, password, tipo: 'paciente' })
      ];

      const results = await Promise.allSettled(loginPromises);
      
      // Buscar el primer login exitoso
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === 'fulfilled' && result.value.data.success) {
          const { user: userData, token, tipo: userTipo } = result.value.data.data;
          
          console.log('Login exitoso:', { userTipo, userData });
          
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

          return {
            success: true,
            user: { ...userData, tipo: userTipo },
            tipo: userTipo
          };
        }
      }

      // Si ningún login fue exitoso
      return {
        success: false,
        message: 'Credenciales inválidas'
      };

    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  };

  const logout = async () => {
    try {
      // Llamar al endpoint de logout si hay token
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        await api.post('/logout');
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar datos locales
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      // Limpiar estado
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    userType,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
