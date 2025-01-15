import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotifications = () => {
  const [notification, setNotification] = useState<Notifications.Notification>();
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
    
    const notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        setNotification(notification);
      }
    );

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'web') {
      return;
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      try {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: process.env.EXPO_PROJECT_ID || 'your-project-id',
        });
        setFcmToken(token.data);
      } catch (error) {
        console.log('Error getting push token:', error);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }
  };

  const sendTestNotification = async () => {
    if (Platform.OS === 'web') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Test Notification', {
          body: 'This is a test notification',
        });
        return;
      }
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Prueba de Notificación!",
        body: "Esta es una notificación de prueba",
        data: { type: 'test' },
      },
      trigger: null,
    });
  };

  const scheduleLocalNotification = async (
    title: string,
    body: string,
    seconds: number = 5,
    data: any = {}
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: {
        seconds,
      },
    });
  };

  return {
    notification,
    fcmToken,
    sendTestNotification,
    scheduleLocalNotification,
  };
};