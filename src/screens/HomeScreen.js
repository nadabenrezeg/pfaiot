import { collection, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      const db = getFirestore();
      const patientsCollection = collection(db, 'patients'); // Assurez-vous que le nom de la collection est correct
      const patientSnapshot = await getDocs(patientsCollection);
      const patientList = patientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPatients(patientList);
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.patientCard}>
      <Text style={styles.patientName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.modifyButton}
        onPress={() => navigation.navigate('PatientDetailScreen', { patient: item })}// Passer l'ID du patient
      >
        <Text style={styles.modifyButtonText}>Modifier</Text>
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
});

export default HomeScreen;