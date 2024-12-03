import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useRouter, usePathname } from 'expo-router';

type IconName = ComponentProps<typeof Ionicons>['name'];

const menuItems: Array<{ icon: IconName; activeIcon: IconName; label: string; path: string }> = [
  { 
    icon: 'home-outline',
    activeIcon: 'home',
    label: 'Inicio',
    path: '/main'
  },
  { 
    icon: 'calendar-outline',
    activeIcon: 'calendar',
    label: 'Calendario',
    path: '/calendar'
  },
  { 
    icon: 'chatbubbles-outline',
    activeIcon: 'chatbubbles',
    label: 'Mensajes',
    path: '/messages'
  },
  { 
    icon: 'person-outline',
    activeIcon: 'person',
    label: 'Perfil',
    path: '/profile'
  },
];

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = 280;

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Image
              source={require('../assets/images/carnetlify.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <TouchableOpacity
                  key={item.path}
                  style={[styles.menuItem, isDark ? styles.menuItemDark : styles.menuItemLight]}
                  onPress={() => {
                    router.push(item.path as any);
                    onClose?.();
                  }}
                >
                  <Ionicons 
                    name={isActive ? item.activeIcon : item.icon} 
                    size={26} 
                    color={isActive 
                      ? (isDark ? "#3478F6" : "#007AFF")
                      : (isDark ? "#FFFFFF" : "#000000")
                    } 
                  />
                  <Text 
                    style={[
                      styles.menuText, 
                      isDark ? styles.textDark : styles.textLight,
                      isActive && (isDark ? styles.activeTextDark : styles.activeTextLight)
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'relative',
    width: SIDEBAR_WIDTH,
    height: '100%',
  },
  container: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    borderRightWidth: 1,
  },
  containerLight: {
    backgroundColor: '#F5F5F5',
    borderRightColor: '#E0E0E0',
  },
  containerDark: {
    backgroundColor: '#000000',
    borderRightColor: '#2F2F2F',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    paddingLeft: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  menuContainer: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 24,
    marginBottom: 4,
  },
  menuItemLight: {
    backgroundColor: 'transparent',
  },
  menuItemDark: {
    backgroundColor: 'transparent',
  },
  menuText: {
    fontSize: 20,
    marginLeft: 16,
  },
  textLight: {
    color: '#000000',
  },
  textDark: {
    color: '#FFFFFF',
  },
  activeTextDark: {
    color: '#3478F6'
  },
  activeTextLight: {
    color: '#007AFF'
  },
  postButton: {
    margin: 16,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  postButtonLight: {
    backgroundColor: '#007BFF',
  },
  postButtonDark: {
    backgroundColor: '#1E90FF',
  },
  postButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
