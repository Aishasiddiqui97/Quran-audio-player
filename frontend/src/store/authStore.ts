import { create } from "zustand"
import api from "@/lib/api"
import type { User, AuthResponse } from "@/types"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loadUser: () => Promise<void>
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    })
    localStorage.setItem("token", data.token)
    set({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    })
  },

  signup: async (name: string, email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/signup", {
      name,
      email,
      password,
    })
    localStorage.setItem("token", data.token)
    set({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    })
  },

  logout: () => {
    localStorage.removeItem("token")
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },

  loadUser: async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null, token: null })
      return
    }

    try {
      const { data } = await api.get("/auth/me")
      set({
        user: data.user,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      localStorage.removeItem("token")
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  updateUser: (user: User) => {
    set({ user })
  },
}))
