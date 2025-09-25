import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../Screen/Auth/login';
import RegisterScreen from '../../Screen/Auth/Register';

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>

    );

}