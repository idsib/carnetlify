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
  Button
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useNotifications } from '../../../hooks/useNotifications';
import * as Notifications from 'expo-notifications';
import { Linking } from 'react-native';

const NotificationsPage = () => {
  const isDark = useColorScheme() === 'dark';
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

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    const isEnabled = status === 'granted';
    setPracticeEnabled(isEnabled);
    setTestsEnabled(isEnabled);
    setOffersEnabled(isEnabled);
  };

  const handleToggleNotification = async (
    type: 'practice' | 'tests' | 'offers',
    currentValue: boolean,
    setter: (value: boolean) => void
  ) => {
    try {
      if (!currentValue) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          setter(true);
          // Schedule a test notification when enabling practice notifications
          if (type === 'practice') {
            await scheduleLocalNotification(
              'Recordatorio de Práctica',
              '¡No olvides tu próxima clase de práctica!',
              5,
              { type: 'practice' }
            );
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
        } else {
          Linking.openSettings();
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
      if (fcmToken) {
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

  const onSendLocalNotification = async () => {
    try {
      await scheduleLocalNotification(
        'Notificación Local',
        '¡Esta es una notificación local de prueba!',
        5,
        { type: 'test' }
      );
      Alert.alert('Éxito', 'Notificación local programada');
    } catch (error) {
      console.error('Error scheduling local notification:', error);
      Alert.alert('Error', 'No se pudo programar la notificación local');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <Link href="../profile" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={isDark ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </Link>
        <Text style={[styles.title, isDark && styles.darkText]}>Notificaciones</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
          Preferencias de Notificación
        </Text>

        <View style={[styles.section, isDark && styles.darkSection]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name="car" 
                size={24} 
                color={isDark ? '#3478F6' : '#007AFF'} 
                style={styles.settingIcon}
              />
              <View style={styles.textContainer}>
                <Text style={[styles.settingTitle, isDark && styles.darkText]}>
                  Recordatorios de Práctica
                </Text>
                <Text style={[styles.settingDescription, isDark && styles.darkSettingDescription]}>
                  Recibe recordatorios sobre tus clases programadas
                </Text>
              </View>
            </View>
            <Switch
              style={styles.switch}
              trackColor={{ false: '#767577', true: '#3478F6' }}
              thumbColor={practiceEnabled ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => handleToggleNotification('practice', practiceEnabled, setPracticeEnabled)}
              value={practiceEnabled}
            />
          </View>
        </View>

        <View style={[styles.section, isDark && styles.darkSection]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name="document-text" 
                size={24} 
                color={isDark ? '#3478F6' : '#007AFF'} 
                style={styles.settingIcon}
              />
              <View style={styles.textContainer}>
                <Text style={[styles.settingTitle, isDark && styles.darkText]}>
                  Actualizaciones de Tests
                </Text>
                <Text style={[styles.settingDescription, isDark && styles.darkSettingDescription]}>
                  Notificaciones sobre nuevos tests y resultados
                </Text>
              </View>
            </View>
            <Switch
              style={styles.switch}
              trackColor={{ false: '#767577', true: '#3478F6' }}
              thumbColor={testsEnabled ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => handleToggleNotification('tests', testsEnabled, setTestsEnabled)}
              value={testsEnabled}
            />
          </View>
        </View>

        <View style={[styles.section, isDark && styles.darkSection]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name="pricetag" 
                size={24} 
                color={isDark ? '#3478F6' : '#007AFF'} 
                style={styles.settingIcon}
              />
              <View style={styles.textContainer}>
                <Text style={[styles.settingTitle, isDark && styles.darkText]}>
                  Ofertas y Promociones
                </Text>
                <Text style={[styles.settingDescription, isDark && styles.darkSettingDescription]}>
                  Recibe ofertas especiales y descuentos
                </Text>
              </View>
            </View>
            <Switch
              style={styles.switch}
              trackColor={{ false: '#767577', true: '#3478F6' }}
              thumbColor={offersEnabled ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => handleToggleNotification('offers', offersEnabled, setOffersEnabled)}
              value={offersEnabled}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={onSendPushNotification}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Enviar Notificación Push</Text>
            )}
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity 
            style={styles.button} 
            onPress={onSendLocalNotification}
          >
            <Text style={styles.buttonText}>Enviar Notificación Local</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footerText, isDark && styles.darkFooterText]}>
          Puedes cambiar estas preferencias en cualquier momento. Las notificaciones te ayudarán a mantenerte al día con tu progreso y no perderte información importante.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  darkHeader: {
    backgroundColor: '#000000',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkSection: {
    backgroundColor: '#1C1C1E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
    flexWrap: 'wrap',
  },
  darkSettingDescription: {
    color: '#8E8E93',
  },
  switch: {
    marginLeft: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  darkFooterText: {
    color: '#8E8E93',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  separator: {
    height: 12,
  }
});

export default NotificationsPage;