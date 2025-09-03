import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import './global.css'
import { OnboardingScreen } from './src/screens/onboarding-screen'

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Onboarding"
          options={{ headerShown: false }}
          component={OnboardingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
