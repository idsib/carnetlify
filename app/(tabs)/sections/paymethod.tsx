import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  useWindowDimensions,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/context/UserContext';

const PaymentMethodsPage = () => {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { planId, planName, planPrice } = useLocalSearchParams();
  const { height, width } = useWindowDimensions();
  const isSmallDevice = height < 700;
  const isLargeScreen = width > 768;
  const { updateUserInfo } = useUser();

  const savedPaymentMethods = [
    { type: 'visa', lastDigits: '0789', icon: 'cc-visa' as const, iconFamily: 'FontAwesome5' as const },
    { type: 'googlepay', lastDigits: '5614', icon: 'google-pay' as const, iconFamily: 'FontAwesome5' as const },
  ];

  const availablePaymentMethods = [
    { 
      id: 'visa', 
      name: 'Visa', 
      icon: 'cc-visa' as const,
      iconFamily: 'FontAwesome5' as const
    },
    { 
      id: 'applepay', 
      name: 'Apple Pay', 
      icon: 'apple-pay' as const,
      iconFamily: 'FontAwesome5' as const
    },
    { 
      id: 'googlepay', 
      name: 'Google Pay', 
      icon: 'google-pay' as const,
      iconFamily: 'FontAwesome5' as const
    },
    { 
      id: 'mastercard', 
      name: 'Mastercard', 
      icon: 'cc-mastercard' as const,
      iconFamily: 'FontAwesome5' as const
    },
    { 
      id: 'stripe', 
      name: 'Stripe', 
      icon: 'stripe' as const,
      iconFamily: 'FontAwesome5' as const
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: 'cc-paypal' as const,
      iconFamily: 'FontAwesome5' as const
    },
  ];

  const renderIcon = (icon: string, family: string, size: number = 30) => {
    switch (family) {
      case 'FontAwesome5':
        return <FontAwesome5 name={icon} size={size} color={isDark ? '#FFFFFF' : '#000000'} />;
      default:
        return <FontAwesome5 name="credit-card" size={size} color={isDark ? '#FFFFFF' : '#000000'} />;
    }
  };

  const updateUserSubscription = async (userId: string, planId: string) => {
    try {
      const response = await fetch('/api/updateSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId,
          isLocked: false
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const handlePaymentMethodSelect = async (methodId: string) => {
    try {
      // Show success popup
      setShowSuccessPopup(true);
      
      // Update storage and user context
      await AsyncStorage.setItem('isLocked', 'false');
      updateUserInfo({ isLocked: "false" });
      
      // Wait for 2 seconds to show the message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to profile with unlocked parameter
      router.replace({
        pathname: '/(tabs)/profile',
        params: { unlocked: 'true' }
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      setShowSuccessPopup(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.header}>
        <Link href="/sections/subscriptionPlan" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={isDark ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </Link>
        <Text style={[styles.title, isDark && styles.darkText]}>Método de pago</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.planSummary, isDark && styles.darkCard]}>
          <Text style={[styles.planName, isDark && styles.darkText]}>
            Plan {planName}
          </Text>
          <Text style={[styles.planPrice, isDark && styles.darkText]}>
            {planPrice}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            Métodos de pago
          </Text>
          <View style={styles.methodsGrid}>
            {availablePaymentMethods.map((method) => (
              <TouchableOpacity 
                key={method.id}
                style={[styles.methodCard, isDark && styles.darkCard]}
                onPress={() => handlePaymentMethodSelect(method.id)}
              >
                {renderIcon(method.icon, method.iconFamily, 40)}
                <Text style={[styles.methodName, isDark && styles.darkText]}>
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      {showSuccessPopup && (
        <View style={[
          styles.successPopup,
          Platform.OS === 'web' && styles.successPopupWeb
        ]}>
          <View style={[
            styles.successPopupContent,
            { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }
          ]}>
            <Ionicons 
              name="checkmark-circle" 
              size={Platform.OS === 'web' ? 80 : 60} 
              color="#4CAF50" 
            />
            <Text style={[
              styles.successPopupText,
              { color: isDark ? '#FFFFFF' : '#000000' }
            ]}>
              ¡Método de pago aceptado!{'\n'}Has desbloqueado todas las opciones del perfil.
            </Text>
            <Text style={styles.successPopupSubtext}>
              Redirigiendo al perfil...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    outline: 'none',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  savedMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  savedMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardNumber: {
    marginLeft: 12,
    fontSize: 16,
    color: '#000000',
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...(Platform.OS === 'web' && {
      outlineWidth: 0,
      outlineStyle: 'none'
    }),
  },
  methodName: {
    fontSize: 14,
    marginTop: 8,
    color: '#000000',
    textAlign: 'center',
  },
  planSummary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  successPopup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successPopupWeb: {
    position: 'fixed',
  },
  successPopupContent: {
    padding: Platform.OS === 'web' ? 32 : 24,
    borderRadius: 16,
    alignItems: 'center',
    width: Platform.OS === 'web' ? 500 : '80%',
    maxWidth: Platform.OS === 'web' ? 600 : 400,
  },
  successPopupText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  successPopupSubtext: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PaymentMethodsPage;