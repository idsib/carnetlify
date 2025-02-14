import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabBar from '../../components/TabBar';
import LogoutPopup from '../../components/LogoutPopup';
import DeleteAccountPopup from '../../components/DeleteAccountPopup';

//backend
import {logOutFirebase} from '@/backend/firebase/logOut';
import {getUserByUID, changeStateLocked} from '@/backend/firebase/config';
import {SetUidFirebase} from "@/backend/firebase/setUidLocalStorage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {UserInfo} from "@/backend/interficie/UserInfoInterficie";
import { useUser } from '@/context/UserContext';

const auth = getAuth();
SetUidFirebase();

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress?: () => void;
  isLocked?: boolean;
  alwaysAccessible?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, isLocked, alwaysAccessible }) => {
  const isDark = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      style={[styles.menuItem, isDark ? styles.menuItemDark : styles.menuItemLight]}
      onPress={isLocked && !alwaysAccessible ? undefined : onPress}
      disabled={isLocked && !alwaysAccessible}
    >
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={24} color={isDark ? '#FFFFFF' : '#000000'} />
      </View>
      <Text style={[
        styles.menuText, 
        isDark ? styles.textDark : styles.textLight,
        isLocked && !alwaysAccessible && styles.lockedText
      ]}>
        {title}
      </Text>
      {isLocked && !alwaysAccessible ? (
        <Ionicons name="lock-closed" size={24} color={isDark ? '#666666' : '#999999'} />
      ) : (
        <Ionicons name="chevron-forward" size={24} color={isDark ? '#666666' : '#999999'} />
      )}
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
  const { unlocked } = useLocalSearchParams();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showDeleteAccountPopup, setShowDeleteAccountPopup] = useState(false);
  const { userInfo, updateUserInfo } = useUser();

  useEffect(() => {
    if (unlocked === 'true') {
      AsyncStorage.getItem('uid')
        .then(async (uid) => {
          try {
            const userData = await getUserByUID(uid);
            await changeStateLocked();
            updateUserInfo({ isLocked: "false" });
          } catch (error) {
            console.error('Error updating user data:', error);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [unlocked]);

  const handleLogout = async () => {
    try {
      await logOutFirebase();
      await AsyncStorage.removeItem('uid');
      setShowLogoutPopup(false);
      router.replace('/');
      if (Platform.OS === 'web') {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleUnlockSections = () => {
    router.push('/sections/subscriptionPlan');
  };

  const handlePaymentRedirect = () => {
    router.push('/sections/paymethod');
  };

  const handleLockedFeature = () => {
    router.push('/sections/subscriptionPlan');
  };

  const isAlwaysLocked = (section: string) => {
    const alwaysLockedSections = ['paymethod', 'notifications'];
    return alwaysLockedSections.includes(section);
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>Perfil</Text>

        <TouchableOpacity
          style={[styles.profileCard, isDark ? styles.profileCardDark : styles.profileCardLight]}
          onPress={() => router.push('/sections/profileSettings')}
        >
          <Image
            source={{ uri: userInfo.profile_img }}
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
            icon="person"
            title="Información personal"
            onPress={userInfo.isLocked === "true" ? handleLockedFeature : () => router.push('/sections/personalInfo')}
            isLocked={userInfo.isLocked === "true"}
          />
          <MenuItem
            icon="card"
            title="Método de pago"
            onPress={isAlwaysLocked('paymethod') ? handleLockedFeature : () => router.push('/sections/paymethod')}
            isLocked={true}
          />
          <MenuItem
            icon="notifications"
            title="Notificaciones"
            onPress={isAlwaysLocked('notifications') ? handleLockedFeature : () => router.push('/sections/notifications')}
            isLocked={true}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Profesores" />
          <MenuItem
            icon="school"
            title="Conviértete en profesor"
            onPress={userInfo.isLocked === "true" ? handleLockedFeature : () => router.push('/sections/teacher')}
            isLocked={userInfo.isLocked === "true"}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Subscripción" />
          <MenuItem
            icon="pricetag"
            title="Escoge tu plan"
            onPress={userInfo.isLocked === "true" ? () => router.push('/sections/subscriptionPlan') : handleLockedFeature}
            isLocked={userInfo.isLocked === "false"}
            alwaysAccessible={userInfo.isLocked === "true"}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Soporte" />
          <MenuItem
            icon="help-circle"
            title="Preguntas frecuentes"
            onPress={() => router.push('/sections/faq')}
            alwaysAccessible={true}
          />
          <MenuItem
            icon="chatbubble-ellipses"
            title="Contactar con soporte"
            onPress={() => router.push('/sections/support')}
            alwaysAccessible={true}
          />
        </View>

        <View style={styles.section}>
          <MenuItem
            icon="trash-outline"
            title="Eliminar cuenta"
            onPress={() => setShowDeleteAccountPopup(true)}
            alwaysAccessible={true}
          />
        </View>

        <View style={styles.section}>
          <MenuItem
            icon="log-out"
            title="Cerrar sesión"
            onPress={() => setShowLogoutPopup(true)}
            alwaysAccessible={true}
          />
        </View>
      </ScrollView>

      <LogoutPopup
        visible={showLogoutPopup}
        onLogout={() => {
          setShowLogoutPopup(false);
          handleLogout();
        }}
        onCancel={() => setShowLogoutPopup(false)}
      />

      <DeleteAccountPopup
        visible={showDeleteAccountPopup}
        onClose={() => setShowDeleteAccountPopup(false)}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
  lockedText: {
    opacity: 0.5,
  },
});