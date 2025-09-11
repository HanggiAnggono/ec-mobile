import { apiClient } from "@/module/core"

// TODO: paging
export const useGetProduct = (id: number) => {
  return apiClient.useQuery('get', '/products/{id}', {
    params: { path: { id: `${id}` } }
  })
}