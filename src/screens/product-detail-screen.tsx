import { BottomSheet } from '@/components/bottom-sheet'
import { Button } from '@/components/button'
import { useAddToCart } from '@/module/cart/hook/use-add-to-cart'
import { useGetProduct } from '@/module/product/hook/use-get-product'
import { formatCurrency } from '@/module/utils'
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  Feather,
  Entypo,
} from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import clsx from 'clsx'
import { useState } from 'react'
import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { v4 } from "uuid"

export const ProductDetailPage = () => {
  const { params = {} } = useRoute()
  const { id } = params as { id: number }
  const { data, isLoading } = useGetProduct(id)
  const [isOpen, setIsOpen] = useState(false)
  const { mutateAsync: addToCart, isPending, error } = useAddToCart()

  const variants = data?.variants || []
  const [variantId, setVariantId] = useState(variants?.[0]?.id || 0)
  const [quantity, setQuantity] = useState(1)
  const selectedVariant = variants?.find((v) => v.id === variantId)

  function handleAddToCart() {
    setIsOpen(true)
  }

  async function handleSubmit() {
    try {
      console.log('submitting')
      await addToCart({
        body: {
          productVariantId: variantId,
          quantity,
          // sessionId,
        },
      })
      alert('Added to cart')
    } catch (error) {
      alert(`Failed to add to cart: ${JSON.stringify(error)}`)
    }
  }

  // data?.variants?.[0]
  const renderVariants = ({
    item,
  }: {
    item: NonNullable<typeof data>['variants'][0]
  }) => {
    const selected = variantId === item.id

    return (
      <Pressable
        className={clsx(
          'rounded-full p-2 px-4 self-start mr-2',
          selected ? 'bg-blue-500' : 'bg-gray-200'
        )}
        onPress={() => setVariantId(item.id)}
      >
        <Text
          className={clsx(
            ' text-sm ',
            selected ? 'text-white' : 'text-slate-500'
          )}
        >
          {item.name}
        </Text>
      </Pressable>
    )
  }

  return (
    <View className="flex flex-1 bg-white">
      <ScrollView contentContainerClassName="pb-24">
        <ImageBackground
          source={{ uri: 'https://picsum.photos/400/400' }}
          className="w-full h-96 bg-gray-200"
        />
        <View className="p-4">
          <Text className="p-4 text-2xl text-slate-500 mb-3">{data?.name}</Text>
          {data?.category ? (
            <View className="rounded-full p-2 bg-blue-500 self-start mb-5">
              <Text className=" text-white text-sm ">
                {data?.category?.name}
              </Text>
            </View>
          ) : null}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={variants}
            renderItem={renderVariants}
            className="my-5 -mx-4 px-4"
          />
          <Text className="text-lg text-slate-500">
            {data?.description}
            {[1, 2, 3].map((i) => {
              return (
                <Text key={i}>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Exercitationem quis minus nobis laudantium culpa maiores et.
                  Accusamus provident ipsum repellendus iusto laudantium eum
                  quia doloribus beatae, suscipit adipisci cumque dicta?{'\n\n'}
                </Text>
              )
            })}
          </Text>
        </View>
      </ScrollView>

      <BottomSheet isOpen={isOpen} setIsOpen={setIsOpen}>
        <View className="p-2">
          <View className="flex-row gap-2">
            <ImageBackground
              source={{ uri: 'https://picsum.photos/400/400' }}
              className="size-40 bg-gray-200 rounded-xl overflow-hidden mb-5"
            />
            <View>
              <Text className="text-2xl text-slate-500 mb-3">
                {selectedVariant?.name}
              </Text>
              <Text className="text-slate-500 mb-3">
                {formatCurrency(selectedVariant?.price)}
              </Text>
              <Text className="text-slate-500 mb-3">
                {selectedVariant?.stock_quantity} Available
              </Text>
            </View>
          </View>
          <View className="flex flex-wrap flex-row gap-4 mb-10">
            {variants.map((v) => {
              return <View key={v.id}>{renderVariants({ item: v })}</View>
            })}
          </View>
          <View className="flex-row items-center mb-10 gap-4">
            <Text className="text-lg ml-auto">Quantity</Text>
            <Button
              onPress={() => setQuantity(quantity - 1)}
              disabled={quantity <= 1}
            >
              {' '}
              -{' '}
            </Button>
            <Text>{quantity}</Text>
            <Button onPress={() => setQuantity(quantity + 1)}> + </Button>
          </View>
          <Button
            className="self-end"
            icon="shopping-cart"
            onPress={handleSubmit}
            disabled={isPending}
          >
            Add To Cart
          </Button>
        </View>
      </BottomSheet>

      <View className="absolute bottom-safe-or-10 right-safe-or-5 p-3  bg-white border border-blue-400 rounded-full">
        <View className="flex flex-row justify-end gap-1">
          <Button icon="message" className="flex items-center justify-center">
            Chat
          </Button>
          <Button onPress={handleAddToCart}>Add To Cart</Button>
        </View>
      </View>
    </View>
  )
}

