import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import './global.css'

const Stack = createStackNavigator()

function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-red-400">
      <Text>Welcome to the Home Screen!</Text>
      <StatusBar style="auto" />
    </View>
  )
}

function DetailsScreen() {
  return (
    <View>
      <Text>This is the Details Screen!</Text>
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
