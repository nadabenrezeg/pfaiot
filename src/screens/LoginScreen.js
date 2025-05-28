import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../firebaseConfig'; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Succès", "Connexion réussie !");
      navigation.navigate('Home'); 
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PillMate</Text>
     <View style={styles.imageCard}>
  <Image 
    source={require('../assets/login.png')} 
    style={styles.image} 
    resizeMode="contain"
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
        <Icon name="lock" size={20} color="#00796B" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Mot de passe" 
          placeholderTextColor="#888" 
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon 
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color="#00796B"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>ou</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.linkText}>Créer un compte</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.footerText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imageCard: {
  width: 260,
  height: 260,
  backgroundColor: '#00796B',
  borderRadius: 130,
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
},
image: {
  width: 220,
  height: 220,
  borderRadius: 110,
},

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B2EBF2',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderColor: '#00796B',
    borderWidth: 2,
    borderRadius: 30,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
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
  orText: {
    marginVertical: 10,
    color: '#00796B',
  },
  linkText: {
    color: '#00796B',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  footerText: {
    color: '#00796B',
  },
});