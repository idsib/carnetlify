import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Switch,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../../hooks/useNotifications';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NotificationsPage = () => {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get('window');
  const isSmallDevice = height < 700;
  const { 
    fcmToken, 
    notification, 
    sendTestNotification, 
    scheduleLocalNotification 
  } = useNotifications();
  const [practiceEnabled, setPracticeEnabled] = useState(false);
  const [testsEnabled, setTestsEnabled] = useState(false);
  const [offersEnabled, setOffersEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    checkDeviceSupport();
    checkNotificationPermissions();
  }, []);

  const checkDeviceSupport = async () => {
    if (Platform.OS === 'web') {
      if (!('Notification' in window)) {
        setIsSupported(false);
        return;
      }
    } else {
      const isDevice = await Device.isDevice;
      setIsSupported(isDevice);
    }
  };

  const checkNotificationPermissions = async () => {
    if (Platform.OS === 'web') {
      if ('Notification' in window) {
        const permission = await window.Notification.requestPermission();
        const isEnabled = permission === 'granted';
        setPracticeEnabled(isEnabled);
        setTestsEnabled(isEnabled);
        setOffersEnabled(isEnabled);
      }
    } else {
      const { status } = await Notifications.getPermissionsAsync();
      const isEnabled = status === 'granted';
      setPracticeEnabled(isEnabled);
      setTestsEnabled(isEnabled);
      setOffersEnabled(isEnabled);
    }
  };

  const handleToggleNotification = async (
    type: 'practice' | 'tests' | 'offers',
    currentValue: boolean,
    setter: (value: boolean) => void
  ) => {
    try {
      if (!currentValue) {
        if (Platform.OS === 'web') {
          if ('Notification' in window) {
            const permission = await window.Notification.requestPermission();
            if (permission === 'granted') {
              setter(true);
              if (type === 'practice') {
                new window.Notification('Carnetlify', {
                  body: '¡Notificaciones activadas correctamente!',
                });
              }
            }
          }
        } else {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status === 'granted') {
            setter(true);
            if (type === 'practice') {
              await scheduleLocalNotification(
                'Recordatorio de Práctica',
                '¡No olvides tu próxima clase de práctica!',
                5,
                { type: 'practice' }
              );
            }
          }
        }
      } else {
        if (Platform.OS === 'ios') {
          Alert.alert(
            'Desactivar Notificaciones',
            'Para desactivar las notificaciones, ve a Configuración > Notificaciones > Carnetlify',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Abrir Configuración', onPress: () => Linking.openSettings() }
            ]
          );
        } else if (Platform.OS === 'android') {
          Linking.openSettings();
        } else {
          setter(false);
        }
      }
    } catch (error) {
      console.error('Error toggling notification:', error);
      Alert.alert('Error', 'No se pudieron configurar las notificaciones');
    }
  };

  const onSendPushNotification = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        if ('Notification' in window && Notification.permission === 'granted') {
          new window.Notification('Carnetlify Test', {
            body: 'Esta es una notificación de prueba',
          });
        }
      } else if (fcmToken) {
        await sendTestNotification();
        Alert.alert('Éxito', 'Notificación enviada correctamente');
      } else {
        Alert.alert('Error', 'No se pudo obtener el token de notificaciones');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'No se pudo enviar la notificación');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        <View style={styles.content}>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Notificaciones no soportadas
          </Text>
          <Text style={[styles.description, isDark && styles.darkText]}>
            Tu dispositivo no soporta notificaciones. Por favor, usa un dispositivo físico o un navegador compatible.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
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
        <Text style={[styles.title, isDark && styles.darkText]}>
          Notificaciones
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, isDark && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            Preferencias
          </Text>
          
          <View style={[styles.optionContainer, isDark && styles.darkBorder]}>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, isDark && styles.darkText]}>
                Prácticas
              </Text>
              <Text style={[styles.optionDescription, isDark && styles.darkSecondaryText]}>
                Recordatorios de prácticas y clases
              </Text>
            </View>
            <Switch
              value={practiceEnabled}
              onValueChange={(value) => 
                handleToggleNotification('practice', practiceEnabled, setPracticeEnabled)
              }
              trackColor={{ false: isDark ? '#3A3A3C' : '#D1D1D6', true: '#34C759' }}
              thumbColor={practiceEnabled ? '#FFFFFF' : isDark ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={isDark ? '#3A3A3C' : '#D1D1D6'}
            />
          </View>

          <View style={[styles.optionContainer, isDark && styles.darkBorder]}>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, isDark && styles.darkText]}>
                Tests
              </Text>
              <Text style={[styles.optionDescription, isDark && styles.darkSecondaryText]}>
                Alertas de nuevos tests disponibles
              </Text>
            </View>
            <Switch
              value={testsEnabled}
              onValueChange={(value) =>
                handleToggleNotification('tests', testsEnabled, setTestsEnabled)
              }
              trackColor={{ false: isDark ? '#3A3A3C' : '#D1D1D6', true: '#34C759' }}
              thumbColor={testsEnabled ? '#FFFFFF' : isDark ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={isDark ? '#3A3A3C' : '#D1D1D6'}
            />
          </View>

          <View style={[styles.optionContainer, isDark && styles.darkBorder]}>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, isDark && styles.darkText]}>
                Ofertas
              </Text>
              <Text style={[styles.optionDescription, isDark && styles.darkSecondaryText]}>
                Promociones y ofertas especiales
              </Text>
            </View>
            <Switch
              value={offersEnabled}
              onValueChange={(value) =>
                handleToggleNotification('offers', offersEnabled, setOffersEnabled)
              }
              trackColor={{ false: isDark ? '#3A3A3C' : '#D1D1D6', true: '#34C759' }}
              thumbColor={offersEnabled ? '#FFFFFF' : isDark ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={isDark ? '#3A3A3C' : '#D1D1D6'}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.testButton,
            isDark && styles.darkButton,
            isLoading && styles.disabledButton
          ]}
          onPress={onSendPushNotification}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.testButtonText}>
              Probar Notificaciones
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  backButton: {
    padding: 8,
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
  darkSecondaryText: {
    color: '#8E8E93',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  darkSection: {
    backgroundColor: '#1C1C1E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  darkBorder: {
    borderBottomColor: '#38383A',
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  testButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  darkButton: {
    backgroundColor: '#0A84FF',
  },
  disabledButton: {
    opacity: 0.7,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default NotificationsPage;