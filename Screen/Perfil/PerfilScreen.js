import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../src/context/AuthContext";

export default function PerfilScreen({ navigation }) {
    const { logout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (userDataString) {
                const parsedUserData = JSON.parse(userDataString);
                setUserData(parsedUserData);
            }
        } catch (error) {
            console.error("Error al cargar datos del usuario:", error);
            Alert.alert("Error", "No se pudieron cargar los datos del usuario");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres cerrar sesión?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Cerrar Sesión",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout();
                            // No navegar manualmente, el AuthContext maneja la navegación
                        } catch (error) {
                            console.error("Error al cerrar sesión:", error);
                            Alert.alert("Error", "Error al cerrar sesión");
                        }
                    }
                }
            ]
        );
    };

    const handleDebugAuth = async () => {
        Alert.alert(
            "Debug Auth",
            "Selecciona el tipo de usuario para probar:",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Admin", 
                    onPress: async () => {
                        await AsyncStorage.setItem('userData', JSON.stringify({
                            id: 1,
                            nombre: 'Admin',
                            apellido: 'Sistema',
                            email: 'admin@test.com',
                            tipo: 'admin'
                        }));
                        await AsyncStorage.setItem('userToken', 'admin_token_1');
                        Alert.alert("Debug", "Cambiado a Admin. Recarga la app para ver el cambio.");
                    }
                },
                { 
                    text: "Médico", 
                    onPress: async () => {
                        await AsyncStorage.setItem('userData', JSON.stringify({
                            id: 1,
                            nombre: 'Dr. Juan',
                            apellido: 'Pérez',
                            email: 'medico@test.com',
                            tipo: 'medico'
                        }));
                        await AsyncStorage.setItem('userToken', 'medico_token_1');
                        Alert.alert("Debug", "Cambiado a Médico. Recarga la app para ver el cambio.");
                    }
                },
                { 
                    text: "Paciente", 
                    onPress: async () => {
                        await AsyncStorage.setItem('userData', JSON.stringify({
                            id: 1,
                            nombre: 'María',
                            apellido: 'García',
                            email: 'paciente@test.com',
                            tipo: 'paciente'
                        }));
                        await AsyncStorage.setItem('userToken', 'paciente_token_1');
                        Alert.alert("Debug", "Cambiado a Paciente. Recarga la app para ver el cambio.");
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007aff" />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={["#e0f7ff", "#f9fbfd"]} style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1976D2" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Mi Perfil</Text>
                </View>

                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={80} color="#007aff" />
                    </View>
                    
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userData?.nombre || userData?.name || "Usuario"}</Text>
                        <Text style={styles.userEmail}>{userData?.email || "No disponible"}</Text>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>
                                {userData?.tipo === 'admin' ? 'Administrador' : 
                                 userData?.tipo === 'medico' ? 'Médico' : 
                                 userData?.role === 'admin' ? 'Administrador' : 
                                 userData?.role === 'medico' ? 'Médico' : 'Paciente'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('EditarPerfil')}
                    >
                        <Ionicons name="person-outline" size={24} color="#007aff" />
                        <Text style={styles.menuText}>Editar Perfil</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('CambiarContraseña')}
                    >
                        <Ionicons name="lock-closed-outline" size={24} color="#007aff" />
                        <Text style={styles.menuText}>Cambiar Contraseña</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="notifications-outline" size={24} color="#007aff" />
                        <Text style={styles.menuText}>Notificaciones</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="help-circle-outline" size={24} color="#007aff" />
                        <Text style={styles.menuText}>Ayuda y Soporte</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>

                    {/* Botones de debug - comentados para producción */}
                    {/* 
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={async () => {
                            const authData = await debugAuth();
                            Alert.alert(
                                "Debug Autenticación", 
                                `Token: ${authData.token ? 'Presente' : 'Ausente'}\nRol: ${authData.userData?.role || 'N/A'}\nEmail: ${authData.userData?.email || 'N/A'}`
                            );
                        }}
                    >
                        <Ionicons name="bug-outline" size={24} color="#ff9800" />
                        <Text style={styles.menuText}>Debug Auth</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={async () => {
                            const result = await testApiConnection();
                            Alert.alert(
                                "Test API", 
                                result.success ? "✅ Conexión exitosa" : `❌ ${result.message}`
                            );
                        }}
                    >
                        <Ionicons name="wifi-outline" size={24} color="#4caf50" />
                        <Text style={styles.menuText}>Test API</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={async () => {
                            const result = await forceLogin('car@hotmail.com', '123456');
                            if (result.success) {
                                Alert.alert("✅ Force Login", "Datos de autenticación creados correctamente");
                                loadUserData();
                            } else {
                                Alert.alert("❌ Error", result.message);
                            }
                        }}
                    >
                        <Ionicons name="refresh-outline" size={24} color="#ff5722" />
                        <Text style={styles.menuText}>Force Login</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>
                    */}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fbfd',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1976D2',
        marginLeft: 15,
    },
    profileCard: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    userInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1976D2',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    roleBadge: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
    roleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1976D2',
    },
    menuSection: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        marginHorizontal: 20,
        marginBottom: 30,
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

