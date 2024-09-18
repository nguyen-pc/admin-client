import { defineStore } from 'pinia'
import { useApi, useApiPrivate } from '../composable/useApi'

export interface Publisher {
  id: string
  name: string
  address: string
}

export interface State {
  publishers: Publisher[]
  accessToken: string
  authReady: boolean
  totalUsers: number
  totalPages: number
  currentPage: number
}

export const usePublisherStore = defineStore('publisher', {
  state: (): State => {
    return {
      publishers: [] as Publisher[],
      accessToken: '' as string,
      totalUsers: 0,
      totalPages: 0,
      currentPage: 1,
      authReady: false as boolean
    }
  },

  getters: {
    allPublishers: (state: State) => state.publishers,
    isAuthenticated: (state: State) => (state.accessToken ? true : false)
  },

  actions: {
    async getAllPublishers(pageNumber: number, limit: number) {
      try {
        const { data } = await useApi().get('/api/publisher/allPublisher', {
          params: {
            pageNumber: pageNumber, // pass the pageNumber
            limit: limit // pass the limit
          }
        })

        this.totalUsers = data.totalUsers
        this.totalPages = data.totalPages
        this.currentPage = data.currentPage
        this.publishers = data
        return data

      } catch (error: Error | any) {
        throw error.message
      }
    },

    async getAllPublisherById(publisherId: string) {
      try {
        const { data } = await useApi().get(`/api/publisher/publisherId/${publisherId}`)
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async createPublisher(payload: Publisher) {
      try {
        const { data } = await useApi().post('/api/publisher/create', payload)
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async updatePublisher(publisherId: string, publisherData: any) {
      try {
        await useApiPrivate().put(`/api/publisher/publisherId/${publisherId}`, publisherData)
        await this.getAllPublishers(1,5)
      } catch (error: Error | any) {
        throw error.message
      }
    },
    async deletePublisher(id: string) {
      try {
        await useApiPrivate().delete(`/api/publisher/${id}`)
        await this.getAllPublishers(1, 5)
        // this.publishers = this.publishers.filter((p) => p.id !== id)
      } catch (error: Error | any) {
        throw error.message
      }
    }
  }
})
