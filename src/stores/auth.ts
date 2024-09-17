import { defineStore } from 'pinia'
import { useApi, useApiPrivate } from '../composable/useApi'

export interface User {
  id: number
  username: string
  email: string
  isStaff: false
  phoneNumber: string
  address: string
  first_name: string
  last_name: string
  full_name?: string
  key: string
}

export interface State {
  user: User
  users: User[]
  totalUsers: number
  totalPages: number
  currentPage: number
  accessToken: string
  authReady: boolean
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
}

export interface CreateUserData {
  username: string
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
  isStaff: boolean
  address: string
  gender: string
  phoneNumber: string
  birthday: Date
}

export const useAuthStore = defineStore('auth', {
  state: (): State => {
    return {
      user: {} as User,
      users: [] as User[],
      totalUsers: 0,
      totalPages: 0,
      currentPage: 1,
      accessToken: '' as string,
      authReady: false as boolean
    }
  },

  getters: {
    userDetail: (state: State) => state.user,
    allUser: (state: State) => state.users,
    isAuthenticated: (state: State) => (state.accessToken ? true : false)
  },

  actions: {
    async attempt() {
      try {
        await this.refresh()
        await this.getUser()
        await this.getAllUser(this.currentPage, 10)
      } catch (error) {
        return
      }
      return
    },

    async login(payload: LoginData) {
      try {
        const { data } = await useApi().post(`/api/auth/login`, payload)
        this.accessToken = data.access_token
        await this.getUser()
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async register(payload: RegisterData) {
      try {
        const { data } = await useApi().post(`/api/auth/register`, payload)
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async getUser() {
      try {
        const { data } = await useApiPrivate().get(`/api/auth/user`)
        this.user = data
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async logout() {
      try {
        const { data } = await useApiPrivate().post(`/api/auth/logout`)
        this.accessToken = ''
        this.user = {} as User
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },
    async getAllUser(pageNumber: number, limit: number) {
      console.log(pageNumber, limit)
      try {
        const { data } = await useApiPrivate().get(`/api/auth/getAllUser`, {
          params: {
            pageNumber: pageNumber, // pass the pageNumber
            limit: limit // pass the limit
          }
        })
        this.totalUsers = data.totalUsers
        this.totalPages = data.totalPages
        this.currentPage = data.currentPage
        this.users = data
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async createUser(payload: CreateUserData) {
      try {
        const { data } = await useApi().post(`/api/auth/createAuth`, payload)
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },
    async getUserById(userId: string) {
      try {
        const { data } = await useApiPrivate().get(`/api/auth/user/${userId}`)
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },
    async deleteUser(userId: number) {
      try {
        await useApiPrivate().delete(`/api/auth/user/${userId}`)
        await this.getAllUser(1, 5)
      } catch (error: any) {
        throw new Error(error.message)
      }
    },

    async updateUser(userId: string, userData: any) {
      try {
        await useApiPrivate().put(`/api/auth/user/${userId}`, userData)
        await this.getAllUser(1, 10)
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async refresh() {
      try {
        const { data } = await useApi().post(`/api/auth/refresh`)
        this.accessToken = data.access_token
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    }
  }
})
