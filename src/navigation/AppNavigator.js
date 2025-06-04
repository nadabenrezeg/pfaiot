import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';


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
       
        <Stack.Screen
          name="CalendarScreen"
          component={CalendarScreen}
          options={{
            title: 'Calendrier',
            headerLeft: null,
          }}
        />

     
        <Stack.Screen
          name="AddMedicaScreen"
          component={AddMedicaScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}