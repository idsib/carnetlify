import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Platform, StatusBar, Dimensions, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

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
      backgroundColor: isDark ? '#000000' : '#F5F5F5',
    },
    darkContainer: {
      backgroundColor: '#000000',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      marginLeft: 8,
      color: '#000000',
    },
    darkText: {
      color: '#FFFFFF',
    },
    backButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      flexDirection: isLargeScreen ? 'row' : 'column',
      justifyContent: isLargeScreen ? 'center' : 'flex-start',
    },
    planContainer: {
      width: CARD_WIDTH,
      padding: 16,
      paddingBottom: 120,
      alignSelf: 'flex-start',
    },
    plansWrapper: {
      flexDirection: isLargeScreen ? 'row' : 'column',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionContainer: {
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      width: '100%',
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    featureIcon: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureContent: {
      flex: 1,
      marginLeft: 12,
      marginRight: 8,
    },
    featureTitle: {
      fontSize: isLargeScreen ? 16 : 14,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: isLargeScreen ? 14 : 12,
      color: '#8E8E93',
      lineHeight: 18,
    },
    sectionTitle: {
      fontSize: isLargeScreen ? 20 : 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    subscribeButton: {
      backgroundColor: '#007AFF',
      borderRadius: 25,
      padding: 16,
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 'auto',
      marginBottom: 24,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    subscribeText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    price: {
      fontSize: isLargeScreen ? 42 : 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginVertical: isLargeScreen ? 24 : 16,
    },
    priceNote: {
      fontSize: isLargeScreen ? 16 : 14,
      color: '#8E8E93',
      textAlign: 'center',
      marginBottom: isLargeScreen ? 24 : 16,
      paddingHorizontal: 16,
      paddingTop: isExtraSmallDevice ? 8 : 0,
      paddingBottom: 8,
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 16,
      position: 'absolute',
      bottom: 120,
      left: 0,
      right: 0,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    desktopContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
      gap: 24,
      padding: isLargeScreen ? 32 : 0,
      maxWidth: 1200,
      marginHorizontal: 'auto',
    },
    desktopCard: {
      flex: 1,
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      minWidth: 300,
      maxWidth: 380,
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#E5E5EA',
      height: 680,
      ...Platform.select({
        web: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        default: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
      }),
    },
    cardHeader: {
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#E5E5EA',
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      zIndex: 1,
    },
    cardContent: {
      flex: 1,
      overflow: 'scroll',
      paddingTop: 16,
      maxHeight: 400,
    },
    selectedCard: {
      borderColor: '#007AFF',
      borderWidth: 2,
    },
    planTitle: {
      fontSize: isLargeScreen ? 28 : 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      textAlign: 'center',
      marginTop: isLargeScreen ? 24 : 16,
      paddingHorizontal: 16,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    benefitsSection: {
      marginTop: 32,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#333' : '#E5E5EA',
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
    if (isLargeScreen) {
      return (
        <View key={plan.id} style={styles.desktopCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.planTitle}>{plan.name}</Text>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.priceNote}>Pago único • Incluye tasa DGT (94,05€)</Text>
          </View>

          <ScrollView 
            style={styles.cardContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Experiencia Mejorada</Text>
              {plan.features.enhanced.map(renderFeatureItem)}
            </View>

            <View style={[styles.sectionContainer, styles.benefitsSection]}>
              <Text style={styles.sectionTitle}>Beneficios Adicionales</Text>
              {plan.features.creator.map(renderFeatureItem)}
            </View>
          </ScrollView>
        </View>
      );
    }

    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{
        scale: interpolate(
          scrollX.value,
          inputRange,
          [0.9, 1, 0.9],
          'clamp'
        )
      }],
      opacity: interpolate(
        scrollX.value,
        inputRange,
        [0.5, 1, 0.5],
        'clamp'
      ),
    }));

    return (
      <Animated.View key={plan.id} style={[styles.planContainer, animatedStyle]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.planTitle}>{plan.name}</Text>
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={styles.priceNote}>Pago único • Incluye tasa DGT (94,05€)</Text>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Experiencia Mejorada</Text>
            {plan.features.enhanced.map(renderFeatureItem)}
          </View>

          <View style={[styles.sectionContainer, styles.benefitsSection]}>
            <Text style={styles.sectionTitle}>Beneficios Adicionales</Text>
            {plan.features.creator.map(renderFeatureItem)}
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  const handlePlanSelect = (planId: string) => {
    // Store selected plan
    localStorage.setItem('selectedPlan', planId);
    
    // Immediately redirect to payment method page
    router.push('/sections/paymethod');
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
      />
      <View style={styles.header}>
        <Link href="../profile" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={isDark ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </Link>
        <Text style={[styles.title, isDark && styles.darkText]}>Plan de Suscripción</Text>
      </View>

      {isLargeScreen ? (
        <View style={styles.desktopContainer}>
          {plans.map((plan, index) => (
            <TouchableOpacity 
              key={plan.id} 
              onPress={() => handlePlanSelect(plan.id)}
              style={[
                styles.desktopCard,
                plan.id === selectedPlanId && styles.selectedCard
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.planTitle}>{plan.name}</Text>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.priceNote}>Pago único • Incluye tasa DGT (94,05€)</Text>
              </View>

              <ScrollView 
                style={styles.cardContent}
                showsVerticalScrollIndicator={true}
              >
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Experiencia Mejorada</Text>
                  {plan.features.enhanced.map(renderFeatureItem)}
                </View>

                <View style={[styles.sectionContainer, styles.benefitsSection]}>
                  <Text style={styles.sectionTitle}>Beneficios Adicionales</Text>
                  {plan.features.creator.map(renderFeatureItem)}
                </View>
              </ScrollView>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={() => handlePlanSelect(selectedPlanId)}
        >
          <Text style={styles.subscribeText}>Seleccionar Plan</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default SubscriptionPlanPage;