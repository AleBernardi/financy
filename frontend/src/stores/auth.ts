import type { LoginInput, RegisterInput, User } from '@/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { apolloClient } from '@/lib/graphql/apollo'
import { REGISTER } from '@/lib/graphql/mutations/Register'
import { LOGIN } from '@/lib/graphql/mutations/Login'

type LoginMutationData = {
  login: {
    token: string
    refreshToken: string
    user: User
  }
}

type RegisterMutationData = {
  register: {
    token: string
    refreshToken: string
    user: User
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (data: LoginInput, remember: boolean) => Promise<boolean>
  signUp: (data: RegisterInput) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const hybridStorage = {
  getItem: (name: string) =>
    localStorage.getItem(name) ??
    sessionStorage.getItem(name),
  setItem: (name: string, value: string) => {
    localStorage.setItem(name, value)
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (loginData, remember) => {
        const targetStorage = remember ? localStorage : sessionStorage

        useAuthStore.persist.setOptions({
          storage: createJSONStorage(() => targetStorage),
        })

        const { data } = await apolloClient.mutate<
          LoginMutationData,
          { data: LoginInput }
        >({
          mutation: LOGIN,
          variables: {
            data: {
              email: loginData.email,
              password: loginData.password,
            },
          },
        })

        if (!data?.login) return false

        set({
          user: data.login.user,
          token: data.login.token,
          isAuthenticated: true,
        })

        return true
      },

      signUp: async (registerData) => {
        const { data } = await apolloClient.mutate<
          RegisterMutationData,
          { data: RegisterInput }
        >({
          mutation: REGISTER,
          variables: {
            data: {
              name: registerData.name,
              email: registerData.email,
              password: registerData.password,
            },
          },
        })

        if (!data?.register) return false

        set({
          user: data.register.user,
          token: data.register.token,
          isAuthenticated: true,
        })

        return true
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })

        apolloClient.clearStore()
        localStorage.removeItem('auth-storage')
        sessionStorage.removeItem('auth-storage')
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => hybridStorage),
    }
  )
)
