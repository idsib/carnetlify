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
  const [userProgress, setUserProgress] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [taskStates, setTaskStates] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progress = await showProgressMongo();
        setUserProgress(progress);
        if (progress?.stateLessons) {
          // Crear un array de estados para cada subtarea
          const states = Array(totalTasks).fill(false);
          let completedCount = 0;
          
          for (let i = 1; i <= totalTasks; i++) {
            const lessonKey = `stateLesson${currentBlock}${i}`;
            if (progress.stateLessons[lessonKey]) {
              states[i-1] = true;
              completedCount++;
            }
          }
          
          setTaskStates(states);
          setCompletedTasks(completedCount);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
    fetchProgress();
  }, [currentLesson, currentBlock, totalTasks, progress]);

  useEffect(() => {
    const normalizedProgress = (completedTasks / totalTasks) * 100;
    progressWidth.value = withSpring(normalizedProgress, {
      damping: 20,
      stiffness: 90,
    });
  }, [completedTasks, totalTasks]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
    backgroundColor: color,
    height: height,
    borderRadius: height / 2,
  }));

  return (
    <View style={[styles.container, { height: height }]}>
      <View style={styles.taskIndicators}>
        {taskStates.map((isCompleted, index) => (
          <View
            key={index}
            style={[
              styles.taskIndicator,
              {
                backgroundColor: isCompleted ? '#4CAF50' : isDark ? '#333' : '#E0E0E0',
                width: `${100 / totalTasks}%`,
                height: height,
              }
            ]}
          />
        ))}
      </View>
      <Animated.View style={[progressStyle, styles.progressOverlay]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderRadius: 4,
    position: 'relative',
  },
  taskIndicators: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskIndicator: {
    height: '100%',
    marginHorizontal: 1,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.6,
  }
});

export default ProgressBar;
