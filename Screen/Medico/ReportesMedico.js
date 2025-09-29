import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { medicoService } from '../../src/service/medicoService';

const { width } = Dimensions.get('window');

export default function ReportesMedico({ navigation }) {
  const { user } = useAuth();
  const [reportes, setReportes] = useState({
    citasTotal: 0,
    citasCompletadas: 0,
    citasCanceladas: 0,
    pacientesAtendidos: 0,
    especialidadMasComun: 'N/A',
    consultorioMasUsado: 'N/A',
    periodo: 'hoy',
    fechaInicio: '',
    fechaFin: ''
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState('hoy');

  useEffect(() => {
    loadReportes();
  }, [selectedPeriodo]);

  const loadReportes = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 ReportesMedico - Usuario actual:', user);
      console.log('🔍 ReportesMedico - Período seleccionado:', selectedPeriodo);
      
      // Obtener datos reales del backend
      const response = await medicoService.getReportes(selectedPeriodo);
      
      if (response.success) {
        console.log('📊 ReportesMedico - Datos obtenidos del backend:', response.data);
        setReportes(response.data);
      } else {
        console.error('❌ ReportesMedico - Error en respuesta:', response.message);
        Alert.alert('Error', response.message || 'Error al cargar los reportes');
      }
      
    } catch (error) {
      console.error('❌ ReportesMedico - Error al cargar reportes:', error);
      Alert.alert('Error', 'Error al cargar los reportes del servidor');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReportes();
    setRefreshing(false);
  };

  const getPeriodoText = () => {
    switch (selectedPeriodo) {
      case 'hoy': return 'Hoy';
      case 'semana': return 'Esta Semana';
      case 'mes': return 'Este Mes';
      default: return 'Hoy';
    }
  };

  const renderStatCard = (title, value, icon, color, subtitle = '') => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle ? <Text style={styles.statSubtitle}>{subtitle}</Text> : null}
    </View>
  );

  const renderPeriodoSelector = () => (
    <View style={styles.periodoSelector}>
      <Text style={styles.periodoTitle}>Período de Reporte</Text>
      <View style={styles.periodoButtons}>
        {['hoy', 'semana', 'mes'].map((periodo) => (
          <TouchableOpacity
            key={periodo}
            style={[
              styles.periodoButton,
              selectedPeriodo === periodo && styles.periodoButtonActive
            ]}
            onPress={() => setSelectedPeriodo(periodo)}
          >
            <Text style={[
              styles.periodoButtonText,
              selectedPeriodo === periodo && styles.periodoButtonTextActive
            ]}>
              {periodo === 'hoy' ? 'Hoy' : periodo === 'semana' ? 'Semana' : 'Mes'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderResumenSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📊 Resumen de Actividad</Text>
      <View style={styles.statsGrid}>
        {renderStatCard(
          'Citas Programadas',
          reportes.citasTotal,
          'calendar',
          '#007aff',
          getPeriodoText()
        )}
        {renderStatCard(
          'Pacientes Atendidos',
          reportes.pacientesAtendidos,
          'people',
          '#34c759',
          'Total'
        )}
        {renderStatCard(
          'Citas Completadas',
          reportes.citasCompletadas,
          'checkmark-circle',
          '#32d74b',
          'Éxito'
        )}
        {renderStatCard(
          'Citas Canceladas',
          reportes.citasCanceladas,
          'close-circle',
          '#ff3b30',
          'Canceladas'
        )}
      </View>
    </View>
  );

  const renderAnalisisSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📈 Análisis Detallado</Text>
      
      <View style={styles.analysisCard}>
        <View style={styles.analysisHeader}>
          <Ionicons name="trending-up" size={20} color="#007aff" />
          <Text style={styles.analysisTitle}>Especialidad Más Común</Text>
        </View>
        <Text style={styles.analysisValue}>{reportes.especialidadMasComun}</Text>
        <Text style={styles.analysisSubtitle}>Basado en citas atendidas</Text>
      </View>

      <View style={styles.analysisCard}>
        <View style={styles.analysisHeader}>
          <Ionicons name="location" size={20} color="#34c759" />
          <Text style={styles.analysisTitle}>Consultorio Más Usado</Text>
        </View>
        <Text style={styles.analysisValue}>{reportes.consultorioMasUsado}</Text>
        <Text style={styles.analysisSubtitle}>Mayor frecuencia de uso</Text>
      </View>
    </View>
  );

  const renderAccionesSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
      
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="download" size={24} color="#007aff" />
          <Text style={styles.actionText}>Exportar Reporte</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="mail" size={24} color="#34c759" />
          <Text style={styles.actionText}>Enviar por Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="print" size={24} color="#ff9500" />
          <Text style={styles.actionText}>Imprimir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="share" size={24} color="#af52de" />
          <Text style={styles.actionText}>Compartir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Generando reportes...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reportes</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadReportes}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#667eea"]}
              tintColor="#667eea"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.welcomeText}>
            Dr. {user?.nombre} {user?.apellido}
          </Text>
          
          {renderPeriodoSelector()}
          {renderResumenSection()}
          {renderAnalisisSection()}
          {renderAccionesSection()}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  periodoSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  periodoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  periodoButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodoButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  periodoButtonActive: {
    backgroundColor: '#fff',
  },
  periodoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  periodoButtonTextActive: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: (width - 60) / 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  analysisCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  analysisValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  analysisSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: (width - 60) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
});
