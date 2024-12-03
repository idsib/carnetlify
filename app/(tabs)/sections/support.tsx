import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, useColorScheme, Platform, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SupportPage = () => {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get('window');
  
  const hasDynamicIsland = Platform.OS === 'ios' && height >= 852;

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
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    card: {
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#FFFFFF' : '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.1 : 0.08,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    cardDescription: {
      fontSize: 15,
      color: isDark ? '#A0A0A0' : '#666666',
      marginBottom: 20,
      lineHeight: 22,
    },
    contactButton: {
      backgroundColor: isDark ? '#2C2C2E' : '#F8F8F8',
      borderRadius: 16,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3E' : '#E5E5E5',
    },
    contactButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#000000',
      letterSpacing: -0.3,
    },
    iconContainer: {
      backgroundColor: isDark ? '#3C3C3E' : '#EFEFEF',
      padding: 10,
      borderRadius: 12,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? '#2C2C2E' : '#E5E5E5',
      marginVertical: 20,
    },
    additionalInfo: {
      marginTop: 8,
      fontSize: 14,
      color: isDark ? '#808080' : '#888888',
      textAlign: 'center',
    }
  });

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000000' : '#F5F5F5'}
      />
      <SafeAreaView style={styles.container}>
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
          <Text style={[styles.title, isDark && styles.darkText]}>Soporte</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>¿Necesitas ayuda?</Text>
            <Text style={styles.cardDescription}>
              Estamos aquí para ayudarte con cualquier pregunta o problema que tengas. Nuestro equipo de soporte está disponible para asistirte.
            </Text>
            
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => Linking.openURL('mailto:soporte@carnetlify.com')}
            >
              <Text style={styles.contactButtonText}>soporte@carnetlify.com</Text>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name="mail-outline" 
                  size={22} 
                  color={isDark ? '#FFFFFF' : '#000000'} 
                />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />
            
            <Text style={styles.additionalInfo}>
              Tiempo de respuesta promedio: 24 horas
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SupportPage;