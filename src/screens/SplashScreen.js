import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const spinValue = new Animated.Value(0);

  // Animation rotation pour le logo
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    // Simulation du chargement de l'application
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Remplacez 'Home' par le nom de votre écran principal
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('./assets/medical-logo.png')} // Remplacez par le chemin de votre logo
        style={[styles.logo, { transform: [{ rotate: spin }] }]}
      />
      <Text style={styles.title}>MediCare</Text> {/* Remplacez par le nom de votre app */}
      <Text style={styles.subtitle}>Chargement de votre application médicale...</Text>
      
      {/* Barre de progression */}
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressBarFill, { width: spinValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
        }) }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // ou une couleur médicale comme #e3f2fd (bleu clair)
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2a7fba', // Couleur bleue médicale
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  progressBar: {
    width: '70%',
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 20,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2a7fba',
  },
});

export default SplashScreen;