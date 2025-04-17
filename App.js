import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';

// Import des écrans
import AddMedicaScreen from './src/screens/AddMedicaScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import MedicationDetailsScreen from './src/screens/MedicationDetailsScreen';
import PatientDetailScreen from './src/screens/PatientDetailScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen'; // Assurez-vous que le chemin est correct
import SignupScreen from './src/screens/SignupScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PatientDetailScreen" component={PatientDetailScreen} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
        <Stack.Screen name="AddMedicaScreen" component={AddMedicaScreen} />
        <Stack.Screen name="MedicationDetailsScreen" component={MedicationDetailsScreen} />
    

      </Stack.Navigator>
    </NavigationContainer>
  );
}