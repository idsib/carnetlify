import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, useColorScheme, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const TabBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isDark = useColorScheme() === 'dark';

  const tabs = [
    { 
      name: 'home-outline', 
      activeName: 'home',
      path: '/main',
      icon: 'home-outline'
    },
    { 
      name: 'id-card-outline', 
      activeName: 'id-card',
      path: '/booking',
      icon: 'id-card-outline'
    },
    { 
      name: 'chatbubbles-outline', 
      activeName: 'chatbubbles',
      path: '/messages',
      icon: 'chatbubble-outline'
    },
    { 
      name: 'person-outline', 
      activeName: 'person',
      path: '/profile',
      icon: 'person-outline'
    },
  ];

  const getAnimatedStyle = (isActive: boolean) => {
    return useAnimatedStyle(() => {
      return {
        transform: [{ 
          scale: withTiming(isActive ? 1.1 : 1, { duration: 200 }) 
        }],
        color: withTiming(
          interpolateColor(
            isActive ? 1 : 0,
            [0, 1],
            isDark 
              ? ['#FFFFFF', '#3478F6'] 
              : ['#666', '#007AFF']
          )
        )
      };
    });
  };

  return (
    <View style={styles.container}>
      <BlurView 
        intensity={isDark ? 80 : 50} 
        tint={isDark ? 'dark' : 'light'}
        style={styles.blurContainer}
      >
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            
            return (
              <TouchableOpacity 
                key={tab.path}
                style={[
                  styles.tabBarItem,
                  Platform.OS === 'web' && styles.webTabBarItem,
                  isActive && Platform.OS === 'web' && styles.webActiveTabBarItem
                ]}
                onPress={() => router.push(tab.path as any)}
                activeOpacity={0.7}
              >
                <Animated.View 
                  style={[
                    styles.iconContainer,
                    Platform.OS === 'web' && styles.webIconContainer,
                    getAnimatedStyle(isActive)
                  ]}
                >
                  <Ionicons 
                    name={isActive ? tab.activeName : tab.name as any}
                    size={Platform.OS === 'web' ? 28 : 24} 
                    color={
                      isActive 
                        ? (isDark ? "#3478F6" : "#007AFF")
                        : (isDark ? "#FFFFFF" : "#666")
                    }
                  />
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.select({
      web: 40,
      default: 0
    }),
    left: 0,
    right: 0,
    paddingHorizontal: Platform.OS === 'web' ? '5%' : 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
    ...(Platform.OS === 'web' && {
      pointerEvents: 'box-none',
    }),
  },
  blurContainer: {
    borderRadius: Platform.OS === 'web' ? 12 : 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: Platform.OS === 'web' ? '100%' : '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
    alignSelf: 'center',
    margin: Platform.OS === 'web' ? 16 : 0,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'web' ? 8 : 12,
    width: '100%',
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: Platform.OS === 'web' ? 80 : undefined,
  },
  webTabBarItem: {
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 2,
  },
  webActiveTabBarItem: {
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  iconContainer: {
    width: Platform.OS === 'web' ? 40 : 50,
    height: Platform.OS === 'web' ? 40 : 50,
    borderRadius: Platform.OS === 'web' ? 20 : 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
  }
});

export default TabBar;