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
  totalTasks?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#2B9FDC',
  height = 8,
  currentBlock,
  currentLesson,
  totalTasks = 3,
}) => {
  const isDark = useColorScheme() === 'dark';
  const progressWidth = useSharedValue(0);
  const [userProgress, setUserProgress] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progress = await showProgressMongo();
        setUserProgress(progress);
        if (progress?.lessons) {
          const lessonProgress = progress.lessons[`lesson${currentLesson}`];
          setCompletedTasks(lessonProgress ? 1 : 0);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
    fetchProgress();
  }, [currentLesson]);

  useEffect(() => {
    const normalizedProgress = (completedTasks / totalTasks) * 100;
    progressWidth.value = withSpring(normalizedProgress, {
      damping: 15,
      stiffness: 100,
    });
  }, [completedTasks, totalTasks]);

  const handleLessonComplete = async () => {
    try {
      await changeStateLesson(currentLesson);
      setCompletedTasks(prev => Math.min(prev + 1, totalTasks));
    } catch (error) {
      console.error('Error updating lesson state:', error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
    height,
    backgroundColor: color,
    borderRadius: height / 2,
  }));

  return (
    <View style={[
      styles.container,
      { height, borderRadius: height / 2, backgroundColor: isDark ? '#333' : '#E0E0E0' }
    ]}>
      <Animated.View style={animatedStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
});

export default ProgressBar;
