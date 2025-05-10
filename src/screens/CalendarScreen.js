import { get, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const [morningDose, setMorningDose] = useState([]);
  const [afternoonDose, setAfternoonDose] = useState([]);
  const [eveningDose, setEveningDose] = useState([]);
  const { patient } = route.params;

  useEffect(() => {
    if (selectedDate) {
      fetchMedicationsForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchMedicationsForDate = async (dateString) => {
    const medRef = ref(db, `/medications/${patient.id}/${dateString}`);
    try {
      const snapshot = await get(medRef);
      if (snapshot.exists()) {
        const meds = snapshot.val();
        setMorningDose(meds.morning ? meds.morning.join('\n') : '');
        setAfternoonDose(meds.afternoon ? meds.afternoon.join('\n') : '');
        setEveningDose(meds.evening ? meds.evening.join('\n') : '');
      } else {
        setMorningDose('');
        setAfternoonDose('');
        setEveningDose('');
      }
    } catch (error) {
      console.error('Erreur de chargement des médicaments:', error);
    }
  };

  const formatPatientName = (name) => {
    return `M. ${name}`;
  };

  const handleAddMedication = () => {
    if (!selectedDate) {
      Alert.alert('Attention', 'Veuillez sélectionner une date avant d\'ajouter un médicament');
      return;
    }
    navigation.navigate('AddMedicaScreen', { patient, selectedDate });
  };

  const handleSave = async () => {
    if (!selectedDate) {
      Alert.alert('Erreur', 'Veuillez sélectionner une date avant d\'enregistrer');
      return;
    }
  
    const medicationData = {
      morning: morningDose ? morningDose.split('\n').filter(m => m.trim()) : [],
      afternoon: afternoonDose ? afternoonDose.split('\n').filter(m => m.trim()) : [],
      evening: eveningDose ? eveningDose.split('\n').filter(m => m.trim()) : [],
    };
  
    try {
      const medRef = ref(db, `/medications/${patient.id}/${selectedDate}`);
      await set(medRef, medicationData);
      Alert.alert('Succès', 'Les médicaments ont été enregistrés');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'enregistrement des médicaments');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#004D40" />
        </TouchableOpacity>
      </View>

      <View style={styles.patientHeader}>
        <Text style={styles.patientName}>
          {patient?.name ? formatPatientName(patient.name) : 'Patient'}
        </Text>
        <TouchableOpacity onPress={handleAddMedication}>
          <Icon name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: '#FFD700',
          },
        }}
        theme={{
          backgroundColor: '#004D40',
          calendarBackground: '#004D40',
          textSectionTitleColor: '#FFFFFF',
          dayTextColor: '#FFFFFF',
          selectedDayTextColor: '#000',
          todayTextColor: '#FFD700',
          monthTextColor: '#FFFFFF',
          arrowColor: '#FFD700',
        }}
        style={styles.calendar}
      />

      <Text style={styles.monthText}>
        {selectedDate ? `Date sélectionnée : ${formatDateToFrench(selectedDate)}` : 'Sélectionnez une date'}
      </Text>

      <Text style={styles.doseTitle}>• Matin :</Text>
<View style={styles.doseBubble}>
  <Text style={styles.bubbleText}>{morningDose || 'Aucun médicament'}</Text>
</View>

<Text style={styles.doseTitle}>• Midi :</Text>
<View style={styles.doseBubble}>
  <Text style={styles.bubbleText}>{afternoonDose || 'Aucun médicament'}</Text>
</View>

<Text style={styles.doseTitle}>• Soir :</Text>
<View style={styles.doseBubble}>
  <Text style={styles.bubbleText}>{eveningDose || 'Aucun médicament'}</Text>
</View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    padding: 16
  },
  topBar: {
    marginBottom: 10
  },
  patientHeader: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00BFA5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  patientName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'capitalize'
  },
  calendar: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 10
  },
  monthText: {
    fontSize: 16,
    color: '#00796B',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  doseTitle: {
    fontSize: 16,
    color: '#00796B',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5
  },
  doseBubble: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    width: '100%'
  },
  bubbleText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20
  },
  saveButton: {
    backgroundColor: '#00BFA5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center'
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
});
