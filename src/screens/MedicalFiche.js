import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
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

const MedicalFiche = ({ route, navigation }) => {
  const { patient } = route.params;
  const db = getFirestore();

  const [birthDate, setBirthDate] = useState(patient.birthDate ? new Date(patient.birthDate) : null);
  const [birthPlace, setBirthPlace] = useState(patient.birthPlace || '');
  const [lastVisit, setLastVisit] = useState(patient.lastVisit ? new Date(patient.lastVisit) : null);
  const [weight, setWeight] = useState(patient.weight || '');
  const [notes, setNotes] = useState(patient.notes || '');

  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showLastVisitPicker, setShowLastVisitPicker] = useState(false);

  const handleSave = async () => {
    try {
      const patientRef = doc(db, 'patients', patient.id);
      await updateDoc(patientRef, {
        birthDate: birthDate ? birthDate.toISOString() : '',
        birthPlace,
        lastVisit: lastVisit ? lastVisit.toISOString() : '',
        weight,
        notes,
      });

      Alert.alert('Succès', 'Fiche médicale enregistrée.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer les informations.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Fiche médicale de {patient.firstName || ''} {patient.lastName || ''}
      </Text>

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
    padding: 26,
    backgroundColor: '#B2EBF2',
    flexGrow: 1,
  },
  title: {
    marginTop: 50,
    fontSize: 20,
    color: '#00796B',
    marginBottom: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderColor: '#00796B',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
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
    borderRadius: 40,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicalFiche;
