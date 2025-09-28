import { Button } from '@/components/button'
import Icon from '@/components/icon'
import { useUserGetProfile } from '@/shared/query/api-hooks'
import { useAuthStore } from '@/store/auth.store'
import { useQueryClient } from '@tanstack/react-query'
import { Text, View } from 'react-native'

export const SettingScreen = () => {
  const { data, refetch } = useUserGetProfile()
  const queryClient = useQueryClient()
  const { setAuthStore } = useAuthStore()

  const handleLogout = async () => {
    queryClient.clear()
    setAuthStore({ token: undefined, refreshToken: undefined })
  }

  return (
    <View className="flex-1 p-4">
      <View className="bg-white rounded-md p-4">
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
      </View>
      <Button onPress={handleLogout}>Logout</Button>
    </View>
  )
}
