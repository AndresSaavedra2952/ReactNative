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

export default function ListarMedicos({ navigation }) {
  const [medicos, setMedicos] = useState([
    { id: '1', nombre: 'Dr. Carlos Mendoza', especialidad: 'Cardiología', telefono: '300-123-4567' },
    { id: '2', nombre: 'Dra. Ana García', especialidad: 'Pediatría', telefono: '300-234-5678' },
    { id: '3', nombre: 'Dr. Luis Rodríguez', especialidad: 'Dermatología', telefono: '300-345-6789' },
  ]);

  const renderMedico = ({ item }) => (
    <TouchableOpacity 
      style={styles.medicoCard}
      onPress={() => navigation.navigate('DetalleMedico', { medico: item })}
    >
      <View style={styles.medicoInfo}>
        <Text style={styles.medicoNombre}>{item.nombre}</Text>
        <Text style={styles.medicoEspecialidad}>{item.especialidad}</Text>
        <Text style={styles.medicoTelefono}>{item.telefono}</Text>
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
        <Text style={styles.headerTitle}>Médicos</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={medicos}
        renderItem={renderMedico}
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
  medicoCard: {
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
  medicoInfo: {
    flex: 1,
  },
  medicoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  medicoEspecialidad: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 3,
  },
  medicoTelefono: {
    fontSize: 12,
    color: '#666',
  },
});
