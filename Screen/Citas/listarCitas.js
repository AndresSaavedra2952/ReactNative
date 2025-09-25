import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const listarCitas = () => {
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        // Simulación de carga de citas
        const citasEjemplo = [
            { id: '1', paciente: 'Juan Pérez', fecha: '2024-06-10' },
            { id: '2', paciente: 'Ana Gómez', fecha: '2024-06-11' },
        ];
        setCitas(citasEjemplo);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text>Paciente: {item.paciente}</Text>
            <Text>Fecha: {item.fecha}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Listado de Citas</Text>
            <FlatList
                data={citas}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    item: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
});

export default listarCitas;