import { Button } from '@/components/button'
import { useCheckoutCart } from '@/module/cart/hook/use-checkout-cart'
import { useGetCart } from '@/module/cart/hook/use-get-cart'
import { FlatList, Text, View, Image } from 'react-native'

type Cart = NonNullable<ReturnType<typeof useGetCart>['data']>

export const CartScreen = () => {
  const { data: cart } = useGetCart()
  const { mutateAsync: checkout } = useCheckoutCart()

  const items = cart?.items || []

  function handleCheckout() {
    if (!cart) return

    checkout({ params: { path: { sessionId: cart.sessionId } } })
  }

  function renderItem({ item }: { item: Cart['items'][number] }) {
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

  return (
    <View>
      <FlatList data={items} renderItem={renderItem} className="h-full" />
      <View className="absolute w-full bottom-0 bg-white p-safe-or-5">
        <Button icon="arrow-right" onPress={handleCheckout} className="ml-auto">
          Chekcout
        </Button>
      </View>
    </View>
  )
}
