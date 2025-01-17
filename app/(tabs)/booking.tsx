import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BookingScreen() {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000000' : '#F5F5F5'}
      />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/main')}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={isDark ? '#FFFFFF' : '#000000'} 
          />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.darkText]}>Reservas</Text>
      </View>
      <View style={styles.content}>
        <Text style={[
          styles.comingSoonText, 
          isDark ? styles.textDark : styles.textLight,
        ]}>
          COMING SOON
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  containerLight: {
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: '#007AFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 2,
  },
  textDark: {
    color: '#FFFFFF',
    textShadowColor: '#007AFF',
  },
  textLight: {
    color: '#000000',
    textShadowColor: '#007AFF',
  },
});
