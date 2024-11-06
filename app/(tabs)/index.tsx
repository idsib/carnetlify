import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, useColorScheme, Image, Dimensions } from 'react-native';
import Splash from '../../components/Splash';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const MainMenu = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Splash onFinish={() => setIsLoading(false)} />;
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/carnetlify.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
          Prepárate para tu examen de conducir con Carnetlify
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => alert('Continuar con Google')}>
            <AntDesign name="google" size={20} color="#000000" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Continuar con Google</Text>
          </TouchableOpacity>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={[styles.dividerText, isDarkMode ? styles.darkText : styles.lightText]}>o</Text>
            <View style={styles.dividerLine} />
          </View>
          <TouchableOpacity 
            style={styles.createAccountButton} 
            onPress={() => router.push('/(auth)/registerMongoo')}
          >
            <Text style={styles.createAccountButtonText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.termsText, isDarkMode ? styles.darkText : styles.lightText]}>
          Al registrarte, aceptas los <Text style={styles.linkText}>Términos de servicio</Text> y la <Text style={styles.linkText}>Política de privacidad</Text>, incluida la política de <Text style={styles.linkText}>Uso de Cookies</Text>.
        </Text>
        
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={[styles.loginText, isDarkMode ? styles.darkText : styles.lightText]}>
            ¿Ya tienes una cuenta? <Text style={styles.linkText}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20, 
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    maxWidth: 350,
    alignSelf: 'center',
    width: '100%',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E8ED',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
  createAccountButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
    maxWidth: 350,
    alignSelf: 'center',
    width: '100%',
  },
  createAccountButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#1DA1F2',
  },
  loginText: {
    fontSize: 14,
    marginTop: 20,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
});

export default MainMenu;
