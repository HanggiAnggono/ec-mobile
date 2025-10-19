import { Button } from '@/components/button'
import { useGetCart } from '@/module/cart/usecases/use-get-cart'
import { CartItem } from '@/shared/types/api'
import { FlatList, Image, Text, View } from 'react-native'
import { Routes, StackScreenProp } from '.'

export const CartScreen = (props: StackScreenProp<'Cart'>) => {
  const { data: cart } = useGetCart()

  const items = cart?.items || []

  function handleCheckout() {
    if (!cart) return

    props.navigation.navigate(Routes.Checkout)
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

  return (
    <View>
      {items.length ? (
        <>
          <FlatList data={items} renderItem={renderItem} className="h-full" />
          <View className="absolute w-full bottom-0 bg-white p-safe-or-5">
            <Button
              icon="arrow-right"
              onPress={handleCheckout}
              className="ml-auto"
            >
              Chekcout
            </Button>
          </View>
        </>
      ) : (
        <View className="h-full bg-white items-center justify-center">
          <Text>There's nothing, go back and add some items</Text>
        </View>
      )}
    </View>
  )
}
