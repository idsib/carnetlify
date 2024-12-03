import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

const PaymentMethodsPage = () => {
  const isDark = useColorScheme() === 'dark';
  const { height, width } = useWindowDimensions();
  const isSmallDevice = height < 700;
  const isLargeScreen = width > 768;

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

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.header}>
        <Link href="../profile" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={isDark ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </Link>
        <Text style={[styles.title, isDark && styles.darkText]}>Métodos de pago</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            Mis métodos de pago
          </Text>
          {savedPaymentMethods.map((method, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.savedMethodCard, isDark && styles.darkCard]}
            >
              <View style={styles.savedMethodContent}>
                {renderIcon(method.icon, method.iconFamily, 35)}
                <Text style={[styles.cardNumber, isDark && styles.darkText]}>
                  •••• •••• •••• {method.lastDigits}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            Más métodos de pago
          </Text>
          <View style={styles.methodsGrid}>
            {availablePaymentMethods.map((method) => (
              <TouchableOpacity 
                key={method.id}
                style={[styles.methodCard, isDark && styles.darkCard]}
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
    outline: 'none',
  },
  methodName: {
    fontSize: 14,
    marginTop: 8,
    color: '#000000',
    textAlign: 'center',
  },
});

export default PaymentMethodsPage;