import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../backend/firebase/config';

const { width } = Dimensions.get('window');

const Login = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('../main'); // Redirigir al home después del inicio de sesión
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Correo electrónico o contraseña incorrectos.');
    }
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
                source={isDarkMode 
                  ? require('@/assets/images/carnetlify-white.png')
                  : require('@/assets/images/carnetlify-black.png')
                }
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
                Iniciar sesión
              </Text>
            </View>
            <View style={styles.content}>
              <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholderTextColor={isDarkMode ? '#777' : '#999'}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                keyboardType="email-address"
              />
              <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholderTextColor={isDarkMode ? '#777' : '#999'}
                placeholder="Contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' },
                ]}
                onPress={handleLogin}>
                <Text
                  style={[
                    styles.buttonText,
                    { color: isDarkMode ? '#ffffff' : '#000000' },
                  ]}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={() => router.push('/resetpass')}>
                <Text
                  style={[
                    styles.forgotPasswordText,
                    { color: isDarkMode ? '#ffffff' : '#000000' },
                  ]}>
                  ¿Olvidaste tu contraseña?
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
  button: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    marginTop: 10,
    padding: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
});

export default Login;
