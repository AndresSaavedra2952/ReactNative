import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListarEps from "../Screen/Eps/listarEps";
import DetalleEps from "../Screen/Eps/detalleEps";
import EditarEps from "../Screen/Eps/editarEps";

const Stack = createNativeStackNavigator();

export default function EpsStack() {
  return (
    <Stack.Navigator initialRouteName="ListarEps">
      <Stack.Screen
        name="ListarEps"
        component={ListarEps}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetalleEps"
        component={DetalleEps}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditarEps"
        component={EditarEps}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
