import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { showProgressMongo } from '../../../../backend/firebase/config';

interface SubtemaProps {
  number: string;
  title: string;
  route: string;
  description: string;
  isCompleted: boolean;
  isLocked?: boolean;
}

const Subtema: React.FC<SubtemaProps> = ({ 
  number, 
  title, 
  route, 
  description, 
  isCompleted, 
  isLocked
}) => {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  const handlePress = () => {
    if (isLocked) return;
    
    // Si es el primer subtema, navegar a la primera task
    if (number === "1") {
      router.push('/(tabs)/lessons/sub1/firsTask' as any);
    } else {
      router.push(`/(tabs)/lessons/sub1/${route}` as any);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.subtemaCard, 
        isDark && styles.subtemaCardDark,
        isCompleted && styles.completedCard,
        isLocked && styles.lockedCard
      ]}
      onPress={handlePress}
      disabled={isLocked}
    >
      <View style={styles.numberContainer}>
        <Text style={[styles.number, isDark && styles.textDark]}>{number}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, isDark && styles.textDark, isLocked && styles.lockedText]}>{title}</Text>
        <Text style={[styles.description, isDark && styles.descriptionDark, isLocked && styles.lockedText]}>{description}</Text>
      </View>
      {isLocked ? (
        <Ionicons 
          name="lock-closed" 
          size={24} 
          color={isDark ? '#666' : '#999'} 
          style={styles.icon}
        />
      ) : isCompleted ? (
        <View style={styles.completedIconContainer}>
          <Ionicons 
            name="checkmark-circle" 
            size={24} 
            color="#4CAF50"
          />
        </View>
      ) : (
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={isDark ? '#fff' : '#000'} 
          style={styles.icon}
        />
      )}
    </TouchableOpacity>
  );
};

export default function Block() {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const [completedLessons, setCompletedLessons] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progress = await showProgressMongo();
        const completed: { [key: string]: boolean } = {};
        for (let i = 1; i <= 3; i++) {
          const lessonKey = `numberLesson1${i}`;
          completed[i.toString()] = progress?.[lessonKey] || false;
        }
        setCompletedLessons(completed);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, []);

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
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
        <Text style={[styles.blockTitle, isDark && styles.textDark]}>
          Bloque 1: El Conductor
        </Text>
      </View>
      <Text style={[styles.blockDescription, isDark && styles.descriptionDark]}>
        Conoce los aspectos fundamentales sobre el conductor y la conducción.
      </Text>

      <ScrollView style={styles.scrollView}>
        <View style={styles.subtemaContainer}>
          {/* Primer subtema (desbloqueado) que contiene las tres tasks */}
          <Subtema
            number="1"
            title="El Factor Humano"
            route="firsTask"
            description="Factores que afectan al conductor y la conducción. Completa las tres lecciones."
            isCompleted={completedLessons['1'] && completedLessons['2'] && completedLessons['3']}
            isLocked={false}
          />

          {/* Subtemas bloqueados */}
          <Subtema
            number="2"
            title="Factores de Riesgo"
            route="secondTask"
            description="Efectos del alcohol, drogas y medicamentos"
            isCompleted={false}
            isLocked={true}
          />

          <Subtema
            number="3"
            title="Tiempos de Conducción"
            route="thirdTask"
            description="Descanso y factores que influyen en la conducción"
            isCompleted={false}
            isLocked={true}
          />
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  blockTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    color: '#000',
  },
  blockDescription: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  subtemaContainer: {
    padding: 16,
    gap: 16,
  },
  sectionDivider: {
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  subtemaCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
    backgroundColor: '#2d2d2d',
  },
  completedCard: {
    backgroundColor: '#e8f5e9',
  },
  lockedCard: {
    backgroundColor: '#2d2d2d',
    opacity: 0.9,
  },
  numberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  descriptionDark: {
    color: '#999',
  },
  textDark: {
    color: '#fff',
  },
  lockedText: {
    color: '#fff',
  },
  icon: {
    marginLeft: 'auto',
  },
  completedIconContainer: {
    marginLeft: 'auto',
  },
});