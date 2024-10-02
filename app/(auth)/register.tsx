import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, useColorScheme, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const Register = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();

  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const validateName = (text: string) => {
    return text.length >= 2 && text.length <= 50;
  };

  const validateDNI = (text: string) => {
    return /^\d{8}[a-zA-Z]$/.test(text);
  };

  const validateEmail = (text: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  };

  const validateBirthDate = (text: string) => {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(text);
  };

  const formatDNI = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    const letter = text.slice(-1).toUpperCase();
    if (numbers.length === 8 && /[A-Z]/.test(letter)) {
      return `${numbers}${letter}`;
    }
    return numbers;
  };

  const formatBirthDate = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
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
            <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Crea tu cuenta</Text>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, isDarkMode ? styles.darkText : styles.lightText]}>Nombre</Text>
              <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholderTextColor={isDarkMode ? '#777' : '#999'}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  validateName(text);
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, isDarkMode ? styles.darkText : styles.lightText]}>DNI</Text>
              <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholderTextColor={isDarkMode ? '#777' : '#999'}
                value={dni}
                onChangeText={(text) => {
                  const formattedDNI = formatDNI(text);
                  setDni(formattedDNI);
                  validateDNI(formattedDNI);
                }}
                maxLength={9}
                keyboardType="numeric"
              />
            </View>
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
              <Text style={[styles.inputLabel, isDarkMode ? styles.darkText : styles.lightText]}>Fecha de nacimiento</Text>
              <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholderTextColor={isDarkMode ? '#777' : '#999'}
                value={birthDate}
                onChangeText={(text) => {
                  const formattedDate = formatBirthDate(text);
                  setBirthDate(formattedDate);
                  validateBirthDate(formattedDate);
                }}
                maxLength={10}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
              />
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Siguiente</Text>
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
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  cancelButton: {
    padding: 5,
  },
  cancelText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 20, 
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 8,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    padding: 20,
  },
  nextButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextButtonText: {
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
    marginBottom: 15, 
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 3, 
    fontWeight: '600',
  },
});

export default Register;