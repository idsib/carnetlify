import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress }) => {
  const isDark = useColorScheme() === 'dark';
  
  return (
    <TouchableOpacity 
      style={[styles.menuItem, isDark ? styles.menuItemDark : styles.menuItemLight]} 
      onPress={onPress}
    >
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={24} color={isDark ? '#FFFFFF' : '#000000'} />
      </View>
      <Text style={[styles.menuText, isDark ? styles.textDark : styles.textLight]}>{title}</Text>
      <Ionicons name="chevron-forward" size={24} color={isDark ? '#666666' : '#999999'} />
    </TouchableOpacity>
  );
};

const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
  const isDark = useColorScheme() === 'dark';
  
  return (
    <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
      {title}
    </Text>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>Perfil</Text>
      
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity 
          style={[styles.profileCard, isDark ? styles.profileCardDark : styles.profileCardLight]}
        >
          <Image
            source={require('@/assets/images/default-avatar.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, isDark ? styles.textDark : styles.textLight]}>
              Joel Jara
            </Text>
            <Text style={[styles.profileLink, isDark ? styles.textDark : styles.textLight]}>
              Ver perfil
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDark ? '#666666' : '#999999'} />
        </TouchableOpacity>

        <View style={styles.section}>
          <SectionTitle title="Ajustes" />
          <MenuItem icon="person-circle" title="Información personal" />
          <MenuItem icon="card" title="Método de pago" />
          <MenuItem icon="notifications" title="Notificaciones" />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Profesores" />
          <MenuItem icon="school" title="Conviértete en profesor" />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Subscripción" />
          <MenuItem icon="pricetag" title="Escoge tu plan" />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Soporte" />
          <MenuItem icon="help-circle" title="Preguntas frecuentes" />
          <MenuItem icon="chatbubble-ellipses" title="Contactar con soporte" />
          <MenuItem icon="log-out" title="Cerrar sesión" />
        </View>
      </ScrollView>

      <View style={[styles.tabBar, isDark ? styles.tabBarDark : styles.tabBarLight]}>
        <TouchableOpacity 
          style={styles.tabBarItem}
          onPress={() => router.push('/main')}
        >
          <Ionicons name="home" size={24} color={isDark ? "#FFFFFF" : "#666"} />
          <Text style={[styles.tabBarText, isDark ? styles.textDark : styles.textLight]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="calendar" size={24} color={isDark ? "#FFFFFF" : "#666"} />
          <Text style={[styles.tabBarText, isDark ? styles.textDark : styles.textLight]}>Reservar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="chatbubbles" size={24} color={isDark ? "#FFFFFF" : "#666"} />
          <Text style={[styles.tabBarText, isDark ? styles.textDark : styles.textLight]}>Mensajes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="person" size={24} color={isDark ? "#3478F6" : "#007AFF"} />
          <Text style={[styles.tabBarText, { color: isDark ? "#3478F6" : "#007AFF" }]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  profileCardLight: {
    backgroundColor: '#FFFFFF',
  },
  profileCardDark: {
    backgroundColor: '#1C1C1E',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E1E1E1',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileLink: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLight: {
    backgroundColor: '#FFFFFF',
  },
  menuItemDark: {
    backgroundColor: '#1C1C1E',
  },
  menuIconContainer: {
    width: 32,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
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
    color: '#666',
  },
  textLight: {
    color: '#000000',
  },
  textDark: {
    color: '#FFFFFF',
  },
});