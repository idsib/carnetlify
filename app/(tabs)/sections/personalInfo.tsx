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

const PersonalInfoPage = () => {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get('window');
  const isSmallDevice = height < 700;
  const isLargeScreen = width > 768;

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
      padding: 16,
      marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerTitle: {
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginLeft: 8,
      fontSize: isLargeScreen ? 24 : (isSmallDevice ? 20 : 22),
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
    saveButton: {
      backgroundColor: '#007AFF',
      borderRadius: 12,
      padding: isSmallDevice ? 14 : 16,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: insets.bottom + (isSmallDevice ? 12 : 16),
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

  const renderInput = (label: string, key: keyof typeof formData, keyboardType: 'default' | 'numeric' | 'phone-pad' = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[key]}
        onChangeText={(text) => setFormData(prev => ({ ...prev, [key]: text }))}
        placeholderTextColor={isDark ? '#666666' : '#999999'}
        keyboardType={keyboardType}
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
          <Link href="/(tabs)/profile" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={isDark ? '#FFFFFF' : '#000000'} 
              />
            </TouchableOpacity>
          </Link>
          <Text style={styles.headerTitle}>Información Personal</Text>
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
          {renderInput('Teléfono', 'telefono')}

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => {
              // Lógica para guardar
            }}
          >
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PersonalInfoPage;