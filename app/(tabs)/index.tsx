// src/screens/MainMenu.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

const MainMenu = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carnetlify</Text>
        <Text style={styles.subtitle}>Optimiza tu camino hacia el carnet de conducir</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => alert('Lecciones')}>
          <Text style={styles.menuText}>Lecciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => alert('Tests')}>
          <Text style={styles.menuText}>Tests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => alert('Exámenes')}>
          <Text style={styles.menuText}>Exámenes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => alert('Configuración')}>
          <Text style={styles.menuText}>Configuración</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF2F8', // Fondo azul claro
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E86C1', // Azul oscuro
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#5DADE2', // Azul claro
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  menuContainer: {
    width: '90%',
  },
  menuButton: {
    backgroundColor: '#3498DB', // Azul principal
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 20,
    color: '#fff', // Texto blanco para contraste
    fontWeight: '600',
  },
});

export default MainMenu;
