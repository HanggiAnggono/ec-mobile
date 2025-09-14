import { apiClient } from '@/module/core'

export const useCheckoutCart = () => {
  return apiClient.useMutation('post', '/cart/{sessionId}/checkout')
}
