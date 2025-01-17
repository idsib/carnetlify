import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="main" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
