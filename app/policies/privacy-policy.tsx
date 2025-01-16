import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, Platform, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDark ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>Política de Privacidad</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={[styles.section, isDark && styles.darkText]}>1. Información que Recopilamos</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Recopilamos información que usted nos proporciona directamente cuando:
          {'\n'}- Crea una cuenta
          {'\n'}- Utiliza nuestros servicios
          {'\n'}- Se comunica con nosotros
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>2. Uso de la Información</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Utilizamos la información recopilada para:
          {'\n'}- Proporcionar y mantener nuestros servicios
          {'\n'}- Mejorar la experiencia del usuario
          {'\n'}- Enviar notificaciones importantes
          {'\n'}- Detectar y prevenir fraudes
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>3. Compartir Información</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          No vendemos ni compartimos su información personal con terceros,
          excepto cuando sea necesario para proporcionar nuestros servicios
          o cuando estemos legalmente obligados a hacerlo.
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>4. Seguridad de Datos</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Implementamos medidas de seguridad diseñadas para proteger su información personal,
          pero ningún sistema es completamente seguro.
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>5. Sus Derechos</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Usted tiene derecho a:
          {'\n'}- Acceder a sus datos personales
          {'\n'}- Corregir datos inexactos
          {'\n'}- Solicitar la eliminación de sus datos
          {'\n'}- Oponerse al procesamiento de sus datos
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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

export default PrivacyPolicy;
