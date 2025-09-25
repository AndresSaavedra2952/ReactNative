import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ListarEspecialidad({ navigation }) {
  const [especialidades, setEspecialidades] = useState([
    { id: '1', nombre: 'Cardiología', descripcion: 'Especialidad en enfermedades del corazón' },
    { id: '2', nombre: 'Pediatría', descripcion: 'Especialidad en medicina infantil' },
    { id: '3', nombre: 'Dermatología', descripcion: 'Especialidad en enfermedades de la piel' },
    { id: '4', nombre: 'Neurología', descripcion: 'Especialidad en enfermedades del sistema nervioso' },
  ]);

  const renderEspecialidad = ({ item }) => (
    <TouchableOpacity 
      style={styles.especialidadCard}
      onPress={() => navigation.navigate('DetalleEspecialidad', { especialidad: item })}
    >
      <View style={styles.especialidadInfo}>
        <Text style={styles.especialidadNombre}>{item.nombre}</Text>
        <Text style={styles.especialidadDescripcion}>{item.descripcion}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Especialidades</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={especialidades}
        renderItem={renderEspecialidad}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    padding: 20,
  },
  especialidadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  especialidadInfo: {
    flex: 1,
  },
  especialidadNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  especialidadDescripcion: {
    fontSize: 14,
    color: '#666',
  },
});
