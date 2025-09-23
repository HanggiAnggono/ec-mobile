import { create } from 'zustand'
import { combine, persist } from 'zustand/middleware'
import { zustandStorage } from './persistence'
import { LoginResponseDto } from '@/shared/types/api'

export const useAuthStore = create(
  persist(
    combine({} as Partial<LoginResponseDto>, (set, get) => {
      return {
        setAuthStore: (auth: Partial<LoginResponseDto>) =>
          set({ ...get(), ...auth }),
      }
    }),
    {
      name: 'auth-store',
      // @ts-ignore
      storage: zustandStorage,
    }
  )
)
