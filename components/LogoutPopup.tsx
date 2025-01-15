import React = require('react');
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  Platform,
  useColorScheme
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';

interface LogoutPopupProps {
  visible: boolean;
  onLogout: () => void;
  onCancel: () => void;
}

const LogoutPopup: React.FC<LogoutPopupProps> = ({ visible, onLogout, onCancel }) => {
  const isDark = useColorScheme() === 'dark';
  const scale = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  React.useEffect(() => {
    scale.value = visible ? withSpring(1, { damping: 10 }) : withTiming(0);
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      {Platform.OS === 'ios' ? (
        <BlurView 
          intensity={isDark ? 80 : 50}
          tint={isDark ? 'dark' : 'light'}
          style={styles.blurContainer}
        >
          {renderContent()}
        </BlurView>
      ) : (
        <View style={[styles.blurContainer, isDark && styles.blurContainerDark]}>
          {renderContent()}
        </View>
      )}
    </Modal>
  );

  function renderContent() {
    return (
      <Animated.View 
        style={[
          styles.popupContainer, 
          isDark && styles.popupContainerDark,
          animatedStyle,
          Platform.OS === 'web' && styles.webShadow
        ]}
      >
        <Text style={[styles.titleText, isDark && styles.darkText]}>
          Cerrar Sesión
        </Text>
        <Text style={[styles.subtitleText, isDark && styles.darkText]}>
          ¿Estás seguro de que quieres cerrar sesión?
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton, isDark && styles.cancelButtonDark]} 
            onPress={onCancel}
          >
            <Text style={[styles.cancelText, isDark && styles.darkCancelText]}>
              Cancelar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={onLogout}
          >
            <Text style={styles.logoutText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainerDark: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  popupContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  popupContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  webShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonDark: {
    backgroundColor: '#2C2C2E',
  },
  logoutButton: {
    backgroundColor: '#1DA1F2',
  },
  cancelText: {
    color: '#000000',
    fontWeight: '600',
  },
  darkCancelText: {
    color: '#FFFFFF',
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default LogoutPopup;