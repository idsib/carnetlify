import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { auth } from '../../src/firebaseTest/config';


const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch('http://localhost:3000/userProfile', {
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        });
        const userData = await response.json();
        setUser(userData);  // Guarda el perfil en el estado de usuario
      } catch (error) {
        console.error('Error al obtener perfil del usuario:', error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) {
    return <Text>Cargando perfil...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.birthDate}>{user.birthDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  birthDate: {
    fontSize: 16,
    color: 'gray',
  },
});

export default UserProfile;
