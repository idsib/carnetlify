import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const HEADER_HEIGHT = 120; 

interface DayButtonProps {
  day: string;
  active: boolean;
}

const DayButton: React.FC<DayButtonProps> = ({ day, active }) => (
  <TouchableOpacity style={[styles.dayButton, active && styles.activeDayButton]}>
    <Text style={[styles.dayButtonText, active && styles.activeDayButtonText]}>{day}</Text>
    {active && <View style={styles.activeDot} />}
  </TouchableOpacity>
);

interface LessonCardProps {
  image: string;
  block: string;
  title: string;
  duration: string;
}

const LessonCard: React.FC<LessonCardProps> = ({ image, block, title, duration }) => (
  <View style={styles.lessonCard}>
    <Image source={{ uri: image }} style={styles.lessonImage} />
    <View style={styles.lessonInfo}>
      <Text style={styles.lessonBlock}>{block}</Text>
      <Text style={styles.lessonTitle}>{title}</Text>
      <View style={styles.lessonDuration}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.lessonDurationText}>{duration}</Text>
      </View>
    </View>
  </View>
);

export default function MainScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerVisible, setHeaderVisible] = useState(true);
  const today = new Date().getDay();
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const adjustedToday = today === 0 ? 6 : today - 1;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      setHeaderVisible(value < HEADER_HEIGHT);
    });
    return () => scrollY.removeListener(listener);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
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
        <View style={{ height: HEADER_HEIGHT }} /> {/* Espacio para el header */}

        <Text style={styles.title}>Mis lecciones</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Lecciones pendientes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Lecciones completadas</Text>
          </TouchableOpacity>
        </View>

        <LessonCard
          image="https://example.com/cyclist.jpg"
          block="Bloque 2"
          title="Lección 01 - Utilización del arcén"
          duration="10m"
        />
        <LessonCard
          image="https://example.com/car.jpg"
          block="Bloque 2"
          title="Lección 02 - Luces para ser vistos"
          duration="15m"
        />
        <LessonCard
          image="https://example.com/cyclist.jpg"
          block="Bloque 2"
          title="Lección 03 - Utilización del arcén"
          duration="10m"
        />
        <LessonCard
          image="https://example.com/car.jpg"
          block="Bloque 2"
          title="Lección 04 - Luces para ser vistos"
          duration="15m"
        />
      </Animated.ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="home" size={24} color="#007AFF" />
          <Text style={styles.tabBarText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="calendar" size={24} color="#666" />
          <Text style={styles.tabBarText}>Reservar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="chatbubbles" size={24} color="#666" />
          <Text style={styles.tabBarText}>Mensajes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarItem}>
          <Ionicons name="person" size={24} color="#666" />
          <Text style={styles.tabBarText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 10,
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
    backgroundColor: '#E0E0E0',
  },
  activeDayButton: {
    backgroundColor: '#007AFF',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flame: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  flameText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
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
    color: '#666',
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
    color: '#666',
    marginLeft: 4,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  tabBarItem: {
    alignItems: 'center',
  },
  tabBarText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
});
