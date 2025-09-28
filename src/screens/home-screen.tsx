import { Button } from '@/components/button'
import { CartContainer } from '@/containers/cart'
import { useProductsFindAll } from '@/shared/query/api-hooks'
import { Product } from '@/shared/types/api'
import { Link, useFocusEffect, useNavigation } from '@react-navigation/native'
import { StackNavigationOptions } from '@react-navigation/stack'
import { useCallback } from 'react'
import { FlatList, ImageBackground, Text, View } from 'react-native'

type product = Product

export const HomeScreen = () => {
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useProductsFindAll()

  const { setOptions } = useNavigation()

  useFocusEffect(
    useCallback(() => {
      setOptions({
        headerRight: () => <CartContainer />,
      } as StackNavigationOptions)
    }, [])
  )

  const renderProduct = useCallback((el) => {
    const product = el.item as product

    return (
      <Link
        screen="ProductDetail"
        params={{ id: product.id }}
        className="w-1/2"
      >
        <ProductCard product={product} key={product.id} />
      </Link>
    )
  }, [])

  if (error) {
    return (
      <View className="flex flex-1 flex-col justify-center items-center">
        <Text>Error: {String(error)}</Text>
        <Button className="mt-3" onPress={() => refetch()} icon="reload">
          Reload
        </Button>
      </View>
    )
  }

  return (
    <View>
      <FlatList
        numColumns={2}
        data={products}
        renderItem={renderProduct}
        className="h-full"
        contentContainerClassName="pb-16"
      />
    </View>
  )
}

const ProductCard = ({ product }: { product: product }) => {
  return (
    <View className="p-2 w-full h-[25rem]">
      <View className="size-full border border-gray-200 bg-white rounded-xl">
        <View className="h-[15rem] overflow-hidden rounded-t-xl bg-gray-400">
          <ImageBackground
            source={{
              uri: `https://picsum.photos/140/140?random=${product.name}`,
            }}
            className="size-full "
          />
        </View>
        <View className="p-2">
          <Text className="text-lg font-bold">{product.name}</Text>
          <Text className="text-gray-500">{product.category?.name}</Text>
          <Text className="text-gray-700 mt-2">{product.description}</Text>
        </View>
      </View>
    </View>
  )
}
