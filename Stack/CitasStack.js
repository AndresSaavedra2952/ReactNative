import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListarCitas from "../Screen/Citas/listarCitas";
import DetalleCita from "../Screen/Citas/detalleCitas";
import EditarCita from "../Screen/Citas/editarCita";

const Stack = createNativeStackNavigator();

export default function CitasStack() {
  return (
    <Stack.Navigator initialRouteName="ListarCitas">
      <Stack.Screen
        name="ListarCitas"
        component={ListarCitas}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetalleCita"
        component={DetalleCita}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditarCita"
        component={EditarCita}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
