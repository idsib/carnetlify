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
    icon: 'id-card-outline',
    activeIcon: 'id-card',
    label: 'Reservar',
    path: '/booking'
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
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Image
              source={require('../assets/images/logo-text-carnetlify.png')}
              style={[styles.logo, { tintColor: isDarkMode ? "#3478F6" : "#007AFF" }]}
              resizeMode="contain"
            />
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <TouchableOpacity
                  key={item.path}
                  style={[styles.menuItem, isDarkMode ? styles.menuItemDark : styles.menuItemLight]}
                  onPress={() => {
                    router.push(item.path as any);
                    onClose?.();
                  }}
                >
                  <Ionicons 
                    name={isActive ? item.activeIcon : item.icon} 
                    size={26} 
                    color={isActive 
                      ? (isDarkMode ? "#3478F6" : "#007AFF")
                      : (isDarkMode ? "#FFFFFF" : "#000000")
                    } 
                  />
                  <Text 
                    style={[
                      styles.menuText, 
                      isDarkMode ? styles.textDark : styles.textLight,
                      isActive && (isDarkMode ? styles.activeTextDark : styles.activeTextLight)
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
    backgroundColor: '#FFFFFF',
    borderRightColor: '#E0E0E0',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
    borderRightColor: '#2F2F2F',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
    paddingTop: 0,
    marginBottom: 0,
  },
  logo: {
    width: 250,
    height: 150,
  },
  menuContainer: {
    paddingTop: -80,
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
