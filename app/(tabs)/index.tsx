import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, useColorScheme } from 'react-native';

const MainMenu = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/carnetlify.png')}
          style={styles.logo}
        />
        <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Carnetlify</Text>
        <Text style={[styles.subtitle, isDarkMode ? styles.darkText : styles.lightText]}>Tu camino hacia el carnet de conducir</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={() => alert('Iniciar sesión')}>
            <Text style={[styles.buttonText, isDarkMode ? styles.darkButtonText : styles.lightButtonText]}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.signUpButton, isDarkMode ? styles.darkSignUpButton : styles.lightSignUpButton]} onPress={() => alert('Registrarse')}>
            <Text style={[styles.buttonText, styles.signUpText, isDarkMode ? styles.darkSignUpText : styles.lightSignUpText]}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  lightButton: {
    backgroundColor: '#405DE6',
  },
  darkButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  lightButtonText: {
    color: '#FFFFFF',
  },
  darkButtonText: {
    color: '#000000',
  },
  signUpButton: {
    borderWidth: 1,
  },
  lightSignUpButton: {
    borderColor: '#405DE6',
    backgroundColor: 'transparent',
  },
  darkSignUpButton: {
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  signUpText: {},
  lightSignUpText: {
    color: '#405DE6',
  },
  darkSignUpText: {
    color: '#FFFFFF',
  },
});

export default MainMenu;
