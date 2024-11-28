import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
//backend
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
const router = useRouter();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(uid);
    } else {
    //router.push('../(auth)/login');
  }
});

const HEADER_HEIGHT = 120; 

interface DayButtonProps {
  day: string;
  active: boolean;
}

const DayButton: React.FC<DayButtonProps> = ({ day, active }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <TouchableOpacity 
      style={[
        styles.dayButton, 
        active && { backgroundColor: isDarkMode ? '#3478F6' : '#007AFF' },
        isDarkMode ? styles.darkDayButton : styles.lightDayButton
      ]}
    >
      <Text 
        style={[
          styles.dayButtonText, 
          active && styles.activeDayButtonText,
          isDarkMode ? styles.darkDayButtonText : styles.lightDayButtonText
        ]}
      >
        {day}
      </Text>
      {active && (
        <View style={[
          styles.activeDot,
          { backgroundColor: isDarkMode ? '#3478F6' : '#007AFF' }
        ]} />
      )}
    </TouchableOpacity>
  );
};

interface LessonCardProps {
  image: string;
  block: string;
  title: string;
  duration: string;
}

const LessonCard: React.FC<LessonCardProps> = ({ image, block, title, duration }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.lessonCard, isDarkMode ? styles.darkLessonCard : styles.lightLessonCard]}>
      <View style={[
        styles.iconContainer, 
        isDarkMode ? { backgroundColor: '#2C2C2E' } : { backgroundColor: '#F5F5F5' }
      ]}>
        <Ionicons 
          name={image as any} 
          size={50} 
          color={isDarkMode ? "#FFFFFF" : "#666"} 
        />
      </View>
      <View style={styles.lessonInfo}>
        <Text style={[styles.lessonBlock, isDarkMode ? styles.darkText : styles.lightText]}>{block}</Text>
        <Text style={[styles.lessonTitle, isDarkMode ? styles.darkText : styles.lightText]}>{title}</Text>
        <View style={styles.lessonDuration}>
          <Ionicons name="time-outline" size={16} color={isDarkMode ? "#FFFFFF" : "#666"} />
          <Text style={[styles.lessonDurationText, isDarkMode ? styles.darkText : styles.lightText]}>{duration}</Text>
        </View>
      </View>
    </View>
  );
};

export default function MainScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerVisible, setHeaderVisible] = useState(true);
  const today = new Date().getDay();
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const adjustedToday = today === 0 ? 6 : today - 1;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const forceUpdate = () => {
      setHeaderVisible(prev => prev);
    };
    forceUpdate();
  }, [colorScheme]);

  const scrollListener = useCallback(({ value }: { value: number }) => {
    setHeaderVisible(value < HEADER_HEIGHT);
  }, []);

  useEffect(() => {
    const listener = scrollY.addListener(scrollListener);
    return () => scrollY.removeListener(listener);
  }, [scrollY, scrollListener]);

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        isDarkMode ? styles.darkContainer : styles.lightContainer
      ]}
    >
      <Animated.View 
        style={[
          styles.header,
          { opacity: headerOpacity },
          isDarkMode ? styles.darkHeader : styles.lightHeader
        ]}
        key={colorScheme}
      >
        <Image
          source={require('@/assets/images/carnetlify.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.daysContainer}>
          {days.map((day, index) => (
            <DayButton
              key={index}
              day={day}
              active={index === adjustedToday}
            />
          ))}
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={{ height: HEADER_HEIGHT }} /> 

        <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Mis lecciones</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Lecciones pendientes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Lecciones completadas</Text>
          </TouchableOpacity>
        </View>

        <LessonCard
          image="people-outline"
          block="Bloque 1"
          title="Lección 01 -  Definiciones relativas al factor humano"
          duration="10m"
        />
        <LessonCard
          image="car-outline"
          block="Bloque 2"
          title="Lección 02 - 1.2 Definiciones relativas al factor vehículo"
          duration="15m"
        />
        <LessonCard
          image="https://example.com/cyclist.jpg"
          block="Bloque 3"
          title="Lección 03 - Definiciones relativas al factor vía"
          duration="10m"
        />
        <LessonCard
          image="https://example.com/car.jpg"
          block="Bloque "
          title="Lección 04 - Luces para ser vistos"
          duration="15m"
        />
      </Animated.ScrollView>

      <View style={[styles.tabBar, isDarkMode ? styles.darkTabBar : styles.lightTabBar]}>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="home" size={24} color={isDarkMode ? "#3478F6" : "#007AFF"} />
          <Text style={[styles.tabBarText, { color: isDarkMode ? "#3478F6" : "#007AFF" }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="calendar" size={24} color={isDarkMode ? "#FFFFFF" : "#666"} />
          <Text style={[styles.tabBarText, isDarkMode ? styles.darkText : styles.lightText]}>Reservar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="chatbubbles" size={24} color={isDarkMode ? "#FFFFFF" : "#666"} />
          <Text style={[styles.tabBarText, isDarkMode ? styles.darkText : styles.lightText]}>Mensajes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabBarItem}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person" size={24} color={isDarkMode ? "#FFFFFF" : "#666"} />
          <Text style={[styles.tabBarText, isDarkMode ? styles.darkText : styles.lightText]}>Perfil</Text>

        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#F5F5F5',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  lightHeader: {
    backgroundColor: '#FFFFFF',
  },
  darkHeader: {
    backgroundColor: '#000000',
  },
  logo: {
    width: Dimensions.get('window').width * 0.5,
    height: 100,
    marginTop: 20,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  dayButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  lightDayButton: {
    backgroundColor: '#E0E0E0',
  },
  darkDayButton: {
    backgroundColor: '#333333',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lightDayButtonText: {
    color: '#666',
  },
  darkDayButtonText: {
    color: '#FFFFFF',
  },
  activeDayButtonText: {
    color: 'white',
  },
  activeDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  lessonCard: {
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  lightLessonCard: {
    backgroundColor: 'white',
  },
  darkLessonCard: {
    backgroundColor: '#1C1C1E',
  },
  lessonImage: {
    width: '100%',
    height: 150,
  },
  lessonInfo: {
    padding: 16,
  },
  lessonBlock: {
    fontSize: 12,
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lessonDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonDurationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  lightTabBar: {
    backgroundColor: 'white',
  },
  darkTabBar: {
    backgroundColor: '#1C1C1E',
  },
  tabBarItem: {
    alignItems: 'center',
  },
  tabBarText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  iconContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});
