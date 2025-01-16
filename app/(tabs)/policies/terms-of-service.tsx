import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, Platform, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsOfService = () => {
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
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>Términos de Servicio</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={[styles.section, isDark && styles.darkText]}>1. Aceptación de los Términos</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Al acceder y utilizar esta aplicación, usted acepta estar sujeto a estos Términos de Servicio.
          Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>2. Uso del Servicio</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Nuestro servicio está diseñado para [descripción del servicio].
          Usted se compromete a utilizar el servicio solo para fines legales y de acuerdo con estos términos.
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>3. Cuenta de Usuario</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Para acceder a ciertas funciones de nuestra aplicación, deberá crear una cuenta.
          Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>4. Modificaciones del Servicio</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Nos reservamos el derecho de modificar o descontinuar el servicio en cualquier momento,
          con o sin previo aviso.
        </Text>

        <Text style={[styles.section, isDark && styles.darkText]}>5. Limitación de Responsabilidad</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          En ningún caso seremos responsables por daños indirectos, incidentales, especiales o consecuentes
          que resulten del uso de nuestro servicio.
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

export default TermsOfService;
