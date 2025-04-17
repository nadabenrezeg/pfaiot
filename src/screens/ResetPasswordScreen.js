import { LinearGradient } from 'expo-linear-gradient'; // Importer LinearGradient
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../firebaseConfig';

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Succès", "Un email de réinitialisation a été envoyé !");
      navigation.navigate('Login'); // Naviguer vers l'écran de connexion après l'envoi
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <LinearGradient colors={['#A0E7E5', '#00796B']} style={styles.container}>
      <Icon name="lock" size={50} color="#FFF" style={styles.lockIcon} />
      <Text style={styles.title}>Mot de Passe Oublié ?</Text>
      <Text style={styles.subtitle}>
        Pas de soucis, nous vous enverrons des instructions de réinitialisation
      </Text>
      <TextInput 
        style={styles.input} 
        placeholder="Entrez votre Email" 
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Réinitialiser le mot de passe</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Retour</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical: 10,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#FFF',
    marginBottom: 20,
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#FFF',
    marginBottom: 15,
    borderColor: '#00796B',
    borderWidth: 2,
    color: '#00796B',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#FFD700', // Couleur jaune pour le bouton
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000', // Texte en noir
    fontWeight: 'bold',
  },
  linkText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 20,
  },
  lockIcon: {
    marginBottom: 20,
  },
});