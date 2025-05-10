import DateTimePicker from '@react-native-community/datetimepicker';
import { get, ref, set } from 'firebase/database';
import React, { useLayoutEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { database } from '../firebaseConfig';




export default function AddMedicaScreen({ navigation, route }) {
  const { patient } = route.params; // Récupérer le patient à partir de la navigation
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  

  const [count, setCount] = useState(1);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(30);
  const [type, setType] = useState(null);
  const [medicaName, setMedicaName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => (prev > 1 ? prev - 1 : 1));
  const incrementHour = () => setHour(prev => (prev < 23 ? prev + 1 : prev));
  const decrementHour = () => setHour(prev => (prev > 0 ? prev - 1 : prev));
  const incrementMinute = () => setMinute(prev => (prev < 59 ? prev + 1 : prev));
  const decrementMinute = () => setMinute(prev => (prev > 0 ? prev - 1 : prev));

  const handleSave = async () => {
    if (!medicaName.trim()) {
      alert('Veuillez entrer le nom du médicament');
      return;
    }
  
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const medicaData = {
      name: medicaName.trim(),
      hour,
      minute,
      count,
      type,
      date: formattedDate,
    };
  
    try {
      const userId = patient?.id || 'defaultUser';
      const medRef = ref(database, `/medications/${formattedDate}`);

      const snapshot = await get(medRef);
      const prevMeds = snapshot.exists() ? snapshot.val() : { morning: [], afternoon: [], evening: [] };
  
      let timeOfDay = 'evening';
      if (hour < 12) timeOfDay = 'morning';
      else if (hour < 18) timeOfDay = 'afternoon';
  
      if (!prevMeds[timeOfDay]) {
        prevMeds[timeOfDay] = [];
      }
  
      prevMeds[timeOfDay].push(medicaData.name);
  
      await set(medRef, prevMeds);
  
      if (route.params?.onAddMedica) {
        route.params.onAddMedica(medicaData); // 🔥 update local CalendarScreen
      }
  
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du médicament :', error);
      alert('Erreur lors de l\'enregistrement.');
    }
  };
  
  
  
  
  
 
    
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#004D40" />
      </TouchableOpacity>

      <Text style={styles.title}>Ajout médicament :</Text>

      <View style={styles.block}>
        <Text style={styles.label}>Date de prise :</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}
      </View>

      <View style={styles.block}>
        <TextInput
          placeholder="Nom du médicament :"
          placeholderTextColor="#fff"
          style={styles.input}
          value={medicaName}
          onChangeText={setMedicaName}
        />
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Heure de prise :</Text>
        <View style={styles.timeContainer}>
          <TouchableOpacity onPress={incrementHour}>
            <Icon name="arrow-drop-up" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.timeText}>{hour}</Text>
          <TouchableOpacity onPress={decrementHour}>
            <Icon name="arrow-drop-down" size={30} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.timeText}>:</Text>

          <TouchableOpacity onPress={incrementMinute}>
            <Icon name="arrow-drop-up" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.timeText}>{minute}</Text>
          <TouchableOpacity onPress={decrementMinute}>
            <Icon name="arrow-drop-down" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Nombre de prises :</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity onPress={increment}>
            <Icon name="add-circle" size={40} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.count}>{count}</Text>
          <TouchableOpacity onPress={decrement}>
            <Icon name="remove-circle" size={40} color="#FFD700" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Type de prise :</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity onPress={() => setType('pill')}>
            <Image source={require('../assets/pill.png')} style={[styles.iconType, type === 'pill' && styles.selected]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setType('capsule')}>
            <Image source={require('../assets/capsule.png')} style={[styles.iconType, type === 'capsule' && styles.selected]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setType('syrup')}>
            <Image source={require('../assets/syrup.png')} style={[styles.iconType, type === 'syrup' && styles.selected]} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAD6CE',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004D40',
    marginBottom: 20,
    textAlign: 'center',
  },
  block: {
    backgroundColor: '#00BFA5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  input: {
    color: '#fff',
    fontSize: 16,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 24,
    marginHorizontal: 5,
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 24,
    marginHorizontal: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconType: {
    width: 50,
    height: 50,
    tintColor: '#fff',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 10,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#00BFA5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#FFD700',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    fontWeight: 'bold',
    color: '#000',
  },
});