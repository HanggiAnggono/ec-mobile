// Login screen
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Alert, Button, Text, TextInput, View } from 'react-native'
import { RootStackParamList } from '.'

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>

type Props = {
  navigation: LoginScreenNavigationProp
}

// login screen with nativewind (no styles API) with button to skip the login
export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Dummy login logic
    if (username === 'user' && password === 'password') {
      navigation.replace('Home')
    } else {
      Alert.alert('Login Failed', 'Invalid username or password')
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-2xl font-bold mb-6">Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <View className="mt-4 flex flex-row items-center">
        <Text>Dont' have an account?</Text>
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate('Signup')}
          color="#007BFF"
        />
      </View>
      <View className="mt-4">
        <Button
          title="Skip Login"
          onPress={() => navigation.replace('Home')}
          color="#888"
        />
      </View>
    </View>
  )
}
