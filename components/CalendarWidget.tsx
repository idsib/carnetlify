import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const WIDGET_WIDTH = 350;

const CalendarWidget = () => {
  const isDark = useColorScheme() === 'dark';
  const currentDate = new Date();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const renderCalendarDays = () => {
    const calendarDays = [];
    // Agregar días vacíos al principio
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    // Agregar los días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === currentDate.getDate();
      calendarDays.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.dayCell,
            isToday && styles.todayCell
          ]}
        >
          <Text style={[
            styles.dayText,
            isDark ? styles.textDark : styles.textLight,
            isToday && styles.todayText
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return calendarDays;
  };

  return (
    <View style={[
      styles.container,
      isDark ? styles.containerDark : styles.containerLight
    ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[
            styles.monthText,
            isDark ? styles.textDark : styles.textLight
          ]}>
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
        </View>
        
        <View style={styles.calendarContainer}>
          <View style={styles.weekDaysContainer}>
            {days.map((day, index) => (
              <View key={index} style={styles.weekDayCell}>
                <Text style={[
                  styles.weekDayText,
                  isDark ? styles.textDark : styles.textLight
                ]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {renderCalendarDays()}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDGET_WIDTH,
    height: '100%',
    borderLeftWidth: 1,
  },
  containerLight: {
    backgroundColor: '#F5F5F5',
    borderLeftColor: '#E0E0E0',
  },
  containerDark: {
    backgroundColor: '#000000',
    borderLeftColor: '#2F2F2F',
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '600',
  },
  calendarContainer: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  dayText: {
    fontSize: 16,
  },
  todayCell: {
    backgroundColor: '#0A84FF',
    borderRadius: 999,
    width: 32,
    height: 32,
    margin: 4,
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textLight: {
    color: '#000000',
  },
  textDark: {
    color: '#FFFFFF',
  },
});

export default CalendarWidget;
