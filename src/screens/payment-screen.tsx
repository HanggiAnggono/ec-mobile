import React from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { StackScreenProp } from '.'
import { useOrderFindOne } from '@/shared/query/order/use-order-find-one.query'

export const PaymentScreen: React.FC<StackScreenProp<'Payment'>> = ({
  navigation,
  route,
}) => {
  // Get order details from navigation params (or use hardcoded for now)
  const orderId = route.params?.orderId || ''
  const { isFetching, data: orderDetails } = useOrderFindOne({
    params: { path: { id: orderId } },
  })

  const handlePayNow = () => {
    // TODO: Implement actual payment processing
    navigation.navigate('Home')
  }

  const handleBackToHome = () => {
    navigation.navigate('Home')
  }

  if (isFetching) {
    return (
      <ActivityIndicator className="flex-1 flex self-center justify-self-center" />
    )
  }

  if (!orderDetails) {
    return (
      <View>
        <Text>Order not found, please create again</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="bg-white px-4 py-6 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmation
          </Text>
          <Text className="text-lg text-green-600 font-semibold mb-1">
            #{orderDetails?.id}
          </Text>
          <Text className="text-base text-gray-600">
            Order Date: {orderDetails?.orderDate}
          </Text>
          <View className="mt-3 px-3 py-1 bg-yellow-100 rounded-full self-start">
            <Text className="text-yellow-800 font-medium text-sm">
              {orderDetails?.order_status}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View className="bg-white mt-2 px-4 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Order Items ({orderDetails?.orderItems?.length})
          </Text>

          {orderDetails?.orderItems?.map((item, index) => (
            <View key={item.id} className="mb-4">
              <View className="flex-row">
                <Image
                  source={{
                    uri: `https://picsum.photos/140/140?random=${orderId}`,
                  }}
                  className="w-16 h-16 rounded-lg mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 mb-1">
                    {item?.productVariant?.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Qty: {item.quantity}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-semibold text-gray-900">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
              {index < orderDetails.orderItems?.length - 1 && (
                <View className="border-b border-gray-100 mt-4" />
              )}
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View className="bg-white mt-2 px-4 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </Text>

          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="text-gray-900">
                ${(orderDetails.totalAmount - 10).toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="text-gray-900">$10.00</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Tax</Text>
              <Text className="text-gray-900">$0.00</Text>
            </View>
            <View className="border-t border-gray-200 pt-2 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-lg font-semibold text-gray-900">Total</Text>
                <Text className="text-lg font-semibold text-gray-900">
                  ${orderDetails.totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="bg-white mt-2 px-4 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Payment Method
          </Text>
          <View className="flex-row items-center">
            <View className="w-10 h-6 bg-blue-600 rounded mr-3 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">VISA</Text>
            </View>
            <Text className="text-gray-900">
              {orderDetails.payment?.[0]?.payment_method}
            </Text>
          </View>
        </View>

        {/* Shipping Address */}
        {/* <View className="bg-white mt-2 px-4 py-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Shipping Address
          </Text>
          <Text className="text-gray-900 font-medium">
            {orderDetails.shippingAddress.name}
          </Text>
          <Text className="text-gray-600 mt-1">
            {orderDetails.shippingAddress.street}
          </Text>
          <Text className="text-gray-600">
            {orderDetails.shippingAddress.city},{' '}
            {orderDetails.shippingAddress.state}{' '}
            {orderDetails.shippingAddress.zipCode}
          </Text>
          <Text className="text-gray-600">
            {orderDetails.shippingAddress.country}
          </Text>
        </View> */}
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="bg-white px-4 py-6 border-t border-gray-200 gap-y-3">
        <TouchableOpacity 
          className="bg-blue-600 py-4 rounded-lg items-center"
          onPress={handlePayNow}
        >
          <Text className="text-white font-semibold text-base">
            Pay Now - ${orderDetails.totalAmount.toFixed(2)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-gray-200 py-4 rounded-lg items-center"
          onPress={handleBackToHome}
        >
          <Text className="text-gray-700 font-semibold text-base">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
