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
import AdministradoresScreen from "../../Screen/Administradores/AdministradoresScreen";
import EpsScreen from "../../Screen/Eps/EpsScreen";
import PerfilScreen from "../../Screen/Perfil/PerfilScreen";

// Screens específicas para médicos
import MisCitasMedico from "../../Screen/Medico/MisCitasMedico";
import MiAgendaMedico from "../../Screen/Medico/MiAgendaMedico";
import ReportesMedico from "../../Screen/Medico/ReportesMedico";
import HistorialMedico from "../../Screen/Medico/HistorialMedico";

// Screens específicas para pacientes
import AgendarCitaPaciente from "../../Screen/Paciente/AgendarCitaPaciente";
import MisCitasPaciente from "../../Screen/Paciente/MisCitasPaciente";
import HistorialPaciente from "../../Screen/Paciente/HistorialPaciente";

const Stack = createNativeStackNavigator();

export default function DashboardRouter() {
  const { userType, user } = useAuth();

  console.log('DashboardRouter - userType:', userType);
  console.log('DashboardRouter - user:', user);

  // Función para obtener el dashboard según el tipo de usuario
  const getDashboardComponent = () => {
    console.log('getDashboardComponent - userType:', userType);
    switch (userType) {
      case 'admin':
        console.log('Retornando AdminDashboard');
        return AdminDashboard;
      case 'medico':
        console.log('Retornando MedicoDashboard');
        return MedicoDashboard;
      case 'paciente':
        console.log('Retornando PacienteDashboard');
        return PacienteDashboard;
      default:
        console.log('Retornando PacienteDashboard por defecto');
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
        name="Administradores" 
        component={AdministradoresScreen}
        options={{ title: "Administradores" }}
      />
      
      {/* Rutas específicas para médicos */}
      <Stack.Screen 
        name="MisCitas" 
        component={userType === 'medico' ? MisCitasMedico : MisCitasPaciente}
        options={{ title: "Mis Citas" }}
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
            name="MisCitasMedico" 
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
            component={MiAgendaMedico}
            options={{ title: "Mi Agenda" }}
          />
          <Stack.Screen 
            name="MiConsultorio" 
            component={ConsultoriosScreen}
            options={{ title: "Mi Consultorio" }}
          />
          <Stack.Screen 
            name="Reportes" 
            component={ReportesMedico}
            options={{ title: "Reportes" }}
          />
          <Stack.Screen 
            name="HistorialMedico" 
            component={HistorialMedico}
            options={{ title: "Historial Médico" }}
          />
        </>
      )}

      {/* Pantallas específicas para pacientes */}
      {userType === 'paciente' && (
        <>
          <Stack.Screen 
            name="AgendarCita" 
            component={AgendarCitaPaciente}
            options={{ title: "Agendar Cita" }}
          />
          <Stack.Screen 
            name="MisCitasPaciente" 
            component={CitasScreen}
            options={{ title: "Mis Citas" }}
          />
          <Stack.Screen 
            name="Historial" 
            component={HistorialPaciente}
            options={{ title: "Mi Historial Médico" }}
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