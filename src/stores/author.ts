import { defineStore } from 'pinia'
import { useApi, useApiPrivate } from '../composable/useApi'

export interface Author {
  id: string
  name: string
  address: string
}

export interface State {
  author: Author[]
  accessToken: string
  authReady: boolean
}

export const useAuthorStore = defineStore('author', {
  state: (): State => {
    return {
      author: [] as Author[],
      accessToken: '' as string,
      authReady: false as boolean
    }
  },

  getters: {
    allAuthors: (state: State) => state.author,
    isAuthenticated: (state: State) => (state.accessToken ? true : false)
  },

  actions: {
    async getAllAuthors() {
      try {
        const { data } = await useApi().get('/api/author/allAuthor')
        this.author = data
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async getAllPublisherById(authorId: string) {
      try {
        const { data } = await useApi().get(`/api/author/getauthor/${authorId}`)
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async createAuthor(payload: Author) {
      try {
        const { data } = await useApi().post('/api/author/create', payload)
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async updateAuthor(authorId: string, authorData: any) {
      try {
        await useApiPrivate().put(`/api/author/update/${authorId}`, authorData)
        await this.getAllAuthors()
      } catch (error: Error | any) {
        throw error.message
      }
    },
    async deleteAuthor(id: string) {
      try {
        await useApiPrivate().delete(`/api/author/delete/${id}`)
        this.author = this.author.filter((p) => p.id !== id)
      } catch (error: Error | any) {
        throw error.message
      }
    }
  }
})
