import Icon from '@/components/icon'
import { fetchFefreshToken } from '@/module/auth/fetch-refresh-token'
import { fetchClient } from '@/module/core'
import { RootStackParamList, Routes } from '@/screens'
import { CartScreen } from '@/screens/cart-screen'
import { HomeScreen } from '@/screens/home-screen'
import { LoginScreen } from '@/screens/login-screen'
import { ProductDetailPage } from '@/screens/product-detail-screen'
import { SettingScreen } from '@/screens/setting-screen'
import { SignupScreen } from '@/screens/signup-screen'
import { useAuthStore } from '@/store/auth.store'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import React, { useEffect } from 'react'
import './global.css'
import { CheckoutScreen } from '@/screens/checkout-screen'
import { PaymentScreen } from '@/screens/payment-screen'
import { OrdersScreen } from '@/screens/orders-screen'
import { MainTabBar } from '@/components/main-tab-bar'
import { useColorScheme } from 'react-native'

const Stack = createStackNavigator<RootStackParamList>()
const HomeTab = createBottomTabNavigator()

function HomeNavigator() {
  const { token } = useAuthStore()
  const scheme = useColorScheme()

  return (
    <HomeTab.Navigator
      tabBar={(p) => MainTabBar(p)}
      screenOptions={{
        headerTransparent: false,
        headerStyle: {
          backgroundColor: scheme === 'dark' ? '#21ac21' : '#57d657',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <HomeTab.Screen
        name={Routes.Home}
        component={HomeScreen}
        options={{
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="product" color={color} size={size} />
          ),
        }}
      />
      <HomeTab.Screen
        name={Routes.Orders}
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="ordered-list" color={color} size={size} />
          ),
        }}
      />
      <HomeTab.Screen
        name={Routes.Setting}
        component={SettingScreen}
        navigationKey={token ? 'user' : 'guest'}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="setting" color={color} size={size} />
          ),
        }}
      />
    </HomeTab.Navigator>
  )
}

function handleUnauthorized(request, queryClient: QueryClient) {
  const { refreshToken, setAuthStore } = useAuthStore.getState()
  fetchFefreshToken({
    refreshToken,
    callback: () => queryClient.fetchQuery(request),
  })
    .then(({ queues, response }) => {
      setAuthStore({
        token: response?.token,
        refreshToken: response?.refreshToken,
      })

      queues.forEach((req) => {
        req()
      })
    })
    .catch((err) => {
      console.log('Failed to refresh token, logging out...', err)
      setAuthStore({ token: undefined, refreshToken: undefined })
      return
    })
}

export default function App() {
  const { token } = useAuthStore()
  const scheme = useColorScheme()
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
            console.error(
              `[${query.queryKey}] Error in query ${query.queryKey}:`,
              error
            )
            if (error?.statusCode === 401) {
              handleUnauthorized(query, client)
            }
          },
        }),
        mutationCache: new MutationCache({
          onError(error, variables, context, mutation) {
            console.error(
              `[${error.name}] Error in mutation ${mutation.options.mutationKey}:`,
              error
            )
            if (error?.statusCode === 401) {
              handleUnauthorized(mutation, client)
            }
          },
        }),
      })
  )

  useEffect(() => {
    if (token) {
      fetchClient.use({
        onRequest: async (cl) => {
          cl.request.headers.set('Authorization', `Bearer ${token}`)
          return cl.request
        },
      })
    }
  }, [token, fetchClient])

  return (
    <QueryClientProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator
          key={token ? 'user' : 'guest'}
          screenOptions={{
            headerStyle: {
              backgroundColor: scheme === 'dark' ? '#21ac21' : '#57d657',
            },
            headerTintColor: scheme === 'dark' ? 'white' : 'black',
          }}
        >
          {!token ? (
            <>
              {/* <Stack.Screen
                name={Routes.Onboarding}
                options={{ headerShown: false }}
                component={OnboardingScreen}
              /> */}
              {/* login screen */}
              <Stack.Screen
                name={Routes.Login}
                component={LoginScreen}
                options={{ headerLeftContainerStyle: { opacity: 0 } }}
              />
              {/* signup screen */}
              <Stack.Screen
                name={Routes.Signup}
                component={SignupScreen}
                options={{ headerLeftContainerStyle: { opacity: 0 } }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name={Routes.HomeTab}
                component={HomeNavigator}
                navigationKey={token ? 'user' : 'guest'}
                options={{ title: '', headerShown: false }}
              />
              <Stack.Screen
                name={Routes.ProductDetail}
                options={{ title: 'Product Detail' }}
                component={ProductDetailPage}
              />
              <Stack.Screen
                name={Routes.Cart}
                options={{ title: 'Your Cart' }}
                component={CartScreen}
              />
              <Stack.Screen
                name={Routes.Checkout}
                options={{ title: 'Checkout' }}
                component={CheckoutScreen}
              />
              <Stack.Screen
                name={Routes.Payment}
                options={{ title: 'Payment' }}
                component={PaymentScreen}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}
