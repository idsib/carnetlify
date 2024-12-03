import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TabBar from '../../components/TabBar';
import LogoutPopup from '../../components/LogoutPopup';

//backend
import {logOutFirebase} from '@/backend/firebase/logOut';
import {getFullInfoUser} from '@/backend/firebase/InfoUserCurrentUser';
import {fullInfoFirebase} from '@/backend/firebase/InfoUserOnAuthStateChanged';
import {nameUserMongo} from '@/backend/firebase/config'
import {SetUidFirebase} from "@/backend/mainBackend";
//import {infoUserInterficie} from "@/backend/interficie"
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

SetUidFirebase()

let userInfo: any;

onAuthStateChanged(auth, (user) => {

  if (user) {
      
    nameUserMongo(localStorage.getItem("uid")).then((user) => {

      userInfo = user;
    
    })
      

  } else  {
      console.log("no hay un usuario registrado")
  }
})






//finBackend

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
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogout = async () => {
    try {
      await logOutFirebase();
      setShowLogoutPopup(false);
      // Navegar a la pantalla de login o inicio
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>Perfil</Text>

      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          style={[styles.profileCard, isDark ? styles.profileCardDark : styles.profileCardLight]}
          onPress={() => router.push('/sections/profileSettings')}
        >
          <Image
            source={require('@/assets/images/default-avatar.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, isDark ? styles.textDark : styles.textLight]}>
              {userInfo.fullName}
            </Text>
            <Text style={[styles.profileLink, isDark ? styles.textDark : styles.textLight]}>
              Ver perfil
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDark ? '#666666' : '#999999'} />
        </TouchableOpacity>
        
        <View style={styles.section}>
          <SectionTitle title="Ajustes" />
          <MenuItem
            icon="person-circle"
            title="Información personal"
            onPress={() => router.push('/sections/personalInfo')}
          />
          <MenuItem
            icon="card"
            title="Método de pago"
            onPress={() => router.push('/sections/paymethod')}
          />
          <MenuItem
            icon="notifications"
            title="Notificaciones"
            onPress={() => router.push('/sections/notifications')}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Profesores" />
          <MenuItem
            icon="school"
            title="Conviértete en profesor"
            onPress={() => router.push('/sections/teacher')}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Subscripción" />
          <MenuItem
            icon="pricetag"
            title="Escoge tu plan"
            onPress={() => router.push('/sections/subscriptionPlan')}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Soporte" />
          <MenuItem
            icon="help-circle"
            title="Preguntas frecuentes"
            onPress={() => router.push('/sections/faq')}
          />
          <MenuItem
            icon="chatbubble-ellipses"
            title="Contactar con soporte"
            onPress={() => router.push('/sections/support')}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Cuenta" />
          <View style={styles.menuSection}>
            <MenuItem
              icon="log-out"
              title="Cerrar Sesión"
              onPress={() => setShowLogoutPopup(true)}
            />
          </View>
        </View>
      </ScrollView>

      <LogoutPopup
        visible={showLogoutPopup}
        onLogout={handleLogout}
        onCancel={() => setShowLogoutPopup(false)}
      />
      
      <TabBar />
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
  button: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonLight: {
    backgroundColor: '#007BFF',
  },
  buttonDark: {
    backgroundColor: '#1E90FF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
  textLight: {
    color: '#000000',
  },
  textDark: {
    color: '#FFFFFF',
  },
  menuSection: {
    marginBottom: 24,
  },
});