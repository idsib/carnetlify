import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Platform, Animated as RNAnimated } from 'react-native';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const allConcepts = ['Ráfagas', 'Vía urbana', 'Deslumbramiento', 'Vía interurbana', 'Inmovilizado', 'Travesía'];

const correctAnswers = {
  prohibidas: ['Inmovilizado', 'Deslumbramiento', 'Travesía', 'Vía urbana'],
  permitidas: ['Ráfagas', 'Vía interurbana']
};

interface DraggableItemProps {
  item: string;
  onDragEnd: (item: string, dropZone: 'prohibidas' | 'permitidas' | null) => void;
}

export default function Lesson1() {
  const router = useRouter();
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const fadeAnim = useSharedValue(0);
  const [categories, setCategories] = useState({
    prohibidas: [] as string[],
    permitidas: [] as string[],
    unassigned: [...allConcepts]
  });

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
      withDelay(2000, withTiming(0, { duration: 300 }))
    );
    // Después de 2 segundos, ocultamos el feedback solo si no se ha presionado el botón
    setTimeout(() => {
      if (!correct) {
        setShowFeedback(false);
      }
    }, 2000);
  };

  const handleConfirm = () => {
    const isCorrect = 
      JSON.stringify(categories.prohibidas.sort()) === JSON.stringify(correctAnswers.prohibidas.sort()) &&
      JSON.stringify(categories.permitidas.sort()) === JSON.stringify(correctAnswers.permitidas.sort());
    
    handleFeedback(isCorrect);
  };

  const feedbackStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: withSpring(fadeAnim.value ? 1 : 0.8) }],
  }));

  const DraggableItem = ({ item, onDragEnd }: DraggableItemProps) => {
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
        <Animated.View style={[styles.conceptItem, animatedStyle]}>
          <Text style={styles.conceptText}>{item}</Text>
        </Animated.View>
      </GestureDetector>
    );
  };

  useEffect(() => {
    resetGame();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {showFeedback && (
          <Animated.View style={[
            styles.feedbackContainer,
            feedbackStyle,
          ]}>
            <View style={[
              styles.feedbackContent,
              isCorrect ? styles.correctFeedback : styles.incorrectFeedback
            ]}>
              <View style={styles.checkmarkContainer}>
                <Text style={styles.checkmark}>
                  {isCorrect ? '✓' : '✕'}
                </Text>
              </View>
              <Text style={styles.feedbackText}>
                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </Text>
              <TouchableOpacity 
                style={[styles.continueButton, isCorrect ? styles.correctButton : styles.incorrectButton]}
                onPress={() => {
                  if (isCorrect) {
                    resetGame();
                    router.push('/(tabs)/main');
                  } else {
                    resetGame();
                    setShowFeedback(false);
                  }
                }}
              >
                <Text style={styles.continueButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
        <Text style={styles.title}>Agrupa los siguientes conceptos de las luces largas</Text>
        
        <View style={styles.dropZonesContainer}>
          <View style={styles.dropZoneRow}>
            <View style={[styles.category, { flex: 1 }]}>
              <Text style={styles.categoryTitle}>Prohibidas</Text>
              <View style={[styles.dropZone, styles.prohibidasZone]}>
                {categories.prohibidas.map((item, index) => (
                  <DraggableItem 
                    key={index} 
                    item={item}
                    onDragEnd={moveItem}
                  />
                ))}
              </View>
            </View>

            <View style={[styles.category, { flex: 1 }]}>
              <Text style={styles.categoryTitle}>Permitidas</Text>
              <View style={[styles.dropZone, styles.permitidasZone]}>
                {categories.permitidas.map((item, index) => (
                  <DraggableItem 
                    key={index} 
                    item={item}
                    onDragEnd={moveItem}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.unassignedContainer}>
          {categories.unassigned.map((item, index) => (
            <DraggableItem 
              key={index} 
              item={item}
              onDragEnd={moveItem}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirmar elección</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  dropZonesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  dropZoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 300, 
    marginBottom: 20,
  },
  category: {
    flex: 1,
    marginHorizontal: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#444',
  },
  dropZone: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 250, 
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  prohibidasZone: {
    backgroundColor: '#ffebee',
    borderWidth: 2,
    borderColor: '#ffcdd2',
  },
  permitidasZone: {
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: '#c8e6c9',
  },
  unassignedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    marginTop: 20,
  },
  conceptItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    margin: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 120, 
    height: 45, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  conceptText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  placedItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    margin: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 120, 
    height: 45, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 20,
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackContainer: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  feedbackContent: {
    width: '100%',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkmarkContainer: {
    marginRight: 10,
  },
  checkmark: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  correctFeedback: {
    backgroundColor: '#2196F3',
  },
  incorrectFeedback: {
    backgroundColor: '#DC3545',
  },
  feedbackText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  continueButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  correctButton: {
    backgroundColor: '#1976D2',
  },
  incorrectButton: {
    backgroundColor: '#C82333',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});