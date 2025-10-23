import { useOrderFindAll } from '@/shared/query/order/use-order-find-all.query'
import {
  ActivityIndicator,
  Image,
  ListRenderItemInfo,
  Text,
  View,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

export const OrdersScreen = () => {
  // TODO: handle filters and paging
  const { data, isPending, isRefetching } = useOrderFindAll()
  const orders = data?.data || []

  function renderItem(item: ListRenderItemInfo<(typeof orders)[0]>) {
    const order = item.item
    return (
      <View className="grid bg-white p-3 rounded-md shadow-gray-400">
        <View className="flex justify-between">
          <View>
            <Text>{order.id}</Text>
            <Text>{new Date(order.orderDate).toLocaleDateString()}</Text>
          </View>
          <Text>{order.order_status}</Text>
        </View>
        <View>
          {order.orderItems.map((item) => {
            return (
              <View
                className="flex flex-col items-center gap-3 my-2"
                key={item.id}
              >
                <Image
                  className="rounded-md size-4"
                  source={{
                    uri: `https://picsum.photos/140/140?random=${item.id}`,
                  }}
                />
                <Text>{item.productVariant.name}</Text>
              </View>
            )
          })}
        </View>
        <View className="mt-4 border-t border-t-gray-600">
          <Text>Total Amount</Text>
          <Text>{order.totalAmount}</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1">
      {isPending ? (
        <ActivityIndicator
          className="self-center justify-self-center"
          size="large"
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          contentContainerClassName="px-3 pb-5"
          refreshing={isRefetching}
          refreshControl={<ActivityIndicator size="small" />}
        />
      )}
    </View>
  )
}
