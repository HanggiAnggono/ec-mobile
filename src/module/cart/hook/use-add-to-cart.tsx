import { apiClient } from '@/module/core'

export const useAddToCart = () => {
  return apiClient.useMutation('post', '/cart/items')
}
