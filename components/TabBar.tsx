import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TabBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isDark = useColorScheme() === 'dark';

  const tabs = [
    { name: 'home', title: 'Inicio', path: '/main' },
    { name: 'calendar', title: 'Reservar', path: '/calendar' },
    { name: 'chatbubbles', title: 'Mensajes', path: '/messages' },
    { name: 'person', title: 'Perfil', path: '/profile' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <View style={[styles.tabBar, isDark ? styles.tabBarDark : styles.tabBarLight]}>
      {tabs.map((tab) => (
        <TouchableOpacity 
          key={tab.path}
          style={styles.tabBarItem}
          onPress={() => router.push(tab.path as any)}
        >
          <Ionicons 
            name={tab.name as any} 
            size={24} 
            color={isActive(tab.path) 
              ? (isDark ? "#3478F6" : "#007AFF")
              : (isDark ? "#FFFFFF" : "#666")} 
          />
          <Text 
            style={[
              styles.tabBarText, 
              isActive(tab.path)
                ? { color: isDark ? "#3478F6" : "#007AFF" }
                : isDark ? styles.textDark : styles.textLight
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  tabBarLight: {
    backgroundColor: '#FFFFFF',
  },
  tabBarDark: {
    backgroundColor: '#1C1C1E',
  },
  tabBarItem: {
    alignItems: 'center',
  },
  tabBarText: {
    fontSize: 12,
    marginTop: 4,
  },
  textLight: {
    color: '#666',
  },
  textDark: {
    color: '#FFFFFF',
  },
});

export default TabBar; 