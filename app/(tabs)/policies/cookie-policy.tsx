import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, Platform, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CookiePolicy = () => {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDark ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>Política de Cookies</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={[styles.section, isDark && styles.darkText]}>1. ¿Qué son las Cookies?</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Las cookies son pequeños archivos de texto que se almacenan en su dispositivo
          cuando visita nuestra aplicación. Nos ayudan a proporcionar una mejor experiencia
          de usuario y entender cómo se utiliza nuestra aplicación.
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>2. Tipos de Cookies que Utilizamos</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Utilizamos los siguientes tipos de cookies:
          {'\n'}- Cookies esenciales: necesarias para el funcionamiento de la aplicación
          {'\n'}- Cookies de rendimiento: nos ayudan a mejorar el rendimiento
          {'\n'}- Cookies de funcionalidad: mejoran su experiencia de usuario
          {'\n'}- Cookies de análisis: nos ayudan a entender cómo usa la aplicación
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>3. Control de Cookies</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Puede controlar y/o eliminar las cookies según lo desee. Puede eliminar
          todas las cookies que ya están en su dispositivo y puede configurar la
          mayoría de los navegadores para evitar que se coloquen.
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>4. Cookies de Terceros</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          En algunos casos especiales, también utilizamos cookies proporcionadas por
          terceros de confianza. Nuestra aplicación utiliza servicios de análisis
          que nos ayudan a comprender cómo puede mejorar su experiencia.
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>5. Actualizaciones de la Política</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Podemos actualizar esta política de cookies ocasionalmente. Le recomendamos
          que revise esta página periódicamente para mantenerse informado sobre
          cualquier cambio.
        </Text>

        <Text style={[styles.lastUpdate, isDark && styles.darkText]}>
          Última actualización: 16 de enero de 2025
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  darkHeader: {
    backgroundColor: '#000000',
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  scrollView: {
    padding: 20,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#000000',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: '#333333',
  },
  lastUpdate: {
    marginTop: 30,
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
});

export default CookiePolicy;
