import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

const formatDate = (date) => {
  return date ? new Intl.DateTimeFormat('fr-FR').format(date) : '';
};

const AddPatientScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [birthPlace, setBirthPlace] = useState('');
  const [lastVisit, setLastVisit] = useState(null);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showLastVisitPicker, setShowLastVisitPicker] = useState(false);

  const db = getFirestore();

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Erreur', 'Veuillez remplir au moins le nom et le prénom.');
      return;
    }

    try {
      const newPatient = {
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        birthDate: birthDate ? birthDate.toISOString() : '',
        birthPlace,
        lastVisit: lastVisit ? lastVisit.toISOString() : '',
        weight,
        notes,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'patients'), newPatient);
      Alert.alert('Succès', 'Patient ajouté avec succès.');
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      Alert.alert('Erreur', "Impossible d'ajouter le patient.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajouter un nouveau patient</Text>
      
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

      <Text style={styles.sectionTitle}>Informations médicales</Text>

      <TouchableOpacity onPress={() => setShowBirthDatePicker(true)} style={styles.dateInput}>
        <Text style={styles.dateText}>
          {birthDate ? formatDate(birthDate) : 'Date de naissance'}
        </Text>
      </TouchableOpacity>
      {showBirthDatePicker && (
        <DateTimePicker
          value={birthDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowBirthDatePicker(false);
            if (selectedDate) setBirthDate(selectedDate);
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Lieu de naissance"
        value={birthPlace}
        onChangeText={setBirthPlace}
      />

      <TouchableOpacity onPress={() => setShowLastVisitPicker(true)} style={styles.dateInput}>
        <Text style={styles.dateText}>
          {lastVisit ? formatDate(lastVisit) : 'Dernière visite'}
        </Text>
      </TouchableOpacity>
      {showLastVisitPicker && (
        <DateTimePicker
          value={lastVisit || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowLastVisitPicker(false);
            if (selectedDate) setLastVisit(selectedDate);
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Poids (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Notes médicales, remarques..."
        multiline
        numberOfLines={4}
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#B2EBF2',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#00796B',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#00796B',
    marginVertical: 15,
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
  dateInput: {
    backgroundColor: '#FFF',
    borderColor: '#00796B',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },
  dateText: {
    color: '#333',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#00796B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddPatientScreen;