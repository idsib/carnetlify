import React, { useState } from 'react';
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
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DrivingInstructorRegistration = () => {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get('window');
  const isSmallDevice = height < 700;

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    documento: '',
    telefono: '',
    experiencia: '',
    tipoLicencia: '',
    disponibilidad: '',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    containerLight: {
      backgroundColor: '#F5F5F5',
    },
    containerDark: {
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
    content: {
      flex: 1,
      padding: 16,
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
      padding: 16,
      fontSize: isSmallDevice ? 14 : 16,
      color: isDark ? '#FFFFFF' : '#000000',
      minHeight: 48,
    },
    saveButton: {
      backgroundColor: '#007AFF',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 24,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: isSmallDevice ? 14 : 16,
      fontWeight: 'bold',
    },
  });

  const renderInput = (label: string, key: keyof typeof formData) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[key]}
        onChangeText={(text) => setFormData(prev => ({ ...prev, [key]: text }))}
        placeholderTextColor={isDark ? '#666666' : '#999999'}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
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
          <Text style={[styles.title, isDark && styles.darkText]}>Registro de Instructor</Text>
        </View>

        <ScrollView style={styles.content}>
          {renderInput('Nombre', 'nombre')}
          {renderInput('Apellidos', 'apellidos')}
          {renderInput('Documento de Identificación', 'documento')}
          {renderInput('Teléfono', 'telefono')}
          {renderInput('Experiencia (años)', 'experiencia')}
          {renderInput('Tipo de Licencia', 'tipoLicencia')}
          {renderInput('Disponibilidad', 'disponibilidad')}

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => {
              // Lógica para guardar la inscripción
            }}
          >
            <Text style={styles.saveButtonText}>Enviar Inscripción</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DrivingInstructorRegistration;