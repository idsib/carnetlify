import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  useColorScheme, 
  Platform, 
  StatusBar, 
  Dimensions, 
  ScrollView, 
  useWindowDimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate 
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const plans = [
  {
    id: '1',
    name: 'BÁSICO',
    price: '450 €',
    features: {
      enhanced: [
        { title: 'Curso Teórico Online', description: 'Acceso completo 24/7 al contenido teórico', icon: 'book' },
        { title: 'Clases Prácticas', description: '10 clases prácticas con instructor', icon: 'car' },
        { title: 'Chat con Profesores', description: 'Soporte en horario laboral', icon: 'chatbubbles' },
        { title: 'Tests Personalizados', description: 'Tests adaptados a tu progreso', icon: 'document-text' },
      ],
      creator: [
        { title: 'Gestión Estándar', description: 'Tramitación normal de documentos', icon: 'document' },
      ],
    },
  },
  {
    id: '2',
    name: 'COMPLETO',
    price: '620 €',
    features: {
      enhanced: [
        { title: 'Curso Teórico Online', description: 'Acceso completo 24/7 al contenido teórico', icon: 'book' },
        { title: 'Clases Prácticas', description: '18 clases prácticas con instructor', icon: 'car' },
        { title: 'Chat con Profesores', description: 'Soporte extendido', icon: 'chatbubbles' },
        { title: 'Simulador de Examen', description: 'Práctica con exámenes reales anteriores', icon: 'desktop' },
      ],
      creator: [
        { title: 'Gestión Prioritaria', description: 'Tramitación prioritaria de documentos', icon: 'document' },
        { title: 'Análisis de Progreso', description: 'Estadísticas básicas de tu evolución', icon: 'analytics' },
      ],
    },
  },
  {
    id: '3',
    name: 'PREMIUM',
    price: '800 €',
    features: {
      enhanced: [
        { title: 'Curso Teórico Online', description: 'Acceso completo 24/7 al contenido teórico', icon: 'book' },
        { title: 'Clases Prácticas', description: '25 clases prácticas con instructor', icon: 'car' },
        { title: 'Chat con Profesores', description: 'Soporte 24/7 con respuesta inmediata', icon: 'chatbubbles' },
        { title: 'Clases de Perfeccionamiento', description: 'Sesiones extra para mejorar tu técnica', icon: 'medal' },
      ],
      creator: [
        { title: 'Gestión Premium', description: 'Tramitación prioritaria de documentos', icon: 'document' },
        { title: 'Garantía de Aprobado', description: 'Te acompañamos hasta que apruebes', icon: 'checkmark-circle' },
        { title: 'Análisis de Progreso', description: 'Estadísticas detalladas de tu evolución', icon: 'analytics' },
        { title: 'Recursos Adicionales', description: 'Material extra y tests personalizados', icon: 'library' },
      ],
    },
  },
];

const SubscriptionPlanPage = () => {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get('window');
  const hasDynamicIsland = Platform.OS === 'ios' && height >= 852;
  const isSmallDevice = height < 700;
  const isExtraSmallDevice = height < 500;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLargeScreen = windowWidth > 768; 
  const CARD_WIDTH = isLargeScreen ? windowWidth / 3 : windowWidth; 
  const [selectedPlanId, setSelectedPlanId] = useState('2'); 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    darkContainer: {
      backgroundColor: '#000000',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: isDark ? '#000000' : '#F5F5F5',
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      marginLeft: 8,
      color: isDark ? '#FFFFFF' : '#000000',
    },
    darkText: {
      color: '#FFFFFF',
    },
    backButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      padding: 16,
    },
    plansWrapper: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    planContainer: {
      width: '90%',
      marginBottom: 16,
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    selectedCard: {
      backgroundColor: '#1A1A1A',
      transform: [{ scale: 1.02 }],
      elevation: 5,
    },
    planTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      textAlign: 'center',
      marginBottom: 8,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    featureIcon: {
      width: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureContent: {
      flex: 1,
      marginLeft: 8,
      marginRight: 4,
    },
    featureTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 12,
      color: '#8E8E93',
      lineHeight: 16,
    },
    sectionContainer: {
      width: '100%',
      marginTop: 16,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 12,
    },
    subscribeButton: {
      backgroundColor: '#007AFF',
      borderRadius: 25,
      padding: 14,
      alignItems: 'center',
      marginHorizontal: 16,
      marginVertical: 16,
    },
    subscribeText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    price: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginVertical: 16,
    },
    priceNote: {
      fontSize: 12,
      color: '#8E8E93',
      textAlign: 'center',
      marginBottom: 16,
      paddingHorizontal: 12,
      paddingTop: isExtraSmallDevice ? 8 : 0,
      paddingBottom: 8,
    },
  });

  const renderFeatureItem = (item: any) => (
    <View key={item.title} style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={item.icon} size={24} color="#007AFF" />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
      </View>
      <Ionicons name="checkmark" size={24} color="#32D74B" />
    </View>
  );

  const renderPlan = (plan: any, index: number) => {
    return (
      <View key={plan.id} style={styles.planContainer}>
        <Text style={styles.planTitle}>{plan.name}</Text>
        <Text style={styles.price}>{plan.price}</Text>
        <Text style={styles.priceNote}>Pago único • Incluye tasa DGT (94,05€)</Text>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Experiencia Mejorada</Text>
          {plan.features.enhanced.map(renderFeatureItem)}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Beneficios Adicionales</Text>
          {plan.features.creator.map(renderFeatureItem)}
        </View>
      </View>
    );
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
    router.push({
      pathname: '/sections/personalInfo',
      params: { 
        planId,
        planName: plans.find(p => p.id === planId)?.name || '',
        planPrice: plans.find(p => p.id === planId)?.price || ''
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
      />
      <View style={[styles.header, isDark && styles.darkContainer]}>
        <Link href="../profile" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={isDark ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </Link>
        <Text style={[styles.title, isDark && styles.darkText]}>Planes de Suscripción</Text>
      </View>

      <ScrollView contentContainerStyle={styles.plansWrapper}>
        {plans.map((plan, index) => (
          <TouchableOpacity 
            key={plan.id} 
            onPress={() => handlePlanSelect(plan.id)}
            style={[
              styles.planContainer,
              plan.id === selectedPlanId && styles.selectedCard
            ]}
          >
            {renderPlan(plan, index)}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionPlanPage;