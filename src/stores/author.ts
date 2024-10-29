import { defineStore } from 'pinia'
import { useApi, useApiPrivate } from '../composable/useApi'

export interface Author {
  id: string
  name: string
  address: string
  detail: string
}

export interface State {
  author: Author[]
  accessToken: string
  totalUsers: number
  totalPages: number
  currentPage: number
  authReady: boolean
}

export const useAuthorStore = defineStore('author', {
  state: (): State => {
    return {
      author: [] as Author[],
      accessToken: '' as string,
      totalUsers: 0,
      totalPages: 0,
      currentPage: 1,
      authReady: false as boolean
    }
  },

  getters: {
    allAuthors: (state: State) => state.author,
    isAuthenticated: (state: State) => (state.accessToken ? true : false)
  },

  actions: {
    async getAllAuthors(pageNumber: number, limit: number) {
      try {
        const { data } = await useApi().get('/api/author/allAuthor', {
          params: {
            pageNumber: pageNumber, // pass the pageNumber
            limit: limit // pass the limit
          }
        })

        this.totalUsers = data.totalUsers
        this.totalPages = data.totalPages
        this.currentPage = data.currentPage
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
        await this.getAllAuthors(0, 10)
      } catch (error: Error | any) {
        throw error.message
      }
    },
    async deleteAuthor(id: string) {
      try {
        await useApiPrivate().delete(`/api/author/delete/${id}`)
        await this.getAllAuthors(1, 5)
        // this.author = this.author.filter((p) => p.id !== id)
      } catch (error: Error | any) {
        throw error.message
      }
    }
  }
})
