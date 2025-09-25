import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PacienteDashboard from '../../Screen/Dashboard/PacienteDashboard';
import MedicoDashboard from '../../Screen/Dashboard/MedicoDashboard';
import AdminDashboard from '../../Screen/Dashboard/AdminDashboard';

export default function DashboardRouter({ navigation }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserRole(parsedData.role);
      } else {
        // Si no hay datos de usuario, redirigir al login
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error cargando rol de usuario:', error);
      navigation.navigate('Login');
    } finally    {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={{ marginTop: 10, fontSize: 16, color: '#666' }}>
          Cargando dashboard...
        </Text>
      </View>
    );
  }

  // Renderizar el dashboard según el rol del usuario
  switch (userRole) {
    case 'paciente':
      return <PacienteDashboard navigation={navigation} />;
    case 'medico':
      return <MedicoDashboard navigation={navigation} />;
    case 'admin':
      return <AdminDashboard navigation={navigation} />;
    default:
      // Si el rol no es válido, redirigir al login
      navigation.navigate('Login');
      return null;
  }
}

