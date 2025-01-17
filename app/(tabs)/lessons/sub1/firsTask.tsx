import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Platform, Animated as RNAnimated, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  runOnJS,
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '@/components/ProgressBar';
import { updateLessonProgress, calculateTotalProgress } from '@/utils/progress';
import { changeStateLesson } from '@/backend/firebase/config';

const allConcepts = ['Ráfagas', 'Vía urbana', 'Deslumbramiento', 'Vía interurbana', 'Inmovilizado', 'Travesía'];

const correctAnswers = {
  prohibidas: ['Inmovilizado', 'Deslumbramiento', 'Travesía', 'Vía urbana'],
  permitidas: ['Ráfagas', 'Vía interurbana']
};

interface DraggableItemProps {
  item: string;
  onDragEnd: (item: string, dropZone: 'prohibidas' | 'permitidas' | null) => void;
  isDark?: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, onDragEnd, isDark }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const context = useRef({ startY: 0 }).current;

  const resetPosition = () => {
    translateX.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
    isDragging.value = false;
  };

  const handleDragEnd = (endY: number, endX: number) => {
    try {
      const windowHeight = Dimensions.get('window').height;
      const windowWidth = Dimensions.get('window').width;
      const relativePositionY = endY / windowHeight;
      const relativePositionX = endX / windowWidth;
      
      // Si está en la parte superior de la pantalla
      if (relativePositionY < 0.45) {
        // Si está en la mitad izquierda
        if (relativePositionX < 0.5) {
          runOnJS(onDragEnd)(item, 'prohibidas');
        }
        // Si está en la mitad derecha
        else {
          runOnJS(onDragEnd)(item, 'permitidas');
        }
      }
      // Si está en la parte inferior, vuelve a la zona sin asignar
      else {
        runOnJS(onDragEnd)(item, null);
      }
    } catch (error) {
      console.log('Error in handleDragEnd:', error);
    } finally {
      runOnJS(resetPosition)();
    }
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      context.startY = 0;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (Platform.OS === 'web') {
        handleDragEnd(e.absoluteY, e.absoluteX);
      } else {
        runOnJS(handleDragEnd)(e.absoluteY, e.absoluteX);
      }
    })
    .onFinalize(() => {
      runOnJS(resetPosition)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: withSpring(isDragging.value ? 1.1 : 1) }
    ],
    zIndex: isDragging.value ? 1000 : 1,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.draggableItem, isDark && styles.draggableItemDark, animatedStyle]}>
        <Text style={[styles.itemText, isDark && styles.textDark]}>{item}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default function Lesson1() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const fadeAnim = useSharedValue(0);
  const [progress, setProgress] = useState(0);
  const [buttonText, setButtonText] = useState('Aceptar');
  const [categories, setCategories] = useState({
    prohibidas: [] as string[],
    permitidas: [] as string[],
    unassigned: [...allConcepts]
  });
  const [taskCompleted, setTaskCompleted] = useState(false);

  useEffect(() => {
    if (taskCompleted) {
      updateLessonProgress('lesson1', true);
    }
  }, [taskCompleted]);

  useEffect(() => {
    const cleanup = () => {
      if (!isCorrect) {
        updateLessonProgress('lesson1', false);
      }
    };
    return cleanup;
  }, [isCorrect]);

  const moveItem = (item: string, dropZone: 'prohibidas' | 'permitidas' | null) => {
    try {
      if (dropZone === 'permitidas' && categories[dropZone].length >= 2) {
        Alert.alert('Límite alcanzado', 'Solo puedes colocar 2 respuestas en la categoría Permitidas');
        return;
      }
      if (dropZone === 'prohibidas' && categories[dropZone].length >= 4) {
        Alert.alert('Límite alcanzado', 'Solo puedes colocar 4 respuestas en la categoría Prohibidas');
        return;
      }

      setCategories(prev => {
        const newCategories = { ...prev };
        newCategories.prohibidas = prev.prohibidas.filter(i => i !== item);
        newCategories.permitidas = prev.permitidas.filter(i => i !== item);
        newCategories.unassigned = prev.unassigned.filter(i => i !== item);
        
        if (dropZone) {
          newCategories[dropZone].push(item);
        } else {
          newCategories.unassigned.push(item);
        }
        
        return newCategories;
      });
    } catch (error) {
      console.log('Error moving item:', error);
    }
  };

  const resetGame = () => {
    setCategories({
      prohibidas: [] as string[],
      permitidas: [] as string[],
      unassigned: [...allConcepts]
    });
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const handleFeedback = (correct: boolean) => {
    setIsCorrect(correct);
    setShowFeedback(true);
    fadeAnim.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 300 })
    );
  };

  const handleVerify = async () => {
    const isCorrectProhibidas = categories.prohibidas.every(item => correctAnswers.prohibidas.includes(item)) && 
                               correctAnswers.prohibidas.every(item => categories.prohibidas.includes(item));
    const isCorrectPermitidas = categories.permitidas.every(item => correctAnswers.permitidas.includes(item)) && 
                               correctAnswers.permitidas.every(item => categories.permitidas.includes(item));

    const allCorrect = isCorrectProhibidas && isCorrectPermitidas;

    if (allCorrect) {
      try {
        const stateLesson = {
          stateLesson: "stateLesson11"
        };
        await changeStateLesson(stateLesson);
        setTaskCompleted(true);
        const newProgress = await calculateTotalProgress(6);
        setProgress(newProgress);
        handleFeedback(true);
        setButtonText('Continuar');
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    } else {
      handleFeedback(false);
    }
  };

  const handleButtonPress = () => {
    if (buttonText === 'Continuar') {
      router.push('/lessons/sub1/secondTask');
    } else {
      handleVerify();
    }
  };

  const feedbackStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: withSpring(fadeAnim.value ? 1 : 0.8) }],
  }));

  useEffect(() => {
    const initializeLesson = async () => {
      resetGame();
      // Calcular el progreso inicial
      const currentProgress = await calculateTotalProgress(6); // 6 es el número total de lecciones
      setProgress(currentProgress);
    };
    
    initializeLesson();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
          <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/lessons/sub1/Block')}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={isDark ? '#FFFFFF' : '#000000'}
                />
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={[styles.title, isDark && styles.titleDark]}>
                  Clasifica dónde está permitido y prohibido el uso de las luces largas
                </Text>
                <ProgressBar
                  progress={progress}
                  currentBlock={1}
                  currentLesson={1}
                  totalTasks={3}
                  height={8}
                  color="#2B9FDC"
                />
              </View>
            </View>
            
            <View style={styles.dropZonesContainer}>
              <View style={[styles.dropZone, isDark && styles.dropZoneDark]}>
                <Text style={[styles.dropZoneTitle, isDark && styles.textDark]}>Prohibidas ({categories.prohibidas.length}/4)</Text>
                {categories.prohibidas.map((item) => (
                  <DraggableItem key={item} item={item} onDragEnd={moveItem} isDark={isDark} />
                ))}
              </View>

              <View style={[styles.dropZone, isDark && styles.dropZoneDark]}>
                <Text style={[styles.dropZoneTitle, isDark && styles.textDark]}>Permitidas ({categories.permitidas.length}/2)</Text>
                {categories.permitidas.map((item) => (
                  <DraggableItem key={item} item={item} onDragEnd={moveItem} isDark={isDark} />
                ))}
              </View>
            </View>

            <View style={styles.unassignedContainer}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Conceptos</Text>
              <View style={styles.itemsContainer}>
                {categories.unassigned.map((item) => (
                  <DraggableItem key={item} item={item} onDragEnd={moveItem} isDark={isDark} />
                ))}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, isDark && styles.buttonDark]} 
                onPress={handleButtonPress}
              >
                <Text style={[styles.buttonText, isDark && styles.textDark]}>
                  {buttonText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeAreaDark: {
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
    padding: 16,
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
    marginLeft: 16,
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000000',
    paddingHorizontal: 40,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  dropZonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: Platform.OS === 'web' ? 60 : 20, // Add extra margin for web to avoid Expo navigation
  },
  dropZone: {
    flex: 1,
    minHeight: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  dropZoneDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  dropZoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  unassignedContainer: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  draggableItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 100,
    alignItems: 'center',
  },
  draggableItemDark: {
    backgroundColor: '#333',
  },
  itemText: {
    fontSize: 14,
    textAlign: 'center',
  },
  textDark: {
    color: '#fff',
  },
  buttonContainer: {
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'web' ? 30 : 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDark: {
    backgroundColor: '#0A84FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 80 : 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  feedbackContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  successFeedback: {
    backgroundColor: '#4CAF50',
  },
  errorFeedback: {
    backgroundColor: '#f44336',
  },
  feedbackText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});