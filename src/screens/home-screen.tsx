import { useGetProducts } from '@/module/product/hook/use-get-products'
import { Link } from '@react-navigation/native'
import { useCallback } from 'react'
import { FlatList, ImageBackground, Text, View } from 'react-native'

export const HomeScreen = () => {
  const { data: products = [], isLoading } = useGetProducts()

  const renderProduct = useCallback((el) => {
    const product = el.item as (typeof products)[0]

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

const ProductCard = ({ product }: { product: components }) => {
  return (
    <View className="p-2 w-full h-[25rem]">
      <View className="size-full border border-gray-200 bg-white rounded-xl">
        <View className="h-[15rem] overflow-hidden rounded-t-xl bg-red-400">
          <ImageBackground
            source={{
              uri: 'https://picsum.photos/140/140',
            }}
            className="size-full "
          />
        </View>
        <View className="p-2">
          <Text className="text-lg font-bold">{product.name}</Text>
          <Text className="text-gray-500">{product.categoryId}</Text>
          <Text className="text-gray-700 mt-2">{product.description}</Text>
        </View>
      </View>
    </View>
  )
}
