import { Button } from '@/components/button'
import { useGetCart } from '@/module/cart/usecases/use-get-cart'
import { useCartCheckoutCart } from '@/shared/query/cart/use-cart-checkout-cart.mutation'
import { useCartCompleteCheckout } from '@/shared/query/cart/use-cart-complete-checkout.mutation'
import { CartItem } from '@/shared/types/api'
import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Text,
  View,
  Image,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native'
import { StackScreenProp } from '.'

export const CheckoutScreen: React.FC<StackScreenProp<'Checkout'>> = ({
  navigation,
}) => {
  const { data: cart } = useGetCart()
  const {
    mutateAsync: checkout,
    data: checkoutData,
    isPending,
  } = useCartCheckoutCart()
  const {
    mutateAsync: complete,
    data,
    isPending: isCompleting,
  } = useCartCompleteCheckout()
  const [payment, setPayment] = useState('')

  useEffect(() => {
    if (cart?.sessionId) {
      checkout({ params: { path: { sessionId: cart.sessionId } } })
    }
  }, [cart?.sessionId])

  const items = checkoutData?.items || []
  const payments = checkoutData?.paymentMethods || []

  function handlePurchase() {
    if (!cart) return
    complete({
      body: { paymentMethod: payment },
      params: { path: { sessionId: cart?.sessionId } },
    }).then((resp) => {
      navigation.navigate('Payment', { orderId: resp.id.toString() })
    })
  }

  function renderItem({ item }: { item: CartItem }) {
    return (
      <View className="bg-white m-2 p-4 rounded-lg shadow">
        <View className="flex-row">
          <Image
            source={{
              uri: `https://picsum.photos/140/140?random=${item.productVariant.product.name}`,
            }}
            className="w-16 h-16 mr-4 rounded"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="font-bold">
              {item.productVariant.product.name}
            </Text>
            <Text className="text-gray-500">{item.productVariant.name}</Text>
          </View>
          <View className="items-end">
            <Text className="font-bold">Price: {item.price}</Text>
            <Text className="text-gray-500">Quantity: {item.quantity}</Text>
          </View>
        </View>
      </View>
    )
  }

  if (isPending) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View className="relative h-full">
      <FlatList
        data={items}
        renderItem={renderItem}
        ListFooterComponent={() => {
          return (
            <View className="bg-white mt-2 p-4">
              <Text className="text-xl mb-4">Payment Method</Text>
              <FlatList
                data={payments}
                ItemSeparatorComponent={() => (
                  <View className="border border-gray-100 my-3" />
                )}
                renderItem={({ item: method, separators }) => {
                  return (
                    <View
                      key={method}
                      onTouchEnd={() => setPayment(method)}
                      className="flex flex-row justify-between items-center"
                    >
                      <Text>{method}</Text>
                      <Switch key={method} value={method == payment} />
                    </View>
                  )
                }}
              />
            </View>
          )
        }}
      />
      <View className="absolute w-full bottom-0 bg-white p-safe-or-5">
        <Button
          icon="arrow-right"
          disabled={isCompleting}
          onPress={handlePurchase}
          className="ml-auto"
        >
          Purchase
        </Button>
      </View>
    </View>
  )
}
