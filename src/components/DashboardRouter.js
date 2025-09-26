import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

// Dashboards
import AdminDashboard from "../../Screen/Dashboard/AdminDashboard";
import MedicoDashboard from "../../Screen/Dashboard/MedicoDashboard";
import PacienteDashboard from "../../Screen/Dashboard/PacienteDashboard";

// Screens del sistema
import CitasScreen from "../../Screen/Citas/CitasScreen";
import PacientesScreen from "../../Screen/Pacientes/PacientesScreen";
import MedicosScreen from "../../Screen/Medicos/MedicosScreen";
import EspecialidadesScreen from "../../Screen/Especialidades/EspecialidadesScreen";
import ConsultoriosScreen from "../../Screen/Consultorios/ConsultoriosScreen";
import EpsScreen from "../../Screen/Eps/EpsScreen";
import PerfilScreen from "../../Screen/Perfil/PerfilScreen";

const Stack = createNativeStackNavigator();

export default function DashboardRouter() {
  const { userType } = useAuth();

  // Función para obtener el dashboard según el tipo de usuario
  const getDashboardComponent = () => {
    switch (userType) {
      case 'admin':
        return AdminDashboard;
      case 'medico':
        return MedicoDashboard;
      case 'paciente':
        return PacienteDashboard;
      default:
        return PacienteDashboard; // Por defecto
    }
  };

  const DashboardComponent = getDashboardComponent();

  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false
      }}
    >
      {/* Dashboard principal según el tipo de usuario */}
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardComponent}
        options={{
          title: userType === 'admin' ? 'Panel Admin' : 
                 userType === 'medico' ? 'Panel Médico' : 'Panel Paciente'
        }}
      />

      {/* Pantallas comunes para todos los usuarios */}
      <Stack.Screen 
        name="Citas" 
        component={CitasScreen}
        options={{ title: "Citas Médicas" }}
      />
      
      <Stack.Screen 
        name="Pacientes" 
        component={PacientesScreen}
        options={{ title: "Pacientes" }}
      />
      
      <Stack.Screen 
        name="Medicos" 
        component={MedicosScreen}
        options={{ title: "Médicos" }}
      />
      
      <Stack.Screen 
        name="Especialidades" 
        component={EspecialidadesScreen}
        options={{ title: "Especialidades" }}
      />
      
      <Stack.Screen 
        name="Consultorios" 
        component={ConsultoriosScreen}
        options={{ title: "Consultorios" }}
      />
      
      <Stack.Screen 
        name="Eps" 
        component={EpsScreen}
        options={{ title: "EPS" }}
      />
      
      <Stack.Screen 
        name="Perfil" 
        component={PerfilScreen}
        options={{ title: "Mi Perfil" }}
      />

      {/* Pantallas específicas para médicos */}
      {userType === 'medico' && (
        <>
          <Stack.Screen 
            name="MisCitas" 
            component={CitasScreen}
            options={{ title: "Mis Citas" }}
          />
          <Stack.Screen 
            name="MisPacientes" 
            component={PacientesScreen}
            options={{ title: "Mis Pacientes" }}
          />
          <Stack.Screen 
            name="Agenda" 
            component={CitasScreen}
            options={{ title: "Mi Agenda" }}
          />
          <Stack.Screen 
            name="MiConsultorio" 
            component={ConsultoriosScreen}
            options={{ title: "Mi Consultorio" }}
          />
          <Stack.Screen 
            name="Reportes" 
            component={CitasScreen}
            options={{ title: "Reportes" }}
          />
        </>
      )}

      {/* Pantallas específicas para pacientes */}
      {userType === 'paciente' && (
        <>
          <Stack.Screen 
            name="AgendarCita" 
            component={CitasScreen}
            options={{ title: "Agendar Cita" }}
          />
          <Stack.Screen 
            name="MisCitas" 
            component={CitasScreen}
            options={{ title: "Mis Citas" }}
          />
          <Stack.Screen 
            name="Historial" 
            component={CitasScreen}
            options={{ title: "Historial Médico" }}
          />
          <Stack.Screen 
            name="Emergencias" 
            component={CitasScreen}
            options={{ title: "Emergencias" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}