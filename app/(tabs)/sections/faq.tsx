import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Platform, StatusBar, Dimensions, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const faqs = [
  {
    id: '1',
    question: '¿Cuánto tiempo necesito para sacarme el carnet?',
    answer: 'El tiempo promedio es de 2-3 meses, pero varía según tu dedicación y experiencia previa. Con nuestro plan de estudio personalizado, te ayudamos a optimizar tu tiempo de preparación.'
  },
  {
    id: '2',
    question: '¿Cómo funcionan las clases prácticas?',
    answer: 'Las clases prácticas se programan directamente desde la app según tu disponibilidad. Cada clase dura 45 minutos y cuentas con un instructor profesional que te guiará en todo momento.'
  },
  {
    id: '3',
    question: '¿Puedo cambiar de plan durante el curso?',
    answer: 'Sí, puedes actualizar tu plan en cualquier momento. La diferencia de precio se calculará proporcionalmente según las clases y servicios restantes.'
  },
  {
    id: '4',
    question: '¿Qué incluye el curso teórico online?',
    answer: 'El curso incluye todos los temas actualizados de la DGT, tests ilimitados, videos explicativos, estadísticas de progreso y material complementario disponible 24/7.'
  },
  {
    id: '5',
    question: '¿Cómo funciona la garantía de aprobado?',
    answer: 'Si no apruebas en el primer intento, seguiremos apoyándote sin coste adicional hasta que consigas tu carnet, incluyendo clases extra si son necesarias (disponible en plan Premium+).'
  },
  {
    id: '6',
    question: '¿Qué documentos necesito para empezar?',
    answer: 'Necesitas DNI/NIE vigente, certificado médico psicotécnico y una foto reciente. Desde la app te guiamos en todo el proceso de tramitación.'
  }
];

const FAQPage = () => {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get('window');
  const hasDynamicIsland = Platform.OS === 'ios' && height >= 852;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { width: windowWidth } = useWindowDimensions();
  const isLargeScreen = windowWidth > 768;

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
          : insets.top + 8
        : StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 16,
      marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerTitle: {
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginLeft: 8,
      fontSize: Platform.OS === 'ios' 
        ? hasDynamicIsland 
          ? 24
          : 22
        : 20,
    },
    backButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      padding: 16,
      maxWidth: isLargeScreen ? 1000 : '100%',
      marginHorizontal: 'auto',
      width: '100%',
      paddingHorizontal: isLargeScreen ? 32 : 16,
      marginTop: isLargeScreen ? 24 : 0,
    },
    faqItem: {
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 12,
      marginBottom: isLargeScreen ? 16 : 12,
      overflow: 'hidden',
      padding: isLargeScreen ? 4 : 0,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    questionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: isLargeScreen ? 20 : 16,
      justifyContent: 'space-between',
    },
    question: {
      fontSize: isLargeScreen ? 18 : 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
      flex: 1,
      marginRight: 16,
    },
    answer: {
      fontSize: isLargeScreen ? 16 : 14,
      color: isDark ? '#CCCCCC' : '#666666',
      padding: isLargeScreen ? 20 : 16,
      paddingTop: 0,
      lineHeight: isLargeScreen ? 24 : 20,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? '#333333' : '#E5E5EA',
      marginHorizontal: isLargeScreen ? 20 : 16,
    },
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000000' : '#F5F5F5'}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Link href="/(tabs)/profile" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={isDark ? '#FFFFFF' : '#000000'} 
              />
            </TouchableOpacity>
          </Link>
          <Text style={styles.headerTitle}>Preguntas Frecuentes</Text>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            maxWidth: isLargeScreen ? 1000 : undefined,
            marginHorizontal: 'auto',
            width: '100%',
          }}
        >
          {faqs.map((faq) => (
            <TouchableOpacity 
              key={faq.id} 
              style={styles.faqItem}
              onPress={() => toggleExpand(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.questionContainer}>
                <Text style={styles.question}>{faq.question}</Text>
                <Ionicons 
                  name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'} 
                  size={isLargeScreen ? 24 : 20}
                  color={isDark ? '#FFFFFF' : '#000000'}
                />
              </View>
              
              {expandedId === faq.id && (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.answer}>{faq.answer}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default FAQPage;
