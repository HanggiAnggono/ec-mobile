import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Alert, Button, Text, TextInput, View } from 'react-native'
import { RootStackParamList } from '.'

type SignupScreenProps = StackNavigationProp<RootStackParamList, 'Login'>

type Props = {
  navigation: SignupScreenProps
}

// signup screen with nativewind (no styles API) with button to go back to login
export const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = () => {
    if (username && password) {
      Alert.alert(
        'Signup Successful',
        'You can now log in with your credentials'
      )
      navigation.goBack()
    } else {
      Alert.alert('Signup Failed', 'Please enter a valid username and password')
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-2xl font-bold mb-6">Sign Up</Text>
      <TextInput
        className="w-full border border-gray-300 rounded p-2 mb-4"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        className="w-full border border-gray-300 rounded p-2 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <View className="mt-4 flex flex-row items-center">
        <Text>Already have an account?</Text>
        <Button
          title="Log In"
          onPress={() => navigation.goBack()}
          color="#007BFF"
        />
      </View>
    </View>
  )
}
