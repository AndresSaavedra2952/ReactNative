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

export default function ListarConsultorios({ navigation }) {
  const [consultorios, setConsultorios] = useState([
    { id: '1', nombre: 'Consultorio 1', ubicacion: 'Piso 2 - Oficina 201', capacidad: 4 },
    { id: '2', nombre: 'Consultorio 2', ubicacion: 'Piso 2 - Oficina 202', capacidad: 2 },
    { id: '3', nombre: 'Consultorio 3', ubicacion: 'Piso 3 - Oficina 301', capacidad: 6 },
  ]);

  const renderConsultorio = ({ item }) => (
    <TouchableOpacity 
      style={styles.consultorioCard}
      onPress={() => navigation.navigate('DetalleConsultorio', { consultorio: item })}
    >
      <View style={styles.consultorioInfo}>
        <Text style={styles.consultorioNombre}>{item.nombre}</Text>
        <Text style={styles.consultorioUbicacion}>{item.ubicacion}</Text>
        <Text style={styles.consultorioCapacidad}>Capacidad: {item.capacidad} personas</Text>
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
        <Text style={styles.headerTitle}>Consultorios</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={consultorios}
        renderItem={renderConsultorio}
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
  consultorioCard: {
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
  consultorioInfo: {
    flex: 1,
  },
  consultorioNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  consultorioUbicacion: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 3,
  },
  consultorioCapacidad: {
    fontSize: 12,
    color: '#666',
  },
});
