import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListarMedicos from "../Screen/Medico/listarMedico";
import EditarMedico from "../Screen/Medico/editarMedico";
import DetalleMedico from "../Screen/Medico/detalleMedico";

const Stack = createNativeStackNavigator();

const MedicosStack = () => {
    return (
        <Stack.Navigator initialRouteName="ListarMedicos">
            <Stack.Screen
                name="ListarMedicos"
                component={ListarMedicos}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DetalleMedico"
                component={DetalleMedico}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditarMedico"
                component={EditarMedico}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default MedicosStack;