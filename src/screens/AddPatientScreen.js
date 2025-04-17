import { addDoc, collection, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AddPatientScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const db = getFirestore();

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const newPatient = {
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'patients'), newPatient);
      Alert.alert('Succès', 'Patient ajouté avec succès.');
      navigation.goBack(); // Retour à HomeScreen
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      Alert.alert('Erreur', "Impossible d'ajouter le patient.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un patient</Text>
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B2EBF2',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#00796B',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    borderColor: '#00796B',
    borderWidth: 1,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#00796B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddPatientScreen;
