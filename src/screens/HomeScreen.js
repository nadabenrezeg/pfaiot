import { useIsFocused } from '@react-navigation/native';
import { collection, deleteDoc, doc, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../firebaseConfig';

const HomeScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const db = getFirestore();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchPatients();
    }
  }, [isFocused]);

  const fetchPatients = async () => {
    setIsRefreshing(true);
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
      Alert.alert('Erreur', 'Impossible de charger les patients');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchPatients();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleDeletePatient = async (patientId) => {
    Alert.alert(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer ce patient ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'patients', patientId));
              fetchPatients();
              Alert.alert('Succès', 'Patient supprimé avec succès');
            } catch (error) {
              console.error('Erreur lors de la suppression :', error);
              Alert.alert('Erreur', 'Impossible de supprimer le patient');
            }
          }
        }
      ]
    );
  };

  const filteredPatients = patients.filter(patient =>
    patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.patientCard}>
      <TouchableOpacity
        style={styles.patientInfo}
        onPress={() => navigation.navigate('PatientDetailScreen', { patient: item })}
      >
        <View style={styles.avatarContainer}>
          <Icon name="person" size={28} color="#00796B" />
        </View>
        <View style={styles.patientDetails}>
          <View style={styles.nameRow}>
            <Text style={styles.patientName}>{item.name}</Text>
            <TouchableOpacity 
              onPress={() => handleDeletePatient(item.id)}
              style={styles.deleteButton}
            >
              <Icon name="delete" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
          <Text style={styles.patientMeta}>
            {item.lastVisit ? `Dernière visite: ${item.lastVisit}` : 'Nouveau patient'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate('PatientDetailScreen', { patient: item })}
      >
        <Icon name="chevron-right" size={24} color="#888" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#00796B" barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour Docteur,</Text>
            <Text style={styles.welcomeText}>Vos patients</Text>
          </View>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <Icon name="logout" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un patient..."
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Icon name="close" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Patients List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Liste des patients</Text>
          <Text style={styles.patientCount}>
            {filteredPatients.length} {filteredPatients.length > 1 ? 'patients' : 'patient'}
          </Text>
        </View>

        <FlatList
          data={filteredPatients}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#00796B']}
              tintColor="#00796B"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="group" size={50} color="#B2EBF2" />
              <Text style={styles.emptyText}>Aucun patient trouvé</Text>
              {searchTerm.length > 0 && (
                <TouchableOpacity onPress={() => setSearchTerm('')}>
                  <Text style={styles.clearSearchText}>Effacer la recherche</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        {/* Add Patient Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPatientScreen')}
          activeOpacity={0.8}
        >
          <Icon name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#B2EBF2',
  },
  container: {
    flex: 1,
    backgroundColor: '#B2EBF2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: '#00796B',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#B2DFDB',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 5,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796B',
  },
  patientCount: {
    fontSize: 14,
    color: '#888',
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  patientDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  deleteButton: {
    padding: 4,
  },
  patientMeta: {
    fontSize: 12,
    color: '#888',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 15,
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  clearSearchText: {
    marginTop: 10,
    color: '#00796B',
    textDecorationLine: 'underline',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#00796B',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default HomeScreen;