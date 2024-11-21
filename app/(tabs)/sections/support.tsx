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
  
  // Detectar si el dispositivo probablemente tiene Dynamic Island
  const hasDynamicIsland = Platform.OS === 'ios' && height >= 852;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    containerLight: {
      backgroundColor: '#F5F5F5',
    },
    containerDark: {
      backgroundColor: '#000000',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingTop: Platform.OS === 'ios' 
        ? hasDynamicIsland 
          ? insets.top + 12 // Ajuste para Dynamic Island
          : 60 // iPhone sin Dynamic Island
        : 16, // Android
      marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerTitle: {
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginLeft: 8,
      fontSize: Platform.OS === 'ios' 
        ? hasDynamicIsland 
          ? 30 // Tamaño ligeramente menor para Dynamic Island
          : 34 // iPhone sin Dynamic Island
        : 28, // Android
    },
    backButton: {
      padding: 8,
    },
    supportBox: {
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 16,
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
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 16,
    },
    emailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5',
      borderRadius: 12,
      padding: 16,
    },
    emailText: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#000000',
    },
  });

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000000' : '#F5F5F5'}
      />
      <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
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
          <Text style={styles.headerTitle}>Soporte</Text>
        </View>

        <View style={styles.supportBox}>
          <Text style={styles.title}>Contáctanos</Text>
          <TouchableOpacity 
            style={styles.emailContainer}
            onPress={() => Linking.openURL('mailto:soporte@carnetlify.com')}
          >
            <Text style={styles.emailText}>soporte@carnetlify.com</Text>
            <Ionicons 
              name="mail" 
              size={24} 
              color={isDark ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SupportPage;