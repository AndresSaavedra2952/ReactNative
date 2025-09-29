import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { especialidadesService } from '../../src/service/ApiService';

const { width } = Dimensions.get('window');

export default function InicioScreen({ navigation }) {
  const [currentSpecialty, setCurrentSpecialty] = useState(0);
  const [especialidadesReales, setEspecialidadesReales] = useState([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(true);
  const scrollViewRef = useRef(null);

  // Cargar especialidades reales de la base de datos
  useEffect(() => {
    loadEspecialidades();
  }, []);

  const loadEspecialidades = async () => {
    try {
      setLoadingEspecialidades(true);
      const response = await especialidadesService.getAll();
      console.log('Especialidades cargadas:', response);
      
      if (response && response.data) {
        // Mapear las especialidades de la BD a nuestro formato
        const especialidadesMapeadas = response.data.map((esp, index) => ({
          id: esp.id,
          name: esp.nombre,
          description: esp.descripcion || 'Especialidad médica profesional',
          specialists: Math.floor(Math.random() * 50) + 10, // Número simulado de especialistas
          icon: getIconForSpecialty(esp.nombre),
          color: getColorForSpecialty(index),
          image: getImageForSpecialty(esp.nombre)
        }));
        
        setEspecialidadesReales(especialidadesMapeadas);
      }
    } catch (error) {
      console.error('Error cargando especialidades:', error);
      // En caso de error, usar las especialidades por defecto
      setEspecialidadesReales(specialties);
    } finally {
      setLoadingEspecialidades(false);
    }
  };

  // Función para obtener ícono según el nombre de la especialidad
  const getIconForSpecialty = (nombre) => {
    const iconMap = {
      'Cardiología': 'heart',
      'Traumatología': 'medical',
      'Pediatría': 'people',
      'Ginecología': 'female',
      'Neurología': 'brain',
      'Dermatología': 'body',
      'Oftalmología': 'eye',
      'Otorrinolaringología': 'ear',
      'Psiquiatría': 'headset',
      'Medicina Interna': 'medical-bag',
      'Cirugía General': 'cut',
      'Urología': 'male',
      'Oncología': 'shield',
      'Endocrinología': 'leaf',
      'Gastroenterología': 'restaurant',
      'Neumología': 'airplane',
      'Reumatología': 'fitness',
      'Hematología': 'water',
      'Nefrología': 'funnel',
      'Infectología': 'bug'
    };
    return iconMap[nombre] || 'medical';
  };

  // Función para obtener color según el índice
  const getColorForSpecialty = (index) => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#10ac84', '#ee5a24', '#0984e3', '#6c5ce7', '#a29bfe',
      '#fd79a8', '#fdcb6e', '#e17055', '#81ecec', '#74b9ff'
    ];
    return colors[index % colors.length];
  };

  // Función para obtener imagen según el nombre de la especialidad
  const getImageForSpecialty = (nombre) => {
    const imageMap = {
      'Cardiología': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      'Traumatología': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      'Pediatría': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop',
      'Ginecología': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
      'Neurología': 'https://images.unsplash.com/photo-1576091160550-2173dba0ef28?w=400&h=300&fit=crop',
      'Dermatología': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      'Oftalmología': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop',
      'Otorrinolaringología': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      'Psiquiatría': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      'Medicina Interna': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop'
    };
    return imageMap[nombre] || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop';
  };

  const specialties = [
    {
      id: 1,
      name: 'Cardiología',
      description: 'Especialistas en enfermedades del corazón y sistema cardiovascular.',
      specialists: 25,
      icon: 'heart',
      color: '#ff6b6b',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Traumatología',
      description: 'Especialistas en lesiones y enfermedades del sistema musculoesquelético.',
      specialists: 38,
      icon: 'medical',
      color: '#4ecdc4',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Pediatría',
      description: 'Cuidado especializado para bebés, niños y adolescentes.',
      specialists: 42,
      icon: 'people',
      color: '#45b7d1',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Ginecología',
      description: 'Salud integral de la mujer en todas las etapas de la vida.',
      specialists: 31,
      icon: 'flower',
      color: '#f9ca24',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Neurología',
      description: 'Diagnóstico y tratamiento de enfermedades del sistema nervioso.',
      specialists: 19,
      icon: 'brain',
      color: '#6c5ce7',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop'
    }
  ];

  const features = [
    {
      icon: 'time',
      title: 'Disponibilidad 24/7',
      description: 'Agenda citas en cualquier momento del día, los 7 días de la semana.',
      color: '#4facfe'
    },
    {
      icon: 'shield-checkmark',
      title: 'Datos Seguros',
      description: 'Tu información médica está protegida con los más altos estándares de seguridad.',
      color: '#4ecdc4'
    },
    {
      icon: 'people',
      title: 'Especialistas Certificados',
      description: 'Todos nuestros médicos están certificados y tienen amplia experiencia.',
      color: '#6c5ce7'
    },
    {
      icon: 'calendar',
      title: 'Gestión Inteligente',
      description: 'Sistema inteligente que optimiza horarios y reduce tiempos de espera.',
      color: '#f9ca24'
    },
    {
      icon: 'call',
      title: 'Soporte Inmediato',
      description: 'Atención al cliente disponible para resolver cualquier duda o consulta.',
      color: '#ff6b6b'
    },
    {
      icon: 'star',
      title: 'Experiencia Premium',
      description: 'Interfaz moderna y fácil de usar diseñada pensando en tu comodidad.',
      color: '#a8edea'
    }
  ];

  const stats = [
    { number: '500+', label: 'Especialistas' },
    { number: '50k+', label: 'Pacientes' },
    { number: '24/7', label: 'Disponible' }
  ];

  const renderSpecialtyCard = ({ item, index }) => (
    <View style={styles.specialtyCard}>
      <View style={styles.specialtyImageContainer}>
        <View style={[styles.specialtyIcon, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={24} color="#fff" />
        </View>
        <Text style={styles.specialtyName}>{item.name}</Text>
        <Text style={styles.specialtyDescription}>{item.description}</Text>
        <Text style={styles.specialtyCount}>{item.specialists} especialistas disponibles</Text>
        <TouchableOpacity style={styles.specialtyButton}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.specialtyButtonGradient}
          >
            <Text style={styles.specialtyButtonText}>Ver Especialistas</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFeatureCard = ({ item }) => (
    <View style={styles.featureCard}>
      <View style={[styles.featureIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#fff" />
      </View>
      <Text style={styles.featureTitle}>{item.title}</Text>
      <Text style={styles.featureDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header simplificado */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="calendar" size={20} color="#fff" />
          </View>
          <Text style={styles.logoText}>Citas_ADSO</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>Plataforma médica líder</Text>
            </View>
            
            <View style={styles.heroTitleContainer}>
              <Text style={styles.heroTitle}>Tu salud es nuestra</Text>
              <View style={styles.heroTitleAccent} />
            </View>
            
            <Text style={styles.heroDescription}>
              Agenda citas médicas de forma rápida y segura. Conectamos pacientes con los mejores especialistas para brindarte la atención que mereces.
            </Text>
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Register')}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.primaryButtonGradient}
              >
                <Ionicons name="calendar" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Agendar Cita Ahora</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.statNumber}>{stat.number}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Overlay Cards */}
          <View style={styles.overlayCardsContainer}>
            <View style={styles.overlayCard1}>
              <Ionicons name="time" size={16} color="#667eea" />
              <Text style={styles.overlayText1}>Cita disponible</Text>
              <Text style={styles.overlayText2}>Hoy 3:00 PM</Text>
            </View>
            
            <View style={styles.overlayCard2}>
              <Ionicons name="shield-checkmark" size={16} color="#667eea" />
              <Text style={styles.overlayText1}>100% Seguro</Text>
              <Text style={styles.overlayText2}>Datos protegidos</Text>
            </View>
          </View>
        </View>

        {/* Specialties Section */}
        <View style={styles.specialtiesSection}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Nuestras Especialidades</Text>
            <View style={styles.sectionTitleAccent} />
          </View>
          
          <Text style={styles.sectionSubtitle}>
            Contamos con los mejores especialistas en cada área médica para brindarte la atención más completa y profesional.
          </Text>
          
          {loadingEspecialidades ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando especialidades...</Text>
            </View>
          ) : (
            <FlatList
              data={especialidadesReales.length > 0 ? especialidadesReales : specialties}
              renderItem={renderSpecialtyCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.specialtiesList}
              pagingEnabled
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentSpecialty(index);
              }}
            />
          )}
          
          <View style={styles.paginationDots}>
            {(especialidadesReales.length > 0 ? especialidadesReales : specialties).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentSpecialty && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>¿Por qué elegir Citas_ADSO?</Text>
            <View style={styles.sectionTitleAccent} />
          </View>
          
          <Text style={styles.sectionSubtitle}>
            Ofrecemos una experiencia médica moderna, segura y conveniente que pone tu salud en primer lugar.
          </Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <Ionicons name={feature.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.ctaCard}
          >
            <Text style={styles.ctaTitle}>¿Listo para cuidar tu salud?</Text>
            <Text style={styles.ctaDescription}>
              Agenda tu cita médica en menos de 2 minutos. Nuestros especialistas están listos para atenderte.
            </Text>
            
            <View style={styles.ctaFeatures}>
              <View style={styles.ctaFeature}>
                <Ionicons name="checkmark" size={16} color="#fff" />
                <Text style={styles.ctaFeatureText}>Sin listas de espera</Text>
              </View>
              <View style={styles.ctaFeature}>
                <Ionicons name="checkmark" size={16} color="#fff" />
                <Text style={styles.ctaFeatureText}>Confirmación inmediata</Text>
              </View>
              <View style={styles.ctaFeature}>
                <Ionicons name="checkmark" size={16} color="#fff" />
                <Text style={styles.ctaFeatureText}>Recordatorios automáticos</Text>
              </View>
            </View>
            
            <View style={styles.ctaButtons}>
              <TouchableOpacity 
                style={styles.ctaPrimaryButton}
                onPress={() => navigation.navigate('Register')}
              >
                <Ionicons name="calendar" size={20} color="#667eea" />
                <Text style={styles.ctaPrimaryButtonText}>Agendar Cita Ahora</Text>
                <Ionicons name="arrow-forward" size={16} color="#667eea" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.ctaDisclaimer}>
              * Disponible las 24 horas, los 7 días de la semana
            </Text>
          </LinearGradient>
        </View>

        {/* Auth Section */}
        <View style={styles.authSection}>
          <Text style={styles.authTitle}>¿Ya tienes cuenta?</Text>
          <View style={styles.authButtons}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.registerButtonGradient}
              >
                <Text style={styles.registerButtonText}>Crear Cuenta</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#667eea',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    position: 'relative',
    backgroundColor: '#fff',
  },
  heroContent: {
    flex: 1,
    maxWidth: '70%',
  },
  tagContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  heroTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  heroTitleAccent: {
    width: 50,
    height: 3,
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  heroDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  overlayCardsContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    gap: 12,
  },
  overlayCard1: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 100,
  },
  overlayCard2: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 100,
  },
  overlayText1: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  overlayText2: {
    fontSize: 9,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  specialtiesSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  sectionTitleAccent: {
    width: 40,
    height: 3,
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  specialtiesList: {
    paddingHorizontal: 0,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  specialtyCard: {
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  specialtyImageContainer: {
    padding: 16,
    alignItems: 'center',
  },
  specialtyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  specialtyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  specialtyDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
  },
  specialtyCount: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
    marginBottom: 16,
  },
  specialtyButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  specialtyButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  specialtyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  paginationDotActive: {
    backgroundColor: '#667eea',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: (width - 56) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  ctaCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  ctaFeatures: {
    marginBottom: 30,
    gap: 12,
  },
  ctaFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaFeatureText: {
    color: '#fff',
    fontSize: 14,
  },
  ctaButtons: {
    marginBottom: 16,
  },
  ctaPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  ctaPrimaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ctaDisclaimer: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  authSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  authTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  loginButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#667eea',
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  registerButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});