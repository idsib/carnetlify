import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaz para el progreso de las lecciones
export interface LessonProgress {
  id: string;
  completed: boolean;
  timestamp?: number;
}

const PROGRESS_KEY = '@carnetlify_progress';

// Función para obtener el progreso actual
export const getProgress = async (): Promise<LessonProgress[]> => {
  try {
    const progress = await AsyncStorage.getItem(PROGRESS_KEY);
    return progress ? JSON.parse(progress) : [];
  } catch (error) {
    console.error('Error getting progress:', error);
    return [];
  }
};

// Función para actualizar el progreso de una lección
export const updateLessonProgress = async (lessonId: string, completed: boolean = true): Promise<LessonProgress[]> => {
  try {
    const currentProgress = await getProgress();
    const lessonIndex = currentProgress.findIndex(lesson => lesson.id === lessonId);
    
    if (lessonIndex >= 0) {
      currentProgress[lessonIndex] = {
        ...currentProgress[lessonIndex],
        completed,
        timestamp: Date.now(),
      };
    } else {
      currentProgress.push({
        id: lessonId,
        completed,
        timestamp: Date.now(),
      });
    }
    
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(currentProgress));
    return currentProgress;
  } catch (error) {
    console.error('Error updating progress:', error);
    return [];
  }
};

// Función para calcular el porcentaje total de progreso
export const calculateTotalProgress = async (totalLessons: number): Promise<number> => {
  try {
    const progress = await getProgress();
    const completedLessons = progress.filter(lesson => lesson.completed).length;
    return completedLessons / totalLessons;
  } catch (error) {
    console.error('Error calculating progress:', error);
    return 0;
  }
};
