import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getFirestore, updateDoc } from 'firebase/firestore'; // en haut (si pas déjà importé)
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


const PatientDetailScreen = ({ route, navigation }) => {
  const { patient } = route.params;

  const [image, setImage] = useState(patient.image || null); // image de profil

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l’accès aux photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
    
      try {
        const db = getFirestore();
        const patientRef = doc(db, 'patients', patient.id);
        await updateDoc(patientRef, {
          image: selectedImageUri, // on enregistre l'image dans Firestore
        });
      } catch (error) {
        console.error('Erreur en sauvegardant la photo :', error);
        Alert.alert('Erreur', "Impossible d'enregistrer l'image.");
      }
    }
    
  };

  return (
    <View style={styles.container}>
      {/* Header Icons */}
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image
          // source={require('../assets/clip.png')} // Optionnel
          // style={styles.clip}
        />
      </View>

      {/* Avatar cliquable */}
      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        <Image
          source={
            image
              ? { uri: image }
              : { uri: 'https://example.com/default-avatar.png' }
          }
          style={styles.avatar}
        />
      </TouchableOpacity>

      {/* Infos patient */}
      <LinearGradient colors={['#CFF5E7', '#9ED5C5']} style={styles.infoContainer}>
        <Text style={styles.nameText}>Mr. {patient.name}</Text>

        <Text style={styles.label}>• Maladie :</Text>
        <Text style={styles.value}>{patient.disease || 'Non renseignée'}</Text>

        <Text style={styles.label}>• Médicaments :</Text>
        <Text style={styles.value}>{patient.medication || 'Non renseigné'}</Text>

        <Text style={styles.label}>• Description :</Text>
        <Text style={styles.value}>{patient.description || 'Non renseignée'}</Text>
      </LinearGradient>

      {/* Boutons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.yellowButton}
          onPress={() => navigation.navigate('MedicationDetailsScreen', { patient })}
        >
          <Text style={styles.buttonText}>Détails</Text>
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

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6E6',
    padding: 20,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 50,
  },
  backButtonText: {
    fontSize: 24,
  },
  clip: {
    width: 20,
    height: 20,
  },
  avatarContainer: {
    alignSelf: 'center',
    backgroundColor: '#A0D6B4',
    borderRadius: 100,
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
    marginTop: 2,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
    color: '#004B4B',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    color: '#004B4B',
  },
  value: {
    marginTop: 10,
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