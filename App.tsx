import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { OnboardingScreen } from './src/screens/onboarding-screen'
import './global.css'
import { HomeScreen } from '@/screens/home-screen'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ProductDetailPage } from '@/screens/product-detail-screen'
import { CartScreen } from '@/screens/cart-screen'
import { LoginScreen } from '@/screens/login-screen'
import { RootStackParamList } from '@/screens'
import { SignupScreen } from '@/screens/signup-screen'
import { fetchClient } from '@/module/core'
import { useAuthStore } from '@/store/auth.store'

const Stack = createStackNavigator<RootStackParamList>()

export default function App() {
  const { token } = useAuthStore()
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: __DEV__ ? false : 2,
          },
        },
        queryCache: new QueryCache({
          onError: (error, query) => {
            console.error(`Error in query ${query.queryKey}:`, error)
          },
        }),
      })
  )

  useEffect(() => {
    fetchClient.use({
      onRequest: async (cl) => {
        cl.request.headers.set('Authorization', `Bearer ${token}`)
        return cl.request
      },
    })
  }, [token, fetchClient])

  console.log({ token })

  return (
    <QueryClientProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={token ? 'Home' : 'Onboarding'}>
          <Stack.Screen
            name="Onboarding"
            options={{ headerShown: false }}
            component={OnboardingScreen}
          />
          {/* login screen */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerLeftContainerStyle: { opacity: 0 } }}
          />
          {/* signup screen */}
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerLeftContainerStyle: { opacity: 0 } }}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="ProductDetail"
            options={{ title: 'Product Detail' }}
            component={ProductDetailPage}
          />
          <Stack.Screen
            name="Cart"
            options={{ title: 'Your Cart' }}
            component={CartScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}
