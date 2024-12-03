import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

// Configuración inicial para las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotifications = () => {
  // Estados para almacenar el token y las notificaciones
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification>();
  
  // Referencias para los listeners de notificaciones
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  // Función para registrar el dispositivo para notificaciones push
  async function registerForPushNotificationsAsync() {
    // Configuración específica para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Verificar si es un dispositivo físico
    if (Device.isDevice) {
      // Solicitar permisos de notificaciones
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('No se obtuvieron permisos para las notificaciones');
        return null;
      }

      // Obtener token de Firebase
      const token = await messaging().getToken();
      setFcmToken(token);
      return token;
    }

    console.log('Las notificaciones físicas requieren un dispositivo físico');
    return null;
  }

  // Función para enviar notificaciones push
  const sendPushNotification = async (token: string, title: string, body: string, data?: any) => {
    if (!token) {
      console.log('No hay token FCM disponible');
      return null;
    }

    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${process.env.FIREBASE_SERVER_KEY}`,
        },
        body: JSON.stringify({
          to: token,
          notification: { 
            title, 
            body,
            android: {
              priority: 'high',
              sound: 'default',
              notification: {
                icon: '@mipmap/ic_launcher',
                color: '#000000'
              }
            }
          },
          data: data || {},
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error al enviar notificación push:', error);
      return null;
    }
  };

  // Función para enviar una notificación de prueba
  const sendTestNotification = async () => {
    if (!fcmToken) {
      console.log('No hay token FCM disponible');
      return;
    }

    try {
      await sendPushNotification(
        fcmToken, 
        'Notificación de Prueba', 
        'Esta es una notificación de prueba de tu aplicación'
      );
    } catch (error) {
      console.error('Error al enviar notificación de prueba:', error);
    }
  };

  // Función para programar una notificación local
  const scheduleLocalNotification = async (
    title: string,
    body: string,
    seconds: number = 1,
    data: any = {}
  ) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: { seconds },
      });
    } catch (error) {
      console.error('Error al programar notificación local:', error);
    }
  };

  // Efecto para configurar los listeners de notificaciones
  useEffect(() => {
    registerForPushNotificationsAsync();

    // Configurar listener para notificaciones recibidas
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        setNotification(notification);
      }
    );

    // Configurar listener para respuesta a notificaciones
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Respuesta de notificación:', response);
      }
    );

    // Limpiar listeners al desmontar
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { 
    fcmToken, 
    notification, 
    sendPushNotification,
    sendTestNotification,
    scheduleLocalNotification 
  };
};
