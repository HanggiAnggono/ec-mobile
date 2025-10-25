import { Button } from '@/components/button'
import Card from '@/components/card'
import { CartContainer } from '@/containers/cart'
import { Layout } from '@/layout/layout'
import {
  useProductsFindAll,
  useProductsFindAllInfinite,
} from '@/shared/query/products/use-products-find-all.query'
import { Product } from '@/shared/types/api'
import { Link, useFocusEffect, useNavigation } from '@react-navigation/native'
import { StackNavigationOptions } from '@react-navigation/stack'
import { useCallback } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  useColorScheme,
  View,
} from 'react-native'

type product = Product

export const HomeScreen = () => {
  const { data, isLoading, error, refetch, fetchNextPage, isFetchingNextPage } =
    useProductsFindAllInfinite()
  const products = data?.pages.flatMap((page) => page.data) || []

  const { setOptions } = useNavigation()
  const color = useColorScheme()

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
        <View className="p-2 w-full h-[25rem]">
          <ProductCard product={product} key={product.id} />
        </View>
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
    <Layout>
      <FlatList
        numColumns={2}
        data={products}
        renderItem={renderProduct}
        className="h-full"
        contentContainerClassName="pb-16 pt-32"
        refreshing={isLoading}
        onEndReachedThreshold={0.2}
        onEndReached={() => fetchNextPage()}
        ListFooterComponent={() => {
          return isFetchingNextPage ? (
            <ActivityIndicator size="large" className="my-4" />
          ) : null
        }}
      />
    </Layout>
  )
}

const ProductCard = ({ product }: { product: product }) => {
  return (
    <Card className="size-full">
      <View className="h-[15rem] overflow-hidden rounded-t-xl bg-gray-400">
        <ImageBackground
          source={{
            uri: `https://picsum.photos/140/140?random=${product.name}`,
          }}
          className="size-full "
        />
      </View>
      <View className="p-2">
        <Text className="text-lg text-text font-bold">{product.name}</Text>
        <Text className="text-text">{product.category?.name}</Text>
        <Text className="text-text mt-2">{product.description}</Text>
      </View>
    </Card>
  )
}
