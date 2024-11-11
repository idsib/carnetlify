import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, useColorScheme, Image, Dimensions } from 'react-native';
import Splash from '../../components/Splash';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { useFonts } from 'expo-font';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const MainMenu = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Archivo': require('../../assets/fonts/Archivo-Bold.ttf'),
  });

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
      <MotiView 
        style={styles.content}
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 1000 }}
      >
        <MotiView
          from={{ translateY: -50, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 300 }}
        >
          <MotiView style={styles.logoContainer}>
            <BlurView intensity={50} style={styles.blurContainer}>
              <Image
                source={require('../../assets/images/carnetlify.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </BlurView>
            
            <View style={styles.brandTextContainer}>
              {'CARNETLIFY'.split('').map((letter, index) => (
                <MotiText
                  key={index}
                  style={[styles.brandText]}
                  from={{
                    opacity: 0,
                    translateY: 20,
                  }}
                  animate={{
                    opacity: 1,
                    translateY: 0,
                  }}
                  transition={{
                    type: 'timing',
                    duration: 500,
                    delay: 300 + (index * 100),
                  }}
                >
                  {letter}
                </MotiText>
              ))}
            </View>
          </MotiView>
        </MotiView>

        <MotiView
          from={{ translateX: -100, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 500 }}
        >
          <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
            Prepárate para tu examen de conducir con Carnetlify
          </Text>
        </MotiView>
        
        <MotiView 
          style={styles.buttonContainer}
          from={{ translateY: 100, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 700 }}
        >
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
            onPress={() => router.push('/(auth)/registerMongo')}
          >
            <Text style={styles.createAccountButtonText}>Crear cuenta</Text>
          </TouchableOpacity>
        </MotiView>
        
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', delay: 1000, duration: 500 }}
        >
          <Text style={[styles.termsText, isDarkMode ? styles.darkText : styles.lightText]}>
            Al registrarte, aceptas los <Text style={styles.linkText}>Términos de servicio</Text> y la <Text style={styles.linkText}>Política de privacidad</Text>, incluida la política de <Text style={styles.linkText}>Uso de Cookies</Text>.
          </Text>
        </MotiView>
        
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', delay: 1200, duration: 500 }}
        >
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={[styles.loginText, isDarkMode ? styles.darkText : styles.lightText]}>
              ¿Ya tienes una cuenta? <Text style={styles.linkText}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </MotiView>
      </MotiView>
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
    paddingHorizontal: width < 380 ? 20 : 30,
    paddingTop: width < 380 ? 30 : 50,
    paddingBottom: width < 380 ? 15 : 20,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width < 380 ? 150 : 200,
    height: width < 380 ? 150 : 200,
    marginBottom: width < 380 ? 5 : 10,
  },
  title: {
    fontSize: width < 380 ? 20 : 23,
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
    fontSize: width < 380 ? 16 : 18,
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
  brandTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
    marginBottom: 25,
  },
  brandText: {
    fontFamily: 'Archivo',
    fontSize: width < 380 ? 32 : 40,
    color: '#1DA1F2',
    letterSpacing: width < 380 ? 2 : 3,
    textShadowColor: 'rgba(29, 161, 242, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textTransform: 'uppercase',
  },
  blurContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default MainMenu;
