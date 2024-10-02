import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, useColorScheme, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const Login = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (text: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
              <Text style={[styles.cancelText, isDarkMode ? styles.darkText : styles.lightText]}>Cancelar</Text>
            </TouchableOpacity>
            <Image
              source={require('../../assets/images/carnetlify-white.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.content}>
            <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Iniciar sesión</Text>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, isDarkMode ? styles.darkText : styles.lightText]}>Correo electrónico</Text>
              <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholderTextColor={isDarkMode ? '#777' : '#999'}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateEmail(text);
                }}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, isDarkMode ? styles.darkText : styles.lightText]}>Contraseña</Text>
              <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholderTextColor={isDarkMode ? '#777' : '#999'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity onPress={() => alert('Restablecer contraseña')}>
              <Text style={[styles.forgotPasswordText, isDarkMode ? styles.darkText : styles.lightText]}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>
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
    paddingBottom: 30, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20, 
  },
  cancelButton: {
    padding: 5,
  },
  cancelText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 25, 
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 30, 
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 8,
    fontSize: 16,
    paddingVertical: 12, 
    paddingHorizontal: 15, 
  },
  darkInput: {
    color: '#FFFFFF',
    borderColor: '#333',
    backgroundColor: '#1A1A1A',
  },
  lightInput: {
    color: '#000000',
    backgroundColor: '#F7F7F7',
  },
  footer: {
    padding: 30, 
  },
  loginButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 50,
    paddingVertical: 15, 
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
  logo: {
    width: 50,
    height: 50,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '600',
  },
  forgotPasswordText: {
    fontSize: 14,
    textAlign: 'right',
    marginTop: 15, 
    color: '#1DA1F2',
  },
});

export default Login;