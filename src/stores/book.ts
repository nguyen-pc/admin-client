import { defineStore } from 'pinia'
import { useApi, useApiPrivate } from '../composable/useApi'

export interface Book {
  id: string
  name: string
  unitCost: number
  number: number
  publishYear: number
  author: string
  publisher: string
  cover: string
}

export interface State {
  books: Book[]
  accessToken: string
  authReady: boolean
}

export const useBookStore = defineStore('book', {
  state: (): State => {
    return {
      books: [] as Book[],
      accessToken: '' as string,
      authReady: false as boolean
    }
  },

  getters: {
    allBooks: (state: State) => state.books,
    isAuthenticated: (state: State) => (state.accessToken ? true : false)
  },

  actions: {
    async getAllBooks() {
      try {
        const { data } = await useApi().get('/api/book/allbook')
        this.books = data
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async getBookById(bookId: string) {
      try {
        const { data } = await useApi().get(`/api/book/bookid/${bookId}`)
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async createBook(bookData: Book) {
      console.log(bookData)
      try {
        const { data } = await useApi().post('/api/book/create', bookData)
        await this.getAllBooks()
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async updateBook(bookId: string, bookData: FormData) {
      try {
        // Sau đó cập nhật thông tin sách (không bao gồm ảnh cover) bằng cách gọi API updateBook
        await useApiPrivate().put(`/api/book/bookId/${bookId}`, bookData)

        // Cuối cùng, sau khi cập nhật thành công, gọi lại action getAllBooks để cập nhật danh sách sách mới
        await this.getAllBooks()
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async uploadCover(coverFile: any) {
      try {
        // Tạo đối tượng FormData để chứa dữ liệu của ảnh
        const formData = new FormData()
        formData.append('cover', coverFile)

        // Gửi yêu cầu POST đến endpoint '/api/book/uploadCover/' để tải lên ảnh bìa
        const { data } = await useApi().post('/api/book/uploadCover/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // Trả về dữ liệu từ phản hồi của máy chủ
        return data
      } catch (error: any) {
        // Nếu có lỗi, ném ra một lỗi mới
        throw new Error('Error uploading cover: ' + error.message)
      }
    },

    async deleteBook(bookId: string) {
      try {
        await useApiPrivate().delete(`/api/book/bookId/${bookId}`)
        this.books = this.books.filter((book) => book.id !== bookId)
      } catch (error: Error | any) {
        throw error.message
      }
    }
  }
})
