import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  useColorScheme, 
  Platform, 
  StatusBar, 
  Dimensions,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAuth } from "firebase/auth";
import { getUserByUID } from '@/backend/firebase/config';
import { useUser } from '@/context/UserContext';

const { height, width } = Dimensions.get('window');
const isSmallDevice = height < 700;
const isLargeScreen = width > 768;

//backEnd
import {updateUserProfile} from '@/backend/firebase/updateUser'
//finBackEnd

const PersonalInfoPage = () => {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const auth = getAuth();
  const { userInfo, updateUserInfo } = useUser();

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    documento: '',
    edad: '',
    pais: '',
    provincia: '',
    ciudad: '',
    codigoPostal: '',
    domicilio: '',
    telefono: ''
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellidos: '',
    documento: '',
    edad: '',
    pais: '',
    provincia: '',
    ciudad: '',
    codigoPostal: '',
    domicilio: '',
    telefono: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const userData = await getUserByUID(uid);
        if (userData) {
          setFormData({
            nombre: userData.fullName || '',
            apellidos: userData.lastName || '',
            documento: userData.dni || '',
            edad: userData.age ? userData.age.toString() : '',
            pais: userData.country || '',
            provincia: userData.province || '',
            ciudad: userData.city || '',
            codigoPostal: userData.postalCode || '',
            domicilio: userData.home || '',
            telefono: userData.phone || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validación del nombre (requerido)
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(formData.nombre)) {
      newErrors.nombre = 'El nombre debe contener solo letras y tener entre 2 y 50 caracteres';
      isValid = false;
    } else {
      newErrors.nombre = '';
    }

    // Validación de apellidos (requerido)
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(formData.apellidos)) {
      newErrors.apellidos = 'Los apellidos deben contener solo letras y tener entre 2 y 50 caracteres';
      isValid = false;
    } else {
      newErrors.apellidos = '';
    }

    // Validación del documento (requerido)
    if (!formData.documento.trim()) {
      newErrors.documento = 'El documento es requerido';
      isValid = false;
    } else if (!/^[A-Z0-9]{8,9}$/.test(formData.documento.toUpperCase())) {
      newErrors.documento = 'Formato de documento inválido (DNI: 8 números o NIE: 1 letra + 7 números)';
      isValid = false;
    } else {
      newErrors.documento = '';
    }

    // Validación de la edad (requerido)
    if (!formData.edad.trim()) {
      newErrors.edad = 'La edad es requerida';
      isValid = false;
    } else {
      const edad = parseInt(formData.edad);
      if (isNaN(edad) || edad < 18 || edad > 100) {
        newErrors.edad = 'La edad debe estar entre 18 y 100 años';
        isValid = false;
      } else {
        newErrors.edad = '';
      }
    }

    // Validación del país (requerido)
    if (!formData.pais.trim()) {
      newErrors.pais = 'El país es requerido';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(formData.pais)) {
      newErrors.pais = 'País inválido';
      isValid = false;
    } else {
      newErrors.pais = '';
    }

    // Validación de la provincia (requerido)
    if (!formData.provincia.trim()) {
      newErrors.provincia = 'La provincia es requerida';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(formData.provincia)) {
      newErrors.provincia = 'Provincia inválida';
      isValid = false;
    } else {
      newErrors.provincia = '';
    }

    // Validación de la ciudad (requerido)
    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(formData.ciudad)) {
      newErrors.ciudad = 'Ciudad inválida';
      isValid = false;
    } else {
      newErrors.ciudad = '';
    }

    // Validación del código postal (requerido)
    if (!formData.codigoPostal.trim()) {
      newErrors.codigoPostal = 'El código postal es requerido';
      isValid = false;
    } else if (!/^\d{5}$/.test(formData.codigoPostal)) {
      newErrors.codigoPostal = 'El código postal debe tener 5 dígitos';
      isValid = false;
    } else {
      newErrors.codigoPostal = '';
    }

    // Validación del domicilio (requerido)
    if (!formData.domicilio.trim()) {
      newErrors.domicilio = 'El domicilio es requerido';
      isValid = false;
    } else if (formData.domicilio.length < 5 || formData.domicilio.length > 100) {
      newErrors.domicilio = 'El domicilio debe tener entre 5 y 100 caracteres';
      isValid = false;
    } else {
      newErrors.domicilio = '';
    }

    // Validación del teléfono (requerido)
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
      isValid = false;
    } else if (!/^\d{9}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos';
      isValid = false;
    } else {
      newErrors.telefono = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor, corrija los errores en el formulario');
      return;
    }

    try {
      setLoading(true);
      await updateUserProfile(
        formData.nombre,
        formData.documento,
        formData.edad,
        formData.pais,
        formData.provincia,
        formData.ciudad,
        formData.codigoPostal,
        formData.domicilio,
        formData.telefono
      );

      // Update the user context
      updateUserInfo({
        fullName: formData.nombre,
        dni: formData.documento,
        age: formData.edad,
        country: formData.pais,
        province: formData.provincia,
        city: formData.ciudad,
        postalCode: formData.codigoPostal,
        home: formData.domicilio,
        phone: formData.telefono
      });
      
      Alert.alert('Éxito', 'Datos actualizados correctamente');
      router.replace('/sections/paymethod');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label: string, key: keyof typeof formData, keyboardType: 'default' | 'numeric' | 'phone-pad' = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[key] ? styles.inputError : null]}
        value={formData[key]}
        onChangeText={(text) => {
          setFormData(prev => ({ ...prev, [key]: text }));
          if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: '' }));
          }
        }}
        placeholderTextColor={isDark ? '#666666' : '#999999'}
        keyboardType={keyboardType}
      />
      {errors[key] ? (
        <Text style={styles.errorText}>{errors[key]}</Text>
      ) : null}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#F5F5F5',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    title: {
      fontSize: isLargeScreen ? 24 : (isSmallDevice ? 20 : 22),
      fontWeight: '600',
      marginLeft: 8,
      color: isDark ? '#FFFFFF' : '#000000',
    },
    darkText: {
      color: '#FFFFFF',
    },
    backButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      padding: isLargeScreen ? 24 : 16,
    },
    inputContainer: {
      marginBottom: isSmallDevice ? 12 : 16,
    },
    label: {
      fontSize: isSmallDevice ? 14 : 16,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: isSmallDevice ? 6 : 8,
      paddingLeft: 4,
    },
    input: {
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 12,
      padding: Platform.select({
        ios: isSmallDevice ? 12 : 16,
        android: isSmallDevice ? 10 : 14,
        default: 16,
      }),
      fontSize: isSmallDevice ? 14 : 16,
      color: isDark ? '#FFFFFF' : '#000000',
      minHeight: Platform.select({
        ios: isSmallDevice ? 40 : 48,
        android: isSmallDevice ? 38 : 46,
        default: 48,
      }),
      borderWidth: 1,
      borderColor: 'transparent',
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
    inputError: {
      borderColor: '#FF3B30',
    },
    errorText: {
      color: '#FF3B30',
      fontSize: 12,
      marginTop: 4,
      paddingLeft: 4,
    },
    saveButton: {
      backgroundColor: '#007AFF',
      borderRadius: 12,
      padding: isSmallDevice ? 14 : 16,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: insets.bottom + (isSmallDevice ? 12 : 16),
    },
    saveButtonDisabled: {
      backgroundColor: '#999999',
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: isSmallDevice ? 14 : 16,
      fontWeight: 'bold',
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: insets.bottom + 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Link href="/(tabs)/profile" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={isDark ? '#FFFFFF' : '#000000'} 
              />
            </TouchableOpacity>
          </Link>
          <Text style={[styles.title, isDark && styles.darkText]}>Información Personal</Text>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderInput('Nombre', 'nombre')}
          {renderInput('Apellidos', 'apellidos')}
          {renderInput('Documento de Identificación', 'documento')}
          {renderInput('Edad', 'edad', 'numeric')}
          {renderInput('País', 'pais')}
          {renderInput('Provincia', 'provincia')}
          {renderInput('Ciudad', 'ciudad')}
          {renderInput('Código Postal', 'codigoPostal', 'numeric')}
          {renderInput('Domicilio', 'domicilio')}
          {renderInput('Teléfono', 'telefono', 'phone-pad')}

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PersonalInfoPage;