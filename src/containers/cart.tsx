import { Button } from '@/components/button'
import { apiClient } from '@/module/core'
import { useCart } from '@/store/cart.store'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect } from 'react'
import { Text, View } from 'react-native'

export const CartContainer = () => {
  const { cartSessionId, setCartSessionId } = useCart()

  const { data: cart, refetch } = apiClient.useQuery('get', '/cart', {
    params: { query: { sessionId: getSessionId() } },
  })

  function getSessionId() {
    let sessionId = cartSessionId

    if (!cart && !cartSessionId) {
      sessionId = ''
    }
    return sessionId
  }

  useEffect(() => {
    if (cart?.sessionId && cart.sessionId !== cartSessionId) {
      setCartSessionId(cart.sessionId)
    }
  }, [cart?.sessionId, cartSessionId])

  // Sync cart session id
  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [])
  )

  return (
    <View>
      <Button icon="shopping-cart" className="mr-4 fill-black">
        Cart
      </Button>
      {cart?.items?.length ? (
        <View className="absolute size-6 rounded-full bg-red-400 flex justify-center items-center">
          <Text className="text-xs">{cart?.items?.length}</Text>
        </View>
      ) : null}
    </View>
  )
}
