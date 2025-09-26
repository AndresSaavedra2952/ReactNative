import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
import { AuthProvider, useAuth } from "./src/context/AuthContext";

// Components
import LoadingScreen from "./src/components/LoadingScreen";

// Screens
import InicioScreen from "./Screen/Inicio/InicioScreen";
import LoginScreen from "./Screen/Auth/login";
import RegisterScreen from "./Screen/Auth/Register";
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

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
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
        {isAuthenticated ? (
          // Pantallas autenticadas
          <>
            <Stack.Screen name="Dashboard" component={DashboardRouter} />
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
          </>
        ) : (
          // Pantallas públicas
          <>
            <Stack.Screen name="Inicio" component={InicioScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
