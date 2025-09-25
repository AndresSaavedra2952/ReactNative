import { createNativeStackNavigator } from "@react-navigation/native-stack";
import listarConsultorio from "../Screen/Consultorios/listarConsultorio";
import DetalleConsultorio from "../Screen/Consultorios/detalleConsultorio";
import EditarConsultorio from "../Screen/Consultorios/editarConsultorio";

const Stack = createNativeStackNavigator();

export default function ConsultoriosStack() {
  return (
    <Stack.Navigator initialRouteName="ListarConsultorios">
      <Stack.Screen
        name="ListarConsultorios"
        component={listarConsultorio}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetalleConsultorio"
        component={DetalleConsultorio}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditarConsultorio"
        component={EditarConsultorio}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

