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

export default function ListarEps({ navigation }) {
  const [eps, setEps] = useState([
    { id: '1', nombre: 'Sura', telefono: '01-8000-123456', direccion: 'Calle 100 #15-20' },
    { id: '2', nombre: 'Nueva EPS', telefono: '01-8000-234567', direccion: 'Carrera 50 #25-30' },
    { id: '3', nombre: 'Sanitas', telefono: '01-8000-345678', direccion: 'Avenida 68 #40-50' },
    { id: '4', nombre: 'Compensar', telefono: '01-8000-456789', direccion: 'Calle 80 #60-70' },
  ]);

  const renderEps = ({ item }) => (
    <TouchableOpacity 
      style={styles.epsCard}
      onPress={() => navigation.navigate('DetalleEps', { eps: item })}
    >
      <View style={styles.epsInfo}>
        <Text style={styles.epsNombre}>{item.nombre}</Text>
        <Text style={styles.epsTelefono}>{item.telefono}</Text>
        <Text style={styles.epsDireccion}>{item.direccion}</Text>
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
        <Text style={styles.headerTitle}>EPS</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={eps}
        renderItem={renderEps}
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
  epsCard: {
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
  epsInfo: {
    flex: 1,
  },
  epsNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  epsTelefono: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 3,
  },
  epsDireccion: {
    fontSize: 12,
    color: '#666',
  },
});
