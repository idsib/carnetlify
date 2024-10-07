import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, useColorScheme, Image, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ResetPassword = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();

  const [email, setEmail] = useState('');

  const validateEmail = (text: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image
                source={isDarkMode ? require('../../assets/images/carnetlify-white.png') : require('../../assets/images/carnetlify_black.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Restablecer contraseña</Text>
            </View>
            <View style={styles.content}>
              <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholderTextColor={isDarkMode ? '#777' : '#999'}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateEmail(text);
                }}
                keyboardType="email-address"
              />
              <TouchableOpacity style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Enviar enlace de restablecimiento</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={[styles.backToLoginText, isDarkMode ? styles.darkText : styles.lightText]}>
                  Volver al inicio de sesión
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    maxWidth: 150,
    maxHeight: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  content: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 8,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  darkInput: {
    color: '#FFFFFF',
    borderColor: '#444',
    backgroundColor: '#222',
  },
  lightInput: {
    color: '#000000',
    backgroundColor: '#F5F8FA',
  },
  resetButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
  backToLoginText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    color: '#1DA1F2',
  },
});

export default ResetPassword;