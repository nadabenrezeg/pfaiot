import { LinearGradient } from 'expo-linear-gradient';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../firebaseConfig';

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Succès", "Un email de réinitialisation a été envoyé !");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <LinearGradient 
      colors={['#E0F7FA', '#80DEEA']} 
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Icon name="lock-reset" size={60} color="#00796B" />
        </View>
        
        <Text style={styles.title}>Mot de Passe Oublié ?</Text>
        
        <Text style={styles.subtitle}>
          Entrez votre email pour recevoir les instructions de réinitialisation
        </Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Votre adresse email" 
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleResetPassword}
        >
          <Text style={styles.buttonText}>Envoyer </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#00796B',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#00796B',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  input: {
    width: '100%',
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'rgb(255, 255, 255)',
    marginBottom: 20,
    fontSize: 16,
    color: '#00796B',
    borderWidth: 1,
    borderColor: 'rgba(3, 55, 60, 0.3)',
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#00796B',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    padding: 10,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#00796B',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});