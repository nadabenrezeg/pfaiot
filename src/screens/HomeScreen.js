import { useIsFocused } from '@react-navigation/native';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const db = getFirestore();

  const isFocused = useIsFocused();

  useEffect(() => {
  if (isFocused) {
    fetchPatients(); // Recharge les patients à chaque fois qu'on revient sur l'écran
  }
}, [isFocused]);

  const fetchPatients = async () => {
    try {
      const patientsCollection = collection(db, 'patients');
      const patientSnapshot = await getDocs(patientsCollection);
      const patientList = patientSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientList);
    } catch (error) {
      console.error('Erreur lors du chargement des patients :', error);
    }
  };

  const handleAddPatient = async () => {
    try {
      const patientsCollection = collection(db, 'patients');

      const newPatient = {
        name: 'Nouveau Patient', // Tu peux remplacer ça par des valeurs dynamiques avec un formulaire
        createdAt: new Date(),
      };

      await addDoc(patientsCollection, newPatient);

      Alert.alert('Succès', 'Le patient a bien été ajouté.');

      fetchPatients(); // Recharger la liste
    } catch (error) {
      console.error("Erreur lors de l'ajout du patient :", error);
      Alert.alert('Erreur', "Impossible d'ajouter le patient.");
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.patientCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('MedicalFiche', { patient: item })}
      >
        <Text style={styles.patientName}>{item.name}</Text>
      </TouchableOpacity>
  
      <TouchableOpacity
        style={styles.modifyButton}
        onPress={() => navigation.navigate('PatientDetailScreen', { patient: item })}
      >
        <Text style={styles.modifyButtonText}>Consulter</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenue !</Text>
        <TouchableOpacity onPress={() => {/* Logique de déconnexion */}}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un patient..."
        placeholderTextColor="#888"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Text style={styles.patientsTitle}>Patients :</Text>
      <FlatList
        data={filteredPatients}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

<TouchableOpacity
  style={styles.addButton}
  onPress={() => navigation.navigate('AddPatientScreen')}
>
  <Text style={styles.addButtonText}>+</Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B2EBF2',
    padding: 20,
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796B',
  },
  logoutText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  searchInput: {
    width: '100%',
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#FFF',
    borderColor: '#00796B',
    borderWidth: 2,
    marginBottom: 20,
  },
  patientsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 10,
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#FFF',
    borderColor: '#00796B',
    borderWidth: 1,
    marginBottom: 10,
  },
  patientName: {
    fontSize: 18,
    color: '#00796B',
  },
  modifyButton: {
    backgroundColor: '#00796B',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  modifyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#00796B',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default HomeScreen;