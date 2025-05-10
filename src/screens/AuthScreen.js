import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig'; // Assurez-vous que le chemin est correct

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home'); // Navigue vers l'écran d'accueil en cas de succès
    } catch (error) {
      Alert.alert("Erreur", error.message); // Affiche une alerte en cas d'erreur
    }
  };
  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Mot de passe" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input} 
      />
      <Button title="Se connecter" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.linkText}>Pas encore de compte ? Inscrivez-vous</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.linkText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#B2EBF2',
  },
  input: {
    height: 40,
    borderColor: '#00796B',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  linkText: {
    color: '#00796B',
    marginTop: 10,
    textAlign: 'center',
  },
});