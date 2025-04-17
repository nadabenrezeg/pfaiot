import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function MedicationDetailsScreen({ navigation }) {
  const [morning, setMorning] = useState(true);
  const [noon, setNoon] = useState(false);
  const [evening, setEvening] = useState(false);

  const showWarning = !noon && !evening;

  return (
    <View style={styles.container}>
      {/* Top navigation */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#003B30" />
      </TouchableOpacity>

      {/* Title and icon */}
      <View style={styles.header}>
        <Text style={styles.title}>Détails :</Text>
        <Image
         source={require('../assets/mediicon.png')} // Remplacez par votre icône
          style={styles.headerIcon}
        />
      </View>

      {/* Toggle sections */}
      <View style={[styles.section, { backgroundColor: morning ? '#66BB6A' : '#90A4AE' }]}>
        <Text style={styles.label}>Prise du Matin</Text>
        <Switch
          value={morning}
          onValueChange={setMorning}
          trackColor={{ false: 'red', true: 'green' }}
        />
      </View>

      <View style={[styles.section, { backgroundColor: noon ? '#66BB6A' : '#E57373' }]}>
        <Text style={styles.label}>Prise de Midi</Text>
        <Switch
          value={noon}
          onValueChange={setNoon}
          trackColor={{ false: 'red', true: 'green' }}
        />
      </View>

      <View style={[styles.section, { backgroundColor: evening ? '#66BB6A' : '#E57373' }]}>
        <Text style={styles.label}>Prise du Soir</Text>
        <Switch
          value={evening}
          onValueChange={setEvening}
          trackColor={{ false: 'red', true: 'green' }}
        />
      </View>

      {/* Temperature */}
      <View style={styles.section}>
        <Text style={styles.label}>Température :</Text>
        <Text style={styles.value}>--,-- °C</Text>
      </View>

      {/* Next intake */}
      <View style={styles.section}>
        <Text style={styles.label}>Prochaine prise :</Text>
        <Text style={styles.value}>- 03 H 15</Text>
      </View>

      {/* Warning */}
      {showWarning && (
        <View style={styles.warning}>
          <Icon name="warning" size={24} color="#000" />
          <View>
            <Text style={styles.warningTitle}>Avertissement !</Text>
            <Text style={styles.warningText}>Le type d’avertissement</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFEA',
    padding: 16,
  },
  backButton: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003B30',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#B2DFDB',
    padding: 20,
    borderRadius: 20,
    marginTop: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003B30',
  },
  value: {
    fontSize: 20,
    color: '#003B30',
  },
  warning: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  warningTitle: {
    fontWeight: 'bold',
    color: '#000',
  },
  warningText: {
    fontSize: 13,
    color: '#444',
  },
});
