import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Platform, ViewStyle } from 'react-native';
import { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const getTabBarStyle = (): ViewStyle => ({
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    borderTopColor: isDarkMode ? '#1C1C1E' : '#E5E5EA',
    ...(Platform.OS === 'web' && {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: 20,
      height: 65,
    }),
  });

  const renderTabIcon = (name: IconName, focused: boolean) => (
    <Ionicons 
      name={focused ? name : `${name}-outline` as IconName} 
      size={24} 
      color={focused ? '#007AFF' : isDarkMode ? '#8E8E93' : '#3C3C43'} 
    />
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDarkMode ? '#8E8E93' : '#3C3C43',
        headerShown: false,
        tabBarStyle: getTabBarStyle(),
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: Platform.OS === 'web' ? 10 : 0,
        },
      }}>
      <Tabs.Screen
        name="main"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => renderTabIcon('home', focused),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => renderTabIcon('person', focused),
        }}
      />
    </Tabs>
  );
}
