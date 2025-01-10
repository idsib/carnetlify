import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number; // valor entre 0 y 1
  color?: string;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#2B9FDC',
  height = 8,
}) => {
  const isDark = useColorScheme() === 'dark';
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

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
