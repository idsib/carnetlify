import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Dimensions, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Sidebar from '../../components/SideBar';
import TabBar from '../../components/TabBar';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CalendarWidget from '../../components/CalendarWidget';
import { useUser } from '@/context/UserContext';

const auth = getAuth();
const HEADER_HEIGHT = Platform.OS === 'ios' ? 80 : 70;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 50;

interface LessonCardProps {
  icon: React.ReactNode;
  block: string;
  title: string;
  duration: string;
  onPress?: () => void;
  isLocked?: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({ 
  icon, 
  block, 
  title, 
  duration, 
  onPress,
  isLocked 
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (isLocked) return;
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 3,
      tension: 40
    }).start();
  };

  const handlePressOut = () => {
    if (isLocked) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40
    }).start();
  };

  return (
    <TouchableOpacity 
      onPress={isLocked ? undefined : onPress}
      activeOpacity={isLocked ? 1 : 0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        style={[
          styles.lessonCard, 
          isDarkMode ? styles.darkLessonCard : styles.lightLessonCard,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <LinearGradient
          colors={isDarkMode 
            ? ['#2C2C2E', '#1C1C1E'] 
            : ['#F5F5F5', '#FFFFFF']
          }
          style={styles.lessonCardGradient}
        >
          <View style={styles.lessonCardContent}>
            <View style={[
              styles.iconContainer, 
              isDarkMode 
                ? { backgroundColor: '#3A3A3C' } 
                : { backgroundColor: '#E5E5E5' }
            ]}>
              {icon}
            </View>
            <View style={styles.lessonInfo}>
              <Text style={[
                styles.lessonBlock, 
                isDarkMode ? styles.darkText : styles.lightText,
                isLocked && styles.lockedText
              ]}>
                {block}
              </Text>
              <Text 
                style={[
                  styles.lessonTitleHeader, 
                  isDarkMode ? styles.darkText : styles.lightText,
                  isLocked && styles.lockedText
                ]}
                numberOfLines={2}
              >
                {title}
              </Text>
              <View style={styles.lessonDuration}>
                <Ionicons 
                  name="time-outline" 
                  size={14} 
                  color={isLocked ? (isDarkMode ? '#666666' : '#999999') : (isDarkMode ? '#FFFFFF' : '#000000')} 
                />
                <Text style={[
                  styles.durationText,
                  isDarkMode ? styles.darkText : styles.lightText,
                  isLocked && styles.lockedText
                ]}>
                  {duration}
                </Text>
              </View>
            </View>
            {isLocked && (
              <View style={styles.lockIconContainer}>
                <Ionicons 
                  name="lock-closed" 
                  size={24} 
                  color={isDarkMode ? '#666666' : '#999999'} 
                />
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

interface StreakWidgetProps {
  isDarkMode: boolean;
}

const StreakWidget: React.FC<StreakWidgetProps> = ({ isDarkMode }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={isDarkMode 
        ? ['#1C1C1E', '#2C2C2E'] 
        : ['#FFFFFF', '#F5F5F5']
      }
      style={[styles.streakCard, isDarkMode ? styles.darkStreakCard : styles.lightStreakCard]}
    >
      <View style={styles.streakHeader}>
        <Text style={[styles.todayText, isDarkMode ? styles.darkText : styles.lightText]}>
          Progreso Diario
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={24} color="#0A84FF" />
          <Text style={[styles.streakText, { color: '#0A84FF' }]}>
            <Text style={[styles.streakNumber, { color: '#0A84FF' }]}>7</Text> días seguidos
          </Text>
        </View>
        <View style={styles.daysContainer}>
          <Text style={[styles.daysText, isDarkMode ? styles.darkSubText : styles.lightSubText]}>
            Lecciones: <Text style={styles.daysNumber}>4/9</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.progressContainer, { backgroundColor: 'transparent' }]}>
        {[...Array(9)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.progressDot,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 100],
                  extrapolate: 'clamp'
                }),
                backgroundColor: index < 3 
                  ? '#0A84FF'
                  : 'rgba(10, 132, 255, 0.3)',
                marginHorizontal: 2
              }
            ]}
          />
        ))}
      </View>
    </LinearGradient>
  );
};

export default function MainScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState('pending');
  const scrollY = useRef(new Animated.Value(0)).current;
  const isWeb = Platform.OS === 'web';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userInfo } = useUser();

  const handleLockedFeature = () => {
    router.push('/sections/subscriptionPlan');
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const logoOpacity = scrollY.interpolate({
    inputRange: [0, (HEADER_HEIGHT - HEADER_MIN_HEIGHT) * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const logoScale = scrollY.interpolate({
    inputRange: [0, (HEADER_HEIGHT - HEADER_MIN_HEIGHT) * 0.5],
    outputRange: [1, 0.8],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User logged in:', user.uid);
      } else {
        // Uncomment to redirect to login if not authenticated
        // router.push('../(auth)/login');
      }
    });

    return () => unsubscribe();
  }, []);

  const renderIcons = (name: string, size: number = 50) => (
    <Ionicons 
      name={name as any} 
      size={size} 
      color={isDarkMode ? "#FFFFFF" : "#666"} 
    />
  );

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        isDarkMode ? styles.containerDark : styles.container
      ]}
    >
      <View style={styles.contentWrapper}>
        {isWeb && <Sidebar onClose={() => {}} />}
        <View style={styles.mainContent}>
          {!isWeb && (
            <Animated.View 
              style={[
                styles.headerContainer,
                {
                  height: headerHeight,
                  opacity: headerOpacity
                }
              ]}
            >
              <BlurView
                intensity={isDarkMode ? 30 : 50}
                tint={isDarkMode ? 'dark' : 'light'}
                style={[
                  styles.headerBlur,
                  isDarkMode ? styles.darkHeader : styles.lightHeader
                ]}
              >
                <Animated.View style={[
                  styles.headerContent,
                  {
                    transform: [{ scale: logoScale }],
                    opacity: logoOpacity
                  }
                ]}>
                  <Image
                    source={require('@/assets/images/carnetlify.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </Animated.View>
              </BlurView>
            </Animated.View>
          )}

          <Animated.ScrollView
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              {
                paddingBottom: Platform.OS === 'ios' ? 85 : 70,
              },
              isWeb ? {
                paddingTop: 20,
              } : {
                paddingTop: HEADER_HEIGHT + 10,
              }
            ]}
            bounces={true}
            overScrollMode="always"
          >
            <View style={styles.tabsContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'pending' && styles.activeTab]} 
                onPress={() => setActiveTab('pending')}
              >
                <Text style={[
                  styles.tabText, 
                  activeTab === 'pending' ? styles.activeTabText : { color: '#666666' }
                ]}>Lecciones pendientes</Text>
                {activeTab === 'pending' && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'completed' && styles.activeTab]} 
                onPress={() => setActiveTab('completed')}
              >
                <Text style={[
                  styles.tabText, 
                  activeTab === 'completed' ? styles.activeTabText : { color: '#666666' }
                ]}>Lecciones completadas</Text>
                {activeTab === 'completed' && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            </View>
            <StreakWidget isDarkMode={isDarkMode} />

            <LessonCard
              icon={renderIcons('people-outline')}
              block="Bloque 1"
              title="Lección 01 - Definiciones Relacionadas con Factores Humanos"
              duration="10 min"
              onPress={userInfo.isLocked === "true" ? handleLockedFeature : () => router.push('/lessons/sub1/Block')}
              isLocked={userInfo.isLocked === "true"}
            />
            <LessonCard
              icon={renderIcons('car-outline')}
              block="Bloque 2"
              title="Lección 02 - Definiciones de Factores Vehiculares"
              duration="15 min"
              onPress={userInfo.isLocked === "true" ? handleLockedFeature : () => router.push('/lessons/sub1/Block')}
              isLocked={userInfo.isLocked === "true"}
            />
            <LessonCard
              icon={renderIcons('bicycle-outline')}
              block="Bloque 3"
              title="Lección 03 - Definiciones de Factores Viales"
              duration="10 min"
              onPress={userInfo.isLocked === "true" ? handleLockedFeature : () => router.push('/lessons/sub1/Block')}
              isLocked={userInfo.isLocked === "true"}
            />
            <LessonCard
              icon={renderIcons('flashlight-outline')}
              block="Bloque 4"
              title="Lección 04 - Visibilidad e Iluminación"
              duration="15 min"
              onPress={userInfo.isLocked === "true" ? handleLockedFeature : () => router.push('/lessons/sub1/Block')}
              isLocked={userInfo.isLocked === "true"}
            />
          </Animated.ScrollView>
        </View>
        {isWeb && <CalendarWidget />}
        {isSidebarOpen && (
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        )}
      </View>
      {Platform.OS !== 'web' && (
        <TabBar />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  headerBlur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  darkHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lightHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
  darkSubText: {
    color: '#8E8E93',
  },
  lightSubText: {
    color: '#6E6E73',
  },
  lessonCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  darkLessonCard: {
    backgroundColor: '#1C1C1E',
  },
  lightLessonCard: {
    backgroundColor: '#FFFFFF',
  },
  lessonCardGradient: {
    width: '100%',
  },
  lessonCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonBlock: {
    fontSize: 14,
    marginBottom: 4,
  },
  lessonTitleHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  lessonDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  streakCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 16,
  },
  darkStreakCard: {
    backgroundColor: '#1C1C1E',
  },
  lightStreakCard: {
    backgroundColor: '#FFFFFF',
  },
  streakHeader: {
    marginBottom: 16,
  },
  todayText: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#0A84FF',
  },
  streakNumber: {
    fontWeight: 'bold',
    color: '#0A84FF',
  },
  daysContainer: {
    alignItems: 'flex-end',
  },
  daysText: {
    fontSize: 14,
  },
  daysNumber: {
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressDot: {
    height: '100%',
    backgroundColor: '#0A84FF',
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  tab: {
    paddingVertical: 8,
    marginRight: 24,
    position: 'relative',
  },
  activeTab: {
    // Style will be handled by the indicator
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#0A84FF',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#0A84FF',
  },
  lockIconContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  lockedText: {
    opacity: 0.5,
  },
});
