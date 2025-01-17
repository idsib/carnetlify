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

const allRoles = ['Conductor', 'Peatón', 'Pasajero', 'Ciclista'];

const correctAnswers = {
  roles: ['Conductor', 'Peatón', 'Pasajero']
};

interface DraggableItemProps {
  item: string;
  onDragEnd: (item: string, dropZone: 'roles' | null) => void;
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
      
      // Si está en la parte superior de la pantalla
      if (relativePositionY < 0.45) {
        runOnJS(onDragEnd)(item, 'roles');
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

export default function Lesson2() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [buttonText, setButtonText] = useState('Verificar');
  const fadeAnim = useSharedValue(0);
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState({
    roles: [] as string[],
    unassigned: [...allRoles]
  });

  useEffect(() => {
    const cleanup = () => {
      if (!isCorrect) {
        updateLessonProgress('lesson2', false);
      }
    };
    return cleanup;
  }, [isCorrect]);

  const moveItem = (item: string, dropZone: 'roles' | null) => {
    try {
      if (dropZone === 'roles' && categories[dropZone].length >= 3) {
        Alert.alert('Límite alcanzado', 'Solo puedes seleccionar 3 roles');
        return;
      }

      setCategories(prev => {
        const newCategories = { ...prev };
        newCategories.roles = prev.roles.filter(i => i !== item);
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
      roles: [] as string[],
      unassigned: [...allRoles]
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
    const isCorrectRoles = categories.roles.every(item => correctAnswers.roles.includes(item)) && 
                          correctAnswers.roles.every(item => categories.roles.includes(item));

    if (isCorrectRoles) {
      try {
        const numberLesson = {
          numberLesson: "numberLesson12"
        };
        await changeStateLesson(numberLesson);
        await updateLessonProgress('lesson2', true);
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
      router.push('/lessons/sub1/thirdTask');
    } else {
      handleVerify();
    }
  };

  const feedbackStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: withSpring(fadeAnim.value ? 1 : 0.8) }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safeArea, isDark && styles.containerDark]} edges={['top', 'left', 'right']}>
        <View style={[styles.container, isDark && styles.containerDark]}>
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
              <Text style={[styles.title, isDark && styles.titleDark]}>
                Selecciona los roles en la conducción
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <ProgressBar 
              progress={progress}
              currentBlock={1}  
              currentLesson={2}
            />
          </View>

          {showFeedback && (
            <Animated.View style={[
              styles.feedbackContainer,
              feedbackStyle,
            ]}>
              <View style={[
                styles.feedbackContent,
                isCorrect ? styles.successFeedback : styles.errorFeedback
              ]}>
                <Text style={styles.feedbackText}>
                  {isCorrect ? '¡Correcto!' : 'Inténtalo de nuevo'}
                </Text>
              </View>
            </Animated.View>
          )}

          <View style={styles.dropZonesContainer}>
            <View style={[styles.dropZone, isDark && styles.dropZoneDark]}>
              <Text style={[styles.dropZoneTitle, isDark && styles.textDark]}>Roles ({categories.roles.length}/3)</Text>
              {categories.roles.map((item) => (
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
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  feedbackContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  feedbackContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successFeedback: {
    backgroundColor: '#4CAF50',
  },
  errorFeedback: {
    backgroundColor: '#F44336',
  },
  feedbackText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropZonesContainer: {
    padding: 16,
  },
  dropZone: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropZoneDark: {
    backgroundColor: '#2D2D2D',
  },
  dropZoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  unassignedContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  buttonContainer: {
    padding: 16,
    marginTop: 'auto',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDark: {
    backgroundColor: '#0A84FF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textDark: {
    color: '#FFFFFF',
  },
  draggableItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  draggableItemDark: {
    backgroundColor: '#1C1C1E',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
});