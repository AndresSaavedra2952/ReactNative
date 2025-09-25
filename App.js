import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import InicioScreen from "./Screen/Inicio/InicioScreen";
import LoginScreen from "./Screen/Auth/login";
import TipoUsuarioScreen from "./Screen/Auth/TipoUsuario";
import RegisterPacienteScreen from "./Screen/Auth/RegisterPaciente";
import RegisterMedicoScreen from "./Screen/Auth/RegisterMedico";
import DashboardRouter from "./src/components/DashboardRouter";

// Stack Screens
import CitasScreen from "./Screen/Citas/CitasScreen";
import CrearCitaScreen from "./Screen/Citas/CrearCita";
import PacientesScreen from "./Screen/Pacientes/PacientesScreen";
import MedicosScreen from "./Screen/Medicos/MedicosScreen";
import EspecialidadesScreen from "./Screen/Especialidades/EspecialidadesScreen";
import ConsultoriosScreen from "./Screen/Consultorios/ConsultoriosScreen";
import EpsScreen from "./Screen/Eps/EpsScreen";
import PerfilScreen from "./Screen/Perfil/PerfilScreen";
import EditarPerfilScreen from "./Screen/Perfil/EditarPerfil";
import CambiarContraseñaScreen from "./Screen/Perfil/CambiarContraseña";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
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
        setIsAuthenticated(true);
        setUserRole(parsedUserData.role);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // O un componente de loading
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName={isAuthenticated ? "Dashboard" : "Inicio"}
        screenOptions={{
          headerShown: false
        }}
      >
        {/* Pantallas públicas */}
        <Stack.Screen name="Inicio" component={InicioScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="TipoUsuario" component={TipoUsuarioScreen} />
        <Stack.Screen name="RegisterPaciente" component={RegisterPacienteScreen} />
        <Stack.Screen name="RegisterMedico" component={RegisterMedicoScreen} />
        
        {/* Dashboard principal */}
        <Stack.Screen name="Dashboard" component={DashboardRouter} />
        
        {/* Pantallas del sistema */}
        <Stack.Screen name="Citas" component={CitasScreen} />
        <Stack.Screen name="CrearCita" component={CrearCitaScreen} />
        <Stack.Screen name="Pacientes" component={PacientesScreen} />
        <Stack.Screen name="Medicos" component={MedicosScreen} />
        <Stack.Screen name="Especialidades" component={EspecialidadesScreen} />
        <Stack.Screen name="Consultorios" component={ConsultoriosScreen} />
        <Stack.Screen name="Eps" component={EpsScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
        <Stack.Screen name="CambiarContraseña" component={CambiarContraseñaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
