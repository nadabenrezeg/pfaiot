/*import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import uuid from 'react-native-uuid';

const TreatmentListScreen = ({ route, navigation }) => {
  const { patient } = route.params;
  const db = getFirestore();

  const [treatments, setTreatments] = useState([]);
  const [medications, setMedications] = useState([]);

  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');

  // ⏬ Charger les traitements et médicaments à l'ouverture
  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const patientRef = doc(db, 'patients', patient.id);
      const snapshot = await getDoc(patientRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTreatments(data.treatments || []);
        setMedications(data.medications || []);
      }
    } catch (error) {
      console.error('Erreur de chargement patient :', error);
      Alert.alert('Erreur', "Impossible de charger les données du patient.");
    }
  };

  const handleAddTreatment = async () => {
    if (!medication || !dosage || !frequency) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const newTreatment = {
      id: uuid.v4(),
      medication,
      dosage,
      frequency,
      notes,
      startDate: new Date().toISOString(),
    };

    const updatedTreatments = [...treatments, newTreatment];
    const updatedMedications = medications.includes(medication)
      ? medications
      : [...medications, medication];

    // Mettre à jour les états locaux
    setTreatments(updatedTreatments);
    setMedications(updatedMedications);

    try {
      const patientRef = doc(db, 'patients', patient.id);
      await updateDoc(patientRef, {
        treatments: updatedTreatments,
        medications: updatedMedications,
      });

      // Réinitialiser les champs du formulaire
      setMedication('');
      setDosage('');
      setFrequency('');
      setNotes('');
    } catch (error) {
      console.error('Erreur ajout traitement :', error);
      Alert.alert('Erreur', "Impossible d'enregistrer le traitement.");
    }
  };

  const handleDeleteTreatment = async (id) => {
    const treatmentToDelete = treatments.find(t => t.id === id);
    const filteredTreatments = treatments.filter(t => t.id !== id);
  
    // Vérifier si le médicament est encore utilisé ailleurs
    const isStillUsed = filteredTreatments.some(t => t.medication === treatmentToDelete.medication);
  
    // Si non utilisé ailleurs → on le retire de medications
    const updatedMedications = isStillUsed
      ? medications
      : medications.filter(m => m !== treatmentToDelete.medication);
  
    // Mise à jour des états
    setTreatments(filteredTreatments);
    setMedications(updatedMedications);
  
    // Mise à jour Firestore
    try {
      const patientRef = doc(db, 'patients', patient.id);
      await updateDoc(patientRef, {
        treatments: filteredTreatments,
        medications: updatedMedications,
      });
    } catch (error) {
      console.error('Erreur suppression traitement :', error);
      Alert.alert('Erreur', "Impossible de supprimer le traitement.");
    }
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.treatmentCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>💊 {item.medication}</Text>
        <Text>Dosage : {item.dosage}</Text>
        <Text>Fréquence : {item.frequency}</Text>
        <Text>Notes : {item.notes || '—'}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteTreatment(item.id)}>
        <Text style={styles.deleteButton}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Traitements de {patient.name}</Text>

      <FlatList
        data={treatments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun traitement ajouté.</Text>}
      />

     // {/* Liste des médicaments }*/
     /* <Text style={styles.formTitle}>Médicaments enregistrés :</Text>
      {medications.length === 0 ? (
  <Text style={{ fontStyle: 'italic', color: '#777' }}>Aucun</Text>
) : (
  medications.map((med, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => navigation.navigate('CalendarScreen', { medication: med, patient })}
    >
      <Text style={styles.medItem}>📅 {med}</Text>
    </TouchableOpacity>
  ))
)}

/*
      <View style={styles.form}>
        <Text style={styles.formTitle}>Ajouter un traitement</Text>
        <TextInput
          style={styles.input}
          placeholder="Médicament"
          value={medication}
          onChangeText={setMedication}
        />
        <TextInput
          style={styles.input}
          placeholder="Dosage"
          value={dosage}
          onChangeText={setDosage}
        />
        <TextInput
          style={styles.input}
          placeholder="Fréquence"
          value={frequency}
          onChangeText={setFrequency}
        />
        <TextInput
          style={styles.input}
          placeholder="Notes (optionnel)"
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddTreatment}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3FDFD',
    padding: 20,
  },
  title: {
    marginTop: 60,
    fontSize: 20,
    color: '#00796B',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  treatmentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderColor: '#00796B',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  medItem: {
    fontSize: 16,
    color: '#00796B',
    marginLeft: 5,
    marginBottom: 10,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  
  label: {
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 5,
  },
  deleteButton: {
    fontSize: 20,
    color: 'red',
  },
  medItem: {
    fontSize: 15,
    color: '#00796B',
    marginLeft: 10,
    marginBottom: 5,
  },
  form: {
    marginTop: 10,
  },
  formTitle: {
    fontSize: 18,
    color: '#004B4B',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#00796B',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#00796B',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 40,
    alignItems: 'center',
    alignSelf: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TreatmentListScreen;*/