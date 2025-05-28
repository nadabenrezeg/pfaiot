import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FirstScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PillMate</Text>
      <View style={styles.imageCard}>
        <Image
          source={require('../assets/sss.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B2EBF2',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 40, 
    textAlign: 'center',
    textShadowColor: 'rgba(0, 121, 107, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  imageCard: {
    width: 260,
    height: 260,
    backgroundColor: '#00796B',
    borderRadius: 130,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50, 
    borderWidth: 3, 
    borderColor: '#4FB3BF',
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#00796B',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1, 
    borderColor: '#4FB3BF',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16, 
    letterSpacing: 0.5, 
  },
});