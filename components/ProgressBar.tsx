import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { changeStateLesson, showProgressMongo } from '../backend/firebase/config';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  currentBlock: number;
  currentLesson: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#2B9FDC',
  height = 8,
  currentBlock,
  currentLesson,
}) => {
  const isDark = useColorScheme() === 'dark';
  const progressWidth = useSharedValue(0);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    // Obtener el progreso del usuario cuando el componente se monta
    const fetchProgress = async () => {
      try {
        const progress = await showProgressMongo();
        setUserProgress(progress);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    progressWidth.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const handleLessonComplete = async () => {
    try {
      const numberLesson = {
        numberLesson: `numberLesson${currentBlock}${currentLesson}`
      };
      await changeStateLesson(numberLesson);
      // Actualizar el progreso después de cambiar el estado de la lección
      const updatedProgress = await showProgressMongo();
      setUserProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating lesson state:', error);
    }
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
    backgroundColor: color,
  }));

  return (
    <View style={[
      styles.container,
      { height },
      isDark && styles.containerDark,
      Platform.OS === 'web' && styles.webShadow
    ]}>
      <Animated.View style={[styles.progress, progressStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  containerDark: {
    backgroundColor: '#333333',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  webShadow: {
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
});

export default ProgressBar;
