import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface SubtemaProps {
  number: string;
  title: string;
  route: string;
  description: string;
}

const Subtema: React.FC<SubtemaProps> = ({ number, title, route, description }) => {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={[styles.subtemaCard, isDark && styles.subtemaCardDark]}
      onPress={() => router.push('/lessons/sub1/firsTask')}
    >
      <View style={styles.numberContainer}>
        <Text style={[styles.number, isDark && styles.textDark]}>{number}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, isDark && styles.textDark]}>{title}</Text>
        <Text style={[styles.description, isDark && styles.descriptionDark]}>{description}</Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={24} 
        color={isDark ? '#fff' : '#000'} 
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

export default function Block() {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  const subtemas = [
    {
      number: '1',
      title: 'Roles y Responsabilidades',
      route: 'firsTask',
      description: 'Aprende sobre los diferentes roles y responsabilidades en la conducción.'
    },
    {
      number: '2',
      title: 'Conceptos de Seguridad y Prevención',
      route: 'secondTask',
      description: 'Descubre los conceptos fundamentales de seguridad vial y prevención de accidentes.'
    },
    {
      number: '3',
      title: 'Interacción con Otros Usuarios',
      route: 'thirdTask',
      description: 'Conoce cómo interactuar de manera segura con otros usuarios de la vía.'
    }
  ];

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.headerTitle, isDark && styles.textDark]}>
            Bloques de Aprendizaje
          </Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.subtemasContainer}>
          {subtemas.map((subtema, index) => (
            <Subtema
              key={index}
              number={subtema.number}
              title={subtema.title}
              route={subtema.route}
              description={subtema.description}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    padding: 8,
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000000',
    paddingHorizontal: 40,
  },
  scrollView: {
    flex: 1,
  },
  blockTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
    textAlign: 'center',
  },
  subtemasContainer: {
    gap: 16,
  },
  subtemaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  subtemaCardDark: {
    backgroundColor: '#2a2a2a',
  },
  numberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  number: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  descriptionDark: {
    color: '#999',
  },
  textDark: {
    color: '#fff',
  },
  icon: {
    marginLeft: 8,
  },
});