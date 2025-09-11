import { apiClient } from '@/module/core'
import { paths } from '@/shared/types/api'
import { useQuery } from '@tanstack/react-query'

// TODO: paging
export const useGetProducts = () => {
  return apiClient.useQuery('get', '/products')
}

export const useCart = () => {
  return apiClient.useQuery('get', '/cart')
}
