import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db, onValue, ref, set } from '../firebaseConfig'; // ✅ Correction ici

export default function MedicationDetailsScreen({ navigation }) {
  const [morning, setMorning] = useState(false);
  const [noon, setNoon] = useState(false);
  const [evening, setEvening] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [servoTimeMatin, setServoTimeMatin] = useState('');
  const [servoTimeMidi, setServoTimeMidi] = useState('');
  const [servoTimeSoir, setServoTimeSoir] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [ledGreen, setLedGreen] = useState(false);

  const showWarning = !noon && !evening;

  useEffect(() => {
    const dbRef = ref(db); // ✅ Correction ici
    const medicationsRef = ref(db, 'medications'); // ✅ Correction ici

    const unsubscribeConfig = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        if (data.temperature !== undefined) setTemperature(data.temperature);
        if (data['servo-time-matin']) setServoTimeMatin(data['servo-time-matin']);
        if (data['servo-time-midi']) setServoTimeMidi(data['servo-time-midi']);
        if (data['servo-time-soir']) setServoTimeSoir(data['servo-time-soir']);
        if (data.led_green !== undefined) setLedGreen(data.led_green);

        setLastUpdated(new Date().toLocaleTimeString());
      }
    });

    const unsubscribeHistory = onValue(medicationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        })).sort((a, b) => b.timestamp - a.timestamp);
        setMedicationHistory(historyArray);
      }
    });

    return () => {
      unsubscribeConfig();
      unsubscribeHistory();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const parseTime = (timeStr) => {
        if (!timeStr) return null;
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      const checkAndSet = (servoTime, setState) => {
        const target = parseTime(servoTime);
        if (target !== null && Math.abs(currentMinutes - target) <= 1) {
          setState(ledGreen); 
        }
      };

      checkAndSet(servoTimeMatin, setMorning);
      checkAndSet(servoTimeMidi, setNoon);
      checkAndSet(servoTimeSoir, setEvening);
    }, 30000); 

    return () => clearInterval(interval);
  }, [servoTimeMatin, servoTimeMidi, servoTimeSoir, ledGreen]);

  const recordMedicationTime = async (timeOfDay) => {
    try {
      const now = new Date();
      const timeRef = ref(db, 'temps'); // ✅ Correction ici
      await set(timeRef, now.toLocaleTimeString());
      Alert.alert('Succès', `Heure enregistrée: ${now.toLocaleTimeString()}`);
    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      Alert.alert('Erreur', "Échec de l'enregistrement");
    }
  };

  const getNextIntakeTime = () => {
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      let nextDiff = Infinity;

      const calculateDiff = (timeStr) => {
        if (!timeStr) return Infinity;
        const [h, m] = timeStr.split(':').map(Number);
        return (h * 60 + m) - currentMinutes;
      };

      if (morning && servoTimeMatin) {
        const diff = calculateDiff(servoTimeMatin);
        if (diff > 0) nextDiff = Math.min(nextDiff, diff);
      }
      if (noon && servoTimeMidi) {
        const diff = calculateDiff(servoTimeMidi);
        if (diff > 0) nextDiff = Math.min(nextDiff, diff);
      }
      if (evening && servoTimeSoir) {
        const diff = calculateDiff(servoTimeSoir);
        if (diff > 0) nextDiff = Math.min(nextDiff, diff);
      }

      if (nextDiff === Infinity) return "Aucune";
      const hours = Math.floor(nextDiff / 60);
      const minutes = nextDiff % 60;
      return `${hours}h${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error("Erreur de calcul:", error);
      return "--:--";
    }
  };

  const handleMedicationTaken = (timeOfDay) => {
    Alert.alert(
      "Confirmation",
      `Confirmez-vous la prise ${timeOfDay}?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: () => {
            recordMedicationTime(timeOfDay);
            if (timeOfDay === 'morning') setMorning(true);
            if (timeOfDay === 'noon') setNoon(true);
            if (timeOfDay === 'evening') setEvening(true);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#003B30" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Détails Médicament</Text>
        <Image source={require('../assets/mediicon.png')} style={styles.headerIcon} />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>Dernière mise à jour: {lastUpdated || '--:--'}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Text style={{ fontSize: 16, marginRight: 10 }}>LED Green:</Text>
        <View style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: ledGreen ? 'green' : 'red'
        }} />
      </View>

      <View style={[styles.section, { backgroundColor: morning ? '#66BB6A' : '#E57373' }]}>
        <View>
          <Text style={styles.label}>Prise du Matin</Text>
          <Text style={styles.timeText}>{servoTimeMatin || '--:--'}</Text>
        </View>
        <Switch
          value={morning}
          onValueChange={() => handleMedicationTaken('morning')}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={morning ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <View style={[styles.section, { backgroundColor: noon ? '#66BB6A' : '#E57373' }]}>
        <View>
          <Text style={styles.label}>Prise de Midi</Text>
          <Text style={styles.timeText}>{servoTimeMidi || '--:--'}</Text>
        </View>
        <Switch
          value={noon}
          onValueChange={() => handleMedicationTaken('noon')}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={noon ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <View style={[styles.section, { backgroundColor: evening ? '#66BB6A' : '#E57373' }]}>
        <View>
          <Text style={styles.label}>Prise du Soir</Text>
          <Text style={styles.timeText}>{servoTimeSoir || '--:--'}</Text>
        </View>
        <Switch
          value={evening}
          onValueChange={() => handleMedicationTaken('evening')}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={evening ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Température:</Text>
        <Text style={styles.value}>
          {temperature !== null ? `${temperature.toFixed(1)} °C` : '--,-- °C'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Prochaine prise:</Text>
        <Text style={styles.value}>{getNextIntakeTime()}</Text>
      </View>

      {showWarning && (
        <View style={styles.warning}>
          <Icon name="warning" size={24} color="#000" />
          <View>
            <Text style={styles.warningTitle}>Avertissement!</Text>
            <Text style={styles.warningText}>La pilule n’a pas été prise. </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B2EBF2',
    padding: 16,
  },
  backButton: { marginBottom: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerIcon: { width: 40, height: 40, resizeMode: 'contain' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003B30',
  },
  infoSection: {
    backgroundColor: '#E1F5FE',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#00695C',
    textAlign: 'center',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#B2DFDB',
    padding: 20,
    borderRadius: 15,
    marginTop: 15,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003B30',
  },
  timeText: {
    fontSize: 14,
    color: '#004D40',
    marginTop: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003B30',
  },
  warning: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  warningTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  warningText: {
    fontSize: 14,
    color: '#444',
  },
});
