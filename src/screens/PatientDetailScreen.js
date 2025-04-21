import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PatientDetailScreen = ({ route, navigation }) => {
  const { patient } = route.params;
  const [image, setImage] = useState(patient.image || null);

  const [disease, setDisease] = useState(patient.disease || '');
  const [notes, setNotes] = useState(patient.description || '');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
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
          image: selectedImageUri,
        });
      } catch (error) {
        console.error('Erreur en sauvegardant la photo :', error);
        Alert.alert('Erreur', "Impossible d'enregistrer l'image.");
      }
    }
  };

  const saveTextFields = async () => {
    try {
      const db = getFirestore();
      const patientRef = doc(db, 'patients', patient.id);
      await updateDoc(patientRef, {
        disease,
        description: notes,
      });
      Alert.alert('Succès', 'Les informations ont été mises à jour.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      Alert.alert('Erreur', 'Échec de la mise à jour.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image />
      </View>

      {/* Avatar */}
      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        <Image
          source={image ? { uri: image } : { uri: 'https://example.com/default-avatar.png' }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      {/* Infos */}
      <LinearGradient colors={['#CFF5E7', '#9ED5C5']} style={styles.infoContainer}>
        <Text style={styles.nameText}>M. {patient.name}</Text>

        <Text style={styles.label}>• Maladie :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrer la maladie"
          value={disease}
          onChangeText={setDisease}
        />

    

        <Text style={styles.label}>• Notes :</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Notes ou remarques médicales"
          multiline
          value={notes}
          onChangeText={setNotes}
        />
      </LinearGradient>

      {/* Boutons d'action */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CalendarScreen', { patient })}
        >
          <Text style={styles.buttonText}>Traitements</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('MedicationDetailsScreen', { patient })}
        >
          <Text style={styles.buttonText}>Suivi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={saveTextFields}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#E6E6E6',
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 40,
  },
  backButtonText: {
    fontSize: 24,
  },
  avatarContainer: {
    alignSelf: 'center',
    backgroundColor: '#A0D6B4',
    borderRadius: 70,
    marginTop: 10,
    marginBottom: 20,
    padding: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004B4B',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#004B4B',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
    borderColor: '#00796B',
    borderWidth: 1,
  },
  linkText: {
    color: '#00796B',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 8,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'column',
   
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 70,
  },
  actionButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
});

export default PatientDetailScreen;