import React from 'react';
import { View, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const isDark = useColorScheme() === 'dark';

  const tabs = [
    { name: 'home', icon: 'home', path: '/' },
    { name: 'search', icon: 'search', path: '/search' },
    { name: 'calendar', icon: 'calendar', path: '/calendar' },
    { name: 'profile', icon: 'person', path: '/profile' },
  ];

  return (
    <View style={[
      styles.container,
      isDark ? styles.containerDark : styles.containerLight
    ]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          onPress={() => router.push(tab.path as any)}
          style={styles.tab}
        >
          <Ionicons
            name={tab.icon as keyof typeof Ionicons.glyphMap}
            size={24}
            color={pathname === tab.path 
              ? (isDark ? '#FFFFFF' : '#000000')
              : (isDark ? '#666666' : '#999999')
            }
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    paddingBottom: 4,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 