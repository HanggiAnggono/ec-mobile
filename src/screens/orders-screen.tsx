import { useOrderFindAll } from '@/shared/query/order/use-order-find-all.query'
import {
  ActivityIndicator,
  Image,
  ListRenderItemInfo,
  Text,
  View,
  FlatList,
} from 'react-native'
import { Separator } from '@/components/separator'
import { formatCurrency } from '@/module/utils'

export const OrdersScreen = () => {
  // TODO: handle filters and paging
  const { data, isPending, isRefetching, refetch } = useOrderFindAll()
  const orders = data?.data || []

  function renderItem(item: ListRenderItemInfo<(typeof orders)[0]>) {
    const order = item.item
    return (
      <View className="grid bg-white p-3 rounded-md shadow-gray-400">
        <View className="flex flex-row justify-between">
          <View>
            <Text>#{order.id}</Text>
            <Text className="text-sm text-gray-500">
              {new Date(order.orderDate).toLocaleDateString()}
            </Text>
          </View>
          <Text>{order.order_status?.replace(/_/g, ' ')}</Text>
        </View>
        <View>
          {order.orderItems?.map((item) => {
            return (
              <View
                className="flex flex-row items-start gap-3 my-2"
                key={item.id}
              >
                <Image
                  className="rounded-md size-14"
                  source={{
                    uri: `https://picsum.photos/140/140?random=${item.id}`,
                  }}
                />
                <View>
                  <Text>{item.productVariant?.product?.name}</Text>
                  <Text className="text-sm text-gray-500">
                    {item.productVariant?.name}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
        <View className="mt-4 border-t border-t-gray-300 py-2">
          <Text>Total Amount</Text>
          <Text>{formatCurrency(order.totalAmount)}</Text>
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
          contentContainerClassName="px-3 py-5"
          refreshing={isRefetching}
          onRefresh={refetch}
          ItemSeparatorComponent={Separator}
        />
      )}
    </View>
  )
}
