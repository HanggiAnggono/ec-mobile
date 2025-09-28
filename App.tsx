import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SettingScreen } from '@/screens/setting-screen'
import Icon from '@/components/icon'

const Stack = createStackNavigator<RootStackParamList>()
const HomeTab = createBottomTabNavigator()

function HomeNavigator() {
  const { token } = useAuthStore()

  return (
    <HomeTab.Navigator>
      <HomeTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
        }}
      />
      <HomeTab.Screen
        name="Setting"
        component={SettingScreen}
        navigationKey={token ? 'user' : 'guest'}
        options={{
          tabBarIcon: ({ color }) => <Icon name="setting" color={color} />,
        }}
      />
    </HomeTab.Navigator>
  )
}

export default function App() {
  const { token, refreshToken, setAuthStore } = useAuthStore()
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

  console.log({ token })

  useEffect(() => {
    if (token) {
      fetchClient.use({
        onRequest: async (cl) => {
          cl.request.headers.set('Authorization', `Bearer ${token}`)
          return cl.request
        },
        onResponse: (cl) => {
          if (cl.response.clone().status === 401) {
            if (token && refreshToken) {
              fetchClient
                .POST('/auth/refresh-token', {
                  body: { token, refreshToken },
                })
                .then((res) => {
                  setAuthStore({
                    token: res.data?.token,
                    refreshToken: res.data?.refreshToken,
                  })
                  cl.request.headers.set(
                    'Authorization',
                    `Bearer ${res.data?.token}`
                  )
                  return fetch(cl.request)
                })
                .catch((err) => {
                  console.log('Unauthorized! Logging out...')
                  setAuthStore({ token: undefined, refreshToken: undefined })
                })
            } else {
              console.log('Unauthorized! Logging out...')
              setAuthStore({ token: undefined, refreshToken: undefined })
            }
          }
        },
      })
    }
  }, [token, refreshToken, fetchClient])

  return (
    <QueryClientProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator key={token ? 'user' : 'guest'}>
          {!token ? (
            <>
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
            </>
          ) : (
            <>
              <Stack.Screen
                name="HomeTab"
                component={HomeNavigator}
                navigationKey={token ? 'user' : 'guest'}
                options={{ title: '', headerShown: false }}
              />
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
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}
