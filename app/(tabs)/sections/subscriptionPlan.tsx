import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Platform, StatusBar, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
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
        { title: 'Sin Publicidad', description: 'Experiencia libre de anuncios', icon: 'shield-checkmark' },
      ],
      creator: [
        { title: 'Gestión Prioritaria', description: 'Tramitación prioritaria de documentos', icon: 'document' },
        { title: 'Análisis de Progreso', description: 'Estadísticas básicas de tu evolución', icon: 'analytics' },
      ],
    },
  },
  {
    id: '3',
    name: 'PREMIUM+',
    price: '800 €',
    features: {
      enhanced: [
        { title: 'Curso Teórico Online', description: 'Acceso completo 24/7 al contenido teórico', icon: 'book' },
        { title: 'Clases Prácticas', description: '25 clases prácticas con instructor', icon: 'car' },
        { title: 'Chat con Profesores', description: 'Soporte 24/7 con respuesta inmediata', icon: 'chatbubbles' },
        { title: 'Sin Publicidad', description: 'Experiencia completamente libre de anuncios', icon: 'shield-checkmark' },
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
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get('window');
  const hasDynamicIsland = Platform.OS === 'ios' && height >= 852;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#F5F5F5',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingTop: Platform.OS === 'ios' 
        ? hasDynamicIsland 
          ? insets.top + 12
          : 60
        : 16,
      marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerTitle: {
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginLeft: 8,
      fontSize: Platform.OS === 'ios' 
        ? hasDynamicIsland 
          ? 30
          : 34
        : 28,
    },
    backButton: {
      padding: 8,
    },
    content: {
      flex: 1,
    },
    planContainer: {
      width: SCREEN_WIDTH,
      padding: 16,
    },
    planTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginVertical: 20,
    },
    sectionContainer: {
      backgroundColor: '#1C1C1E',
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 16,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    featureIcon: {
      width: 40,
      alignItems: 'center',
    },
    featureContent: {
      flex: 1,
      marginLeft: 12,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 14,
      color: '#8E8E93',
    },
    subscribeButton: {
      backgroundColor: '#007AFF',
      borderRadius: 25,
      padding: 16,
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: insets.bottom + 16,
    },
    subscribeText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    price: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginVertical: 20,
    },
    priceNote: {
      fontSize: 14,
      color: '#8E8E93',
      textAlign: 'center',
      marginBottom: 20,
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 20,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
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
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.9, 1, 0.9],
        'clamp'
      );
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.5, 1, 0.5],
        'clamp'
      );
      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <Animated.View key={plan.id} style={[styles.planContainer, animatedStyle]}>
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
      </Animated.View>
    );
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Link href="/(tabs)/profile" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </Link>
          <Text style={styles.headerTitle}>Planes y Precios</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            scrollX.value = event.nativeEvent.contentOffset.x;
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentIndex(newIndex);
          }}
          scrollEventThrottle={16}
        >
          {plans.map(renderPlan)}
        </ScrollView>

        <View style={styles.paginationContainer}>
          {plans.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === currentIndex ? '#007AFF' : '#4A4A4A',
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeText}>Suscribirse Ahora</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default SubscriptionPlanPage;