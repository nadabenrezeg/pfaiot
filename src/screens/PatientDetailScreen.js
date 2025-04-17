import { LinearGradient } from 'expo-linear-gradient'; // si tu veux un fond dégradé
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PatientDetailScreen = ({ route, navigation }) => {
  const { patient } = route.params;

  return (
    <View style={styles.container}>
      {/* Header Icons */}
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image
        //  source={require('../assets/clip.png')}// Remplace avec ton image
        //  style={styles.clip.png}
        />
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://example.com/default-avatar.png' }}
          style={styles.avatar}
        />
      </View>

      {/* Info Container */}
      <LinearGradient colors={['#CFF5E7', '#9ED5C5']} style={styles.infoContainer}>
        <Text style={styles.nameText}>Mr. {patient.name}</Text>

        <Text style={styles.label}>• Maladie :</Text>
        <Text style={styles.value}>{patient.disease}</Text>

        <Text style={styles.label}>• Médicaments :</Text>
        <Text style={styles.value}>{patient.medication}</Text>

        <Text style={styles.label}>• Description :</Text>
        <Text style={styles.value}>{patient.description}</Text>
      </LinearGradient>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity 
  style={styles.yellowButton} 
  onPress={() => navigation.navigate('MedicationDetailsScreen', { patient })} // Assurez-vous que le nom est correct
>
  <Text style={styles.buttonText}>Details</Text>
</TouchableOpacity>
        <TouchableOpacity
          style={styles.yellowButton}
          onPress={() => navigation.navigate('CalendarScreen')}
        >
          <Text style={styles.buttonText}>Calendrier</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6E6',
    padding: 20,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align items vertically
  },
  backButtonText: {
    fontSize: 24,
  },
  clip: {
    width: 20, // Taille réduite
    height: 20, // Taille réduite
  },
  avatarContainer: {
    alignSelf: 'center',
    backgroundColor: '#A0D6B4',
    borderRadius: 100,
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  infoContainer: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    color: '#004B4B',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    color: '#004B4B',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  yellowButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default PatientDetailScreen;