import { Button } from '@/components/button'
import Icon from '@/components/icon'
import { useUserGetProfile } from '@/shared/query/api-hooks'
import { useAuthStore } from '@/store/auth.store'
import { useQueryClient } from '@tanstack/react-query'
import { Alert, Pressable, Text, TouchableOpacity, View } from 'react-native'

export const SettingScreen = () => {
  const { data, isError, refetch } = useUserGetProfile()
  const queryClient = useQueryClient()
  const { setAuthStore } = useAuthStore()

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          setAuthStore({ token: undefined, refreshToken: undefined })
          queryClient.clear()
        },
      },
    ])
  }

  return (
    <View className="flex-1 p-4">
      <View className="bg-white rounded-md p-4">
        {isError ? (
          <Pressable
            onPress={() => {
              refetch()
            }}
          >
            <Text className="text-red-500">
              Error loading profile, tap to retry
            </Text>
          </Pressable>
        ) : (
          <View className="flex-row gap-3">
            <Icon
              name="user"
              size={25}
              className="border p-3 self-start rounded-full"
            />
            <View>
              <Text className="text-lg">{data?.email}</Text>
              <Text>{data?.username}</Text>
            </View>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        className="items-center flex-row justify-between bg-white p-4 border-t border-t-slate-200"
      >
        <Text>Logout</Text>
        <Icon name="right" size={16} />
      </TouchableOpacity>
    </View>
  )
}
