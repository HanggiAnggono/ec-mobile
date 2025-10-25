import { Button } from '@/components/button'
import { useGetCart } from '@/module/cart/usecases/use-get-cart'
import { CartItem } from '@/shared/types/api'
import { FlatList, Image, Text, View } from 'react-native'
import { Routes, StackScreenProp } from '.'
import { Layout } from '@/layout/layout'
import Card from '@/components/card'

export const CartScreen = (props: StackScreenProp<'Cart'>) => {
  const { data: cart } = useGetCart()

  const items = cart?.items || []

  function handleCheckout() {
    if (!cart) return

    props.navigation.navigate(Routes.Checkout)
  }

  function renderItem({ item }: { item: CartItem }) {
    return (
      <Card className="m-2 p-4 rounded-lg shadow">
        <View className="flex-row">
          <Image
            source={{
              uri: `https://picsum.photos/140/140?random=${item.productVariant.product.name}`,
            }}
            className="w-16 h-16 mr-4 rounded"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="font-bold text-text">
              {item.productVariant.product.name}
            </Text>
            <Text className="text-text">{item.productVariant.name}</Text>
          </View>
          <View className="items-end">
            <Text className="font-bold text-text">Price: {item.price}</Text>
            <Text className="text-text">Quantity: {item.quantity}</Text>
          </View>
        </View>
      </Card>
    )
  }

  return (
    <Layout>
      {items.length ? (
        <>
          <FlatList data={items} renderItem={renderItem} className="h-full" />
          <View className="absolute w-full bottom-0 bg-background p-safe-or-5">
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
        <View className="h-full bg-background items-center justify-center">
          <Text className="text-text">
            There's nothing, go back and add some items
          </Text>
        </View>
      )}
    </Layout>
  )
}
