// Login screen
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Alert, Text, TextInput, View } from 'react-native'
import { RootStackParamList } from '.'
import { Button } from '@/components/button'
import { useAuthLogin } from '@/shared/query/api-hooks'
import { BottomSheet } from '@/components/bottom-sheet'
import { useAuthStore } from '@/store/auth.store'

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
  const { mutateAsync, isPending, error, reset } = useAuthLogin()
  const { setAuthStore } = useAuthStore()

  const handleLogin = () => {
    mutateAsync({ body: { username, password } }).then((resp) => {
      setAuthStore(resp)
    })
  }

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-2xl font-bold mb-6">Login</Text>
      <TextInput
        className="w-full border border-gray-300 rounded p-2 mb-4"
        placeholder="Username"
        placeholderTextColor="gray"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        className="w-full border border-gray-300 rounded p-2 mb-6 text-black"
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button className="mx-auto" onPress={handleLogin} disabled={isPending}>
        Login
      </Button>
      <View className="mt-4 flex flex-row items-center">
        <Text>Dont' have an account?</Text>
        <Button onPress={() => navigation.navigate('Signup')}>Sign Up</Button>
      </View>
      <View className="mt-4">
        <Button onPress={() => navigation.replace('Home')}>Skip Login</Button>
      </View>
      <BottomSheet isOpen={!!error} setIsOpen={reset}>
        <View className="flex justify-center items-center">
          <Text>Something went wrong</Text>
          <Text>{String(error?.message)}</Text>
        </View>
      </BottomSheet>
    </View>
  )
}
