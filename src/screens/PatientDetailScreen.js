import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PatientDetailScreen = ({ route, navigation }) => {
  const { patient } = route.params;
  const [image, setImage] = useState(patient.image || null);
  const [disease, setDisease] = useState(patient.disease || '');
  const [notes, setNotes] = useState(patient.description || '');
  const buttonScale = new Animated.Value(1);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pickImage = async () => {
    animatePress();
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès aux photos.');
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
        await updateDoc(patientRef, { image: selectedImageUri });
      } catch (error) {
        console.error('Erreur en sauvegardant la photo :', error);
        Alert.alert('Erreur', "Impossible d'enregistrer l'image.");
      }
    }
  };

  const saveTextFields = async () => {
    animatePress();
    try {
      const db = getFirestore();
      const patientRef = doc(db, 'patients', patient.id);
      await updateDoc(patientRef, { disease, description: notes });
      Alert.alert('Succès', 'Les informations ont été mises à jour.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      Alert.alert('Erreur', 'Échec de la mise à jour.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Icon name="arrow-back" size={28} color="#004B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails Patient</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
          <View style={styles.avatarContainer}>
            <Image
              source={image ? { uri: image } : require('../assets/avatar.png')}
              style={styles.avatarImage}
            />
            <View style={styles.cameraIcon}>
              <Icon name="photo-camera" size={20} color="#FFF" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.patientName}>M. {patient.name}</Text>
      </View>

      {/* Info Card */}
      <LinearGradient
        colors={['#CFF5E7', '#9ED5C5']}
        style={styles.infoCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Maladie</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Entrer la maladie"
            placeholderTextColor="#7A9D96"
            value={disease}
            onChangeText={setDisease}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Notes médicales</Text>
          <TextInput
            style={[styles.inputField, styles.multilineInput]}
            placeholder="Notes ou remarques"
            placeholderTextColor="#7A9D96"
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </LinearGradient>

      {/* Buttons */}
      <View style={styles.actionsContainer}>
        <Animated.View style={[styles.animatedButton]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => navigation.navigate('CalendarScreen', { patient })}
            activeOpacity={0.7}
          >
            <Icon name="event-note" size={22} color="#FFF" />
            <Text style={styles.buttonText}>Calendrier</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.animatedButton]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('MedicationDetailsScreen', { patient })}
            activeOpacity={0.7}
          >
            <Icon name="show-chart" size={22} color="#FFF" />
            <Text style={styles.buttonText}>Suivi médical</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.animatedButton]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={saveTextFields}
            activeOpacity={0.7}
          >
            <Icon name="save" size={22} color="#FFF" />
            <Text style={styles.buttonText}>Enregistrer</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#B2EBF2',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 75, 75, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#004B4B',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#A0D6B4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#004B4B',
    borderRadius: 15,
    padding: 5,
  },
  patientName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#004B4B',
    marginTop: 15,
    textAlign: 'center',
  },
  infoCard: {
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004B4B',
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#004B4B',
    borderWidth: 1,
    borderColor: 'rgba(0, 75, 75, 0.2)',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#00796B',
  },
  secondaryButton: {
    backgroundColor: '#004B4B',
  },
  saveButton: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 10,
  },
});

export default PatientDetailScreen;
