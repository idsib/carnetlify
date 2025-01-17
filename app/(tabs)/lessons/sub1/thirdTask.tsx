import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, useColorScheme, StyleSheet, Animated as RNAnimated, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { updateLessonProgress, calculateTotalProgress } from '@/utils/progress';
import ProgressBar from '@/components/ProgressBar';
import { changeStateLesson } from '@/backend/firebase/config';

export default function Lesson3() {
  const isDark = useColorScheme() === 'dark';
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [buttonText, setButtonText] = useState('Verificar');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const fadeAnim = useSharedValue(0);
  const [progress, setProgress] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  useEffect(() => {
    const cleanup = () => {
      if (!isCorrect) {
        updateLessonProgress('lesson3', false);
      }
    };
    return cleanup;
  }, [isCorrect]);

  const handleFeedback = (correct: boolean) => {
    setIsCorrect(correct);
    setShowFeedback(true);
    fadeAnim.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 300 })
    );
  };

  const feedbackStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [
        {
          translateY: withSpring(fadeAnim.value * -50),
        },
      ],
    };
  });

  const handleConfirm = async () => {
    if (selectedAnswer === false) {
      try {
        const numberLesson = {
          numberLesson: "numberLesson13"
        };
        await changeStateLesson(numberLesson);
        await updateLessonProgress('lesson3', true);
        const newProgress = await calculateTotalProgress(6);
        setProgress(newProgress);
        handleFeedback(true);
        setButtonText('Continuar');
        setShowCompletionModal(true); // Mostramos el modal de completado
      } catch (error) {
        console.error('Error updating progress:', error);
        handleFeedback(false);
      }
    } else {
      handleFeedback(false);
    }
  };

  const handleButtonPress = () => {
    if (buttonText === 'Continuar') {
      router.push('/lessons/sub1/Block');
    } else {
      handleConfirm();
    }
  };

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
                Responsabilidad en la conducción
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <ProgressBar 
              progress={progress}
              currentBlock={1}
              currentLesson={3}
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

          <View style={styles.content}>
            <Text style={[styles.question, isDark && styles.titleDark]}>
              El conductor en prácticas es el único responsable de su seguridad.
            </Text>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isDark && styles.optionButtonDark,
                  selectedAnswer === true && styles.selectedOption,
                ]}
                onPress={() => setSelectedAnswer(true)}
              >
                <Text style={[
                  styles.optionText, 
                  isDark && styles.textDark,
                  selectedAnswer === true && styles.selectedOptionText
                ]}>
                  Verdadero
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isDark && styles.optionButtonDark,
                  selectedAnswer === false && styles.selectedOption,
                ]}
                onPress={() => setSelectedAnswer(false)}
              >
                <Text style={[
                  styles.optionText, 
                  isDark && styles.textDark,
                  selectedAnswer === false && styles.selectedOptionText
                ]}>
                  Falso
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, isDark && styles.buttonDark]} 
              onPress={handleButtonPress}
              disabled={selectedAnswer === null}
            >
              <Text style={[styles.buttonText, isDark && styles.textDark]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
        
        <Modal
          animationType="fade"
          transparent={true}
          visible={showCompletionModal}
          onRequestClose={() => {
            setShowCompletionModal(false);
            router.push('/lessons/sub1/Block');
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
              <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                SUBTEMA 1 COMPLETADO
              </Text>
              <Text style={[styles.modalText, isDark && styles.modalTextDark]}>
                Has completado este subtema correctamente.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowCompletionModal(false);
                  router.push('/lessons/sub1/Block');
                }}
              >
                <Text style={styles.modalButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  content: {
    flex: 1,
    padding: 16,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionButtonDark: {
    backgroundColor: '#2D2D2D',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  selectedOptionText: {
    color: '#FFFFFF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    width: '80%',
  },
  modalContentDark: {
    backgroundColor: '#2D2D2D',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  modalText: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 24,
  },
  modalTextDark: {
    color: '#FFFFFF',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});