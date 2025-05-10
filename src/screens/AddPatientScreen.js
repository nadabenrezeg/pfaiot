import DateTimePicker from '@react-native-community/datetimepicker';
import { getDatabase, ref, set } from 'firebase/database';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Erreur', 'Veuillez remplir au moins le nom et le prénom.');
      return;
    }

    try {
      const dbFirestore = getFirestore();
      const dbRealtime = getDatabase();
      const patientId = Date.now().toString();

      // Données pour Firestore
      const patientData = {
        id: patientId,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        birthDate: birthDate ? birthDate.toISOString() : '',
        birthPlace,
        lastVisit: lastVisit ? lastVisit.toISOString() : '',
        weight,
        notes,
        createdAt: new Date().toISOString(),
      };

      // Données pour Realtime Database
      const deviceSettings = {
        led_green: true,
        led_red: false,
        "servo-time-matin": "08:00",
        "servo-time-midi": "12:30",
        "servo-time-soir": "19:00",
        servo_time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        temperature: 0
      };

      // Enregistrement dans Firestore
      await addDoc(collection(dbFirestore, 'patients'), patientData);

      // Enregistrement dans Realtime Database
      await set(ref(dbRealtime, `patients/${patientId}/device_settings`), deviceSettings);

      Alert.alert('Succès', 'Patient ajouté avec succès');
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      Alert.alert('Erreur', "Impossible d'ajouter le patient");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={28} color="#00796B" />
        </TouchableOpacity>
        <Text style={styles.title}>Nouveau Patient</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        
        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color="#00796B" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor="#7A9D96"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color="#00796B" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor="#7A9D96"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <Text style={styles.sectionTitle}>Détails médicaux</Text>

        <TouchableOpacity 
          onPress={() => setShowBirthDatePicker(true)} 
          style={styles.dateInput}
          activeOpacity={0.8}
        >
          <Icon name="event" size={20} color="#00796B" style={styles.icon} />
          <Text style={styles.dateText}>
            {birthDate ? formatDate(birthDate) : 'Date de naissance'}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Icon name="place" size={20} color="#00796B" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Lieu de naissance"
            placeholderTextColor="#7A9D96"
            value={birthPlace}
            onChangeText={setBirthPlace}
          />
        </View>

        <TouchableOpacity 
          onPress={() => setShowLastVisitPicker(true)} 
          style={styles.dateInput}
          activeOpacity={0.8}
        >
          <Icon name="event-available" size={20} color="#00796B" style={styles.icon} />
          <Text style={styles.dateText}>
            {lastVisit ? formatDate(lastVisit) : 'Dernière visite'}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Icon name="monitor-weight" size={20} color="#00796B" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Poids (kg)"
            placeholderTextColor="#7A9D96"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="notes" size={20} color="#00796B" style={[styles.icon, { alignSelf: 'flex-start' }]} />
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Notes médicales..."
            placeholderTextColor="#7A9D96"
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

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

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Enregistrer</Text>
          <Icon name="save" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E0F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#B2EBF2',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#00796B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 121, 107, 0.1)',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00796B',
    letterSpacing: 0.5,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00796B',
    marginVertical: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#B2DFDB',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#00796B',
    borderWidth: 1,
    borderColor: '#B2DFDB',
    shadowColor: '#00796B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#B2DFDB',
    shadowColor: '#00796B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#00796B',
    marginLeft: 10,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00796B',
    borderRadius: 14,
    padding: 16,
    marginTop: 25,
    shadowColor: '#00796B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
});

export default AddPatientScreen;