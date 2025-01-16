import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from "firebase/auth";
import { useUser } from '@/context/UserContext';
import { UserInfo } from '@/backend/interficie/UserInfoInterficie';

interface DeleteAccountPopupProps {
  visible: boolean;
  onClose: () => void;
}

const defaultUserInfo: Partial<UserInfo> = {
  email: "null",
  fullName: "User Not Registered",
  userId: "null",
  plan: "null",
  isLocked: "true",
  profile_img: "https://drive.google.com/file/d/1ghxS5ymI1Je8SHSztVtkCxnKFbUQDqim/view?usp=drive_link"
};

const DeleteAccountPopup = ({ visible, onClose }: DeleteAccountPopupProps) => {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const auth = getAuth();
  const { updateUserInfo } = useUser();
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      // Eliminar la cuenta de Firebase
      await currentUser.delete();
      
      // Limpiar AsyncStorage
      await AsyncStorage.clear();
      
      // Actualizar el contexto con la información por defecto
      updateUserInfo(defaultUserInfo);
      
      // Cerrar el popup y navegar al login
      onClose();
      router.replace('/login');
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      Alert.alert(
        'Error',
        'No se pudo eliminar la cuenta. Por favor, vuelve a iniciar sesión e inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.popup, isDark && styles.popupDark]}>
          <Text style={[styles.title, isDark && styles.textDark]}>
            ¿Estás seguro?
          </Text>
          
          <Text style={[styles.message, isDark && styles.textDark]}>
            Esta acción eliminará permanentemente tu cuenta y todos tus datos. Esta acción no se puede deshacer.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDeleteAccount}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Eliminar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  popupDark: {
    backgroundColor: '#1C1C1E',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000000',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#000000',
  },
  textDark: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeleteAccountPopup;
