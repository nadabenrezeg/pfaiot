import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Importation des écrans
import AddMedicaScreen from './screens/AddMedicaScreen';
import CalendarScreen from './screens/CalendarScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CalendarScreen"
        screenOptions={{
          headerStyle: { backgroundColor: '#004D40' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* Écran principal : Calendrier */}
        <Stack.Screen
          name="CalendarScreen"
          component={CalendarScreen}
          options={{
            title: 'Calendrier',
            headerLeft: null, // <<< Pas de flèche retour sur le calendrier
          }}
        />

        {/* Écran d'ajout de médicament */}
        <Stack.Screen
          name="AddMedicaScreen"
          component={AddMedicaScreen}
          options={{ headerShown: false }} // <<< On cache complètement le header ici
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}