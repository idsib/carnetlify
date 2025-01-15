import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error';
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ visible, message, type = 'success', onHide }) => {
  const opacity = new Animated.Value(0);
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        isWeb ? styles.webContainer : styles.mobileContainer,
        { opacity, width: isWeb ? 300 : width - 40 },
        type === 'error' ? styles.errorContainer : styles.successContainer,
      ]}
    >
      <Text style={[styles.message, type === 'error' ? styles.errorText : styles.successText]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  webContainer: {
    top: 20,
    right: 20,
  },
  mobileContainer: {
    bottom: 40,
    alignSelf: 'center',
  },
  successContainer: {
    backgroundColor: '#4CAF50',
  },
  errorContainer: {
    backgroundColor: '#f44336',
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
  },
  successText: {
    color: '#fff',
  },
  errorText: {
    color: '#fff',
  },
});

export default Toast;
