import { defineStore } from 'pinia'
import { useApi, useApiPrivate } from '../composable/useApi'

export interface Borrow {
  id: string
  user: string
  book: string
  borrowedDay: Date
  estimatedReturnDate: Date
  actualReturnDate: Date | null
}

export interface State {
  borrows:  Borrow[]
  accessToken: string
  authReady: boolean
}

export const useBorrowStore = defineStore('borrow', {
  state: (): State => {
    return {
      borrows: [] as Borrow[],
      accessToken: '' as string,
      authReady: false as boolean
    }
  },

  getters: {
    allBorrow: (state: State) => state.borrows,
    isAuthenticated: (state: State) => (state.accessToken ? true : false)
  },

  actions: {
    async getAllBorrows() {
      try {
        const { data } = await useApi().get('/api/borrow/allborrow')
        this.borrows = data
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    }
  }
})
