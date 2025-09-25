import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListarEspecialidad from "../Screen/Especialidad/listarEspecialidad";
import DetalleEspecialidad from "../Screen/Especialidad/detalleEspecialidad";
import EditarEspecialidad from "../Screen/Especialidad/editarEspecialidad";

const Stack = createNativeStackNavigator();

export default function EspecialidadStack() {
  return (
    <Stack.Navigator initialRouteName="ListarEspecialidad">
      <Stack.Screen
        name="ListarEspecialidad"
        component={ListarEspecialidad}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetalleEspecialidad"
        component={DetalleEspecialidad}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditarEspecialidad"
        component={EditarEspecialidad}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
