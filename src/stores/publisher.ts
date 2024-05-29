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
}

export const usePublisherStore = defineStore('publisher', {
  state: (): State => {
    return {
      publishers: [] as Publisher[],
      accessToken: '' as string,
      authReady: false as boolean
    }
  },

  getters: {
    allPublishers: (state: State) => state.publishers,
    isAuthenticated: (state: State) => (state.accessToken ? true : false)
  },

  actions: {
    async getAllPublishers() {
      try {
        const { data } = await useApi().get('/api/publisher/allPublisher')
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
        await this.getAllPublishers()
      } catch (error: Error | any) {
        throw error.message
      }
    },
    async deletePublisher(id: string) {
      try {
        await useApiPrivate().delete(`/api/publisher/${id}`)
        this.publishers = this.publishers.filter((p) => p.id !== id)
      } catch (error: Error | any) {
        throw error.message
      }
    }
  }
})
