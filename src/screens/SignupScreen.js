import { LinearGradient } from 'expo-linear-gradient'; // Importer LinearGradient
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../firebaseConfig';

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Succès", "Inscription réussie !");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A0E7E5', '#00796B']} style={styles.titleContainer}>
        <Text style={styles.title}>Création de votre compte</Text>
      </LinearGradient>
      <Image 
        source={require('../assets/sss.png')} 
        style={styles.image} 
      />
      <View style={styles.inputContainer}>
        <Icon name="person" size={20} color="#00796B" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Nom et Prénom" 
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#00796B" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="#00796B" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Numéro de Tel" 
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#00796B" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Mot de passe" 
          placeholderTextColor="#888" 
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#00796B" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Confirmer mot de passe" 
          placeholderTextColor="#888" 
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Vous avez déjà un compte ? 
        <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}> Se connecter</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B2EBF2',
    padding: 30,
  },
  titleContainer: {

    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff', // Couleur du texte
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderColor: '#00796B',
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
    color: '#FFD700',
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#00796B',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#00796B',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  footerText: {
    color: '#00796B',
    marginTop: 20,
    textAlign: 'center',
  },
  linkText: {
    color: '#00796B',
    fontWeight: 'bold',
  },
});