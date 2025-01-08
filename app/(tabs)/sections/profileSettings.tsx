import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, StatusBar, Dimensions, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

//backend
import {getUserByUID} from '@/backend/firebase/config'
import {SetUidFirebase} from "@/backend/mainBackend";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {UserInfo} from "@/backend/interficie/UserInfoInterficie";
import Toast from '@/components/Toast';

const auth = getAuth();
SetUidFirebase();

//finBackend
const ProfileSettingsPage = () => {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get('window');
  const hasDynamicIsland = Platform.OS === 'ios' && height >= 852;
  const isSmallDevice = height < 700;
  const isTablet = width > 768;
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "null",
    fullName: "User Not Registered",
    userId: "null",
    plan: "null",
    isLocked: "true",
    profile_img: "https://drive.google.com/file/d/1ghxS5ymI1Je8SHSztVtkCxnKFbUQDqim/view?usp=drive_link"
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserByUID(localStorage.getItem("uid"))
          .then((userData) => {
            setUserInfo(userData);
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      } else {
        console.log("No user is registered");
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProfileImage = async (imageUri: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch('http://localhost:3000/updateProfileImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          profile_img: imageUri
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la imagen de perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showToast('Se necesitan permisos para acceder a la galería', 'error');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Reducido la calidad para optimizar el tamaño
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        
        // Verificar el tamaño de la imagen (aproximadamente)
        const response = await fetch(selectedImage.uri);
        const blob = await response.blob();
        const sizeInMB = blob.size / (1024 * 1024);

        if (sizeInMB > 40) {
          showToast('La imagen es demasiado grande. Por favor, selecciona una imagen más pequeña (menor a 40MB).', 'error');
          return;
        }
        
        try {
          // Actualizar en el backend
          await updateProfileImage(selectedImage.uri);
          
          // Si la actualización en el backend fue exitosa, actualizar el estado local
          setUserInfo(prev => ({
            ...prev,
            profile_img: selectedImage.uri
          }));
          
          showToast('Imagen de perfil actualizada correctamente');
        } catch (error) {
          console.error('Error al actualizar la imagen:', error);
          showToast('Error al actualizar la imagen de perfil. Asegúrate de que la imagen no sea demasiado grande.', 'error');
        }
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      showToast('Hubo un error al seleccionar la imagen', 'error');
    }
  };

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
    profileSection: {
      alignItems: 'center',
      marginTop: 20,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginTop: 16,
    },
    location: {
      fontSize: 16,
      color: '#666666',
      marginTop: 4,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 32,
      paddingHorizontal: 16,
    },
    statBox: {
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 8,
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
    statLabel: {
      fontSize: 14,
      color: '#666666',
      marginBottom: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    progressSection: {
      marginTop: 32,
      paddingHorizontal: 16,
    },
    progressTitle: {
      fontSize: 16,
      color: '#666666',
      marginBottom: 8,
    },
    progressBar: {
      height: 6,
      backgroundColor: isDark ? '#333333' : '#E0E0E0',
      borderRadius: 3,
      marginBottom: 24,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#007AFF',
      borderRadius: 3,
    },
    editIconContainer: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      backgroundColor: '#007AFF',
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: isDark ? '#000000' : '#FFFFFF',
    },
  });

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
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
          <Text style={[styles.title, isDark && styles.darkText]}>Configuración</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: userInfo.profile_img }}
                style={styles.profileImage}
              />
            <View style={styles.editIconContainer}>
              <Ionicons 
                name="camera" 
                size={20} 
                color="#FFFFFF" 
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{userInfo.fullName}</Text>
          <Text style={styles.location}>Badalona, Cataluña</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>EDAD</Text>
            <Text style={styles.statValue}>19 años</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>PAÍS</Text>
            <Text style={styles.statValue}>España</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>PRÁCTICAS</Text>
            <Text style={styles.statValue}>18</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Lecciones completadas</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '9%' }]} />
          </View>

          <Text style={styles.progressTitle}>Progreso teórico</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '7%' }]} />
          </View>

          <Text style={styles.progressTitle}>Progreso práctico</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '0%' }]} />
          </View>
        </View>
      </SafeAreaView>
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
};

export default ProfileSettingsPage;