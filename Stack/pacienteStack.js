import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListarPacientes from "../Screen/Paciente/listarPaciente";
import EditarPaciente from "../Screen/Paciente/editarPaciente";
import DetallePaciente from "../Screen/Paciente/detallePaciente";

const Stack = createNativeStackNavigator();

const PacienteStack = () => {
    return (
        <Stack.Navigator initialRouteName="ListarPacientes">
            <Stack.Screen
                name="ListarPacientes"
                component={ListarPacientes}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DetallePaciente"
                component={DetallePaciente}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditarPaciente"
                component={EditarPaciente}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default PacienteStack;