import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db } from '../firebaseConfig';

const formatDateToFrench = (dateString) => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const date = new Date(dateString);
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export default function CalendarScreen({ navigation, route }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [medications, setMedications] = useState({
    morning: [],
    afternoon: [],
    evening: []
  });
  const { patient } = route.params;

  useEffect(() => {
    if (selectedDate) {
      fetchMedicationsForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchMedicationsForDate = async (dateString) => {
    
    const medRef = ref(db, `medications/${dateString}`); 
    
    try {
      const snapshot = await get(medRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Données reçues de Firebase:", data);
        
        const transformData = (timeData) => {
          if (!timeData) return [];
          
          if (typeof timeData === 'object' && !Array.isArray(timeData)) {
            return Object.keys(timeData)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map(key => timeData[key])
              .filter(med => med && med.trim());
          }
          
          if (Array.isArray(timeData)) {
            return timeData.filter(med => med && med.trim());
          }
          
          return [];
        };
  
        setMedications({
          morning: transformData(data.morning),
          afternoon: transformData(data.afternoon),
          evening: transformData(data.evening)
        });
      } else {
        console.log("Aucune donnée trouvée pour cette date");
        setMedications({
          morning: [],
          afternoon: [],
          evening: []
        });
      }
    } catch (error) {
      console.error('Erreur Firebase:', error);
      Alert.alert('Erreur', 'Impossible de charger les médicaments');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
  
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#004D40" />
        </TouchableOpacity>
        <Text style={styles.patientName}>
          {patient?.name ? `M. ${patient.name}` : 'Patient'}
        </Text>
        <TouchableOpacity onPress={() => selectedDate && navigation.navigate('AddMedicaScreen', { patient, selectedDate })}>
          <Icon name="add-circle" size={28} color="#004D40" />
        </TouchableOpacity>
      </View>

    
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#FFD700',
            selectedTextColor: '#004D40',
          },
        }}
        theme={{
          backgroundColor: '#004D40',
          calendarBackground: '#004D40',
          textSectionTitleColor: '#FFFFFF',
          dayTextColor: '#FFFFFF',
          selectedDayTextColor: '#004D40',
          todayTextColor: '#FFD700',
          monthTextColor: '#FFFFFF',
          arrowColor: '#FFD700',
        }}
        style={styles.calendar}
      />


      <Text style={styles.selectedDate}>
        {selectedDate ? formatDateToFrench(selectedDate) : 'Sélectionnez une date'}
      </Text>


      <View style={styles.medicationSection}>
        <View style={styles.timeSlot}>
          <View style={styles.timeHeader}>
            <Icon name="wb-sunny" size={20} color="#FFC107" />
            <Text style={styles.timeTitle}>Matin</Text>
          </View>
          <View style={styles.medicationList}>
            {medications.morning.length > 0 ? (
              medications.morning.map((med, index) => (
                <Text key={`morning-${index}`} style={styles.medicationItem}>• {med}</Text>
              ))
            ) : (
              <Text style={styles.emptyMessage}>Aucun médicament</Text>
            )}
          </View>
        </View>

        <View style={styles.timeSlot}>
          <View style={styles.timeHeader}>
            <Icon name="brightness-5" size={20} color="#FF9800" />
            <Text style={styles.timeTitle}>Midi</Text>
          </View>
          <View style={styles.medicationList}>
            {medications.afternoon.length > 0 ? (
              medications.afternoon.map((med, index) => (
                <Text key={`afternoon-${index}`} style={styles.medicationItem}>• {med}</Text>
              ))
            ) : (
              <Text style={styles.emptyMessage}>Aucun médicament</Text>
            )}
          </View>
        </View>

        <View style={styles.timeSlot}>
          <View style={styles.timeHeader}>
            <Icon name="brightness-3" size={20} color="#673AB7" />
            <Text style={styles.timeTitle}>Soir</Text>
          </View>
          <View style={styles.medicationList}>
            {medications.evening.length > 0 ? (
              medications.evening.map((med, index) => (
                <Text key={`evening-${index}`} style={styles.medicationItem}>• {med}</Text>
              ))
            ) : (
              <Text style={styles.emptyMessage}>Aucun médicament</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004D40',
  },
  calendar: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
  },
  selectedDate: {
    fontSize: 16,
    color: '#00796B',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  medicationSection: {
    marginBottom: 20,
  },
  timeSlot: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00796B',
    marginLeft: 10,
  },
  medicationList: {
    minHeight: 40,
  },
  medicationItem: {
    fontSize: 15,
    color: '#004D40',
    marginVertical: 3,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
});