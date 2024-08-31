<template>
  <div class="p-2 mt-10">
    <router-link :to="{ name: 'home' }">
      <div class="mb-2 ml-4 text-lg font-semibold cursor-pointer hover:text-gray-500">
        Trang chủ
      </div>
    </router-link>
    <h5 class="mb-1 ml-4 text-xl font-bold">
      {{ isEdit ? "Sửa sách" : "Tạo sách" }}
    </h5>
  </div>
  <div id="register" class="flex justify-center items-center">
    <div class="container mx-auto max-w-md">
      <div class="bg-white shadow-md rounded px-8 py-6 mt-4">
        <form @submit.prevent="submit">
          <p v-if="errorMessage" class="text-red-500 mb-4">
            {{ errorMessage }}
          </p>
          <div class="mb-4">
            <label for="name" class="block text-gray-700">Tên sách</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border rounded"
              id="name"
              autocomplete="off"
            />
          </div>
          <div class="mb-4">
            <label for="unitCost" class="block text-gray-700">Đơn giá</label>
            <input
              v-model="formData.unitCost"
              type="number"
              class="w-full px-3 py-2 border rounded"
              id="unitCost"
              autocomplete="off"
            />
          </div>
          <div class="mb-4">
            <label for="number" class="block text-gray-700">Số lượng</label>
            <input
              v-model="formData.number"
              type="number"
              class="w-full px-3 py-2 border rounded"
              id="number"
              autocomplete="off"
            />
          </div>
          <div class="mb-4">
            <label for="publishYear" class="block text-gray-700">Năm xuất bản</label>
            <input
              v-model="formData.publishYear"
              type="number"
              class="w-full px-3 py-2 border rounded"
              id="publishYear"
              autocomplete="off"
            />
          </div>
          <div class="mb-4">
            <label for="author" class="block text-gray-700">Tác giả</label>
            <select
              v-model="formData.author"
              class="w-full px-3 py-2 border rounded"
              id="author"
            >
              <option v-for="author in authors" :key="author._id" :value="author._id">
                {{ author.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="publisher" class="block text-gray-700">Nhà xuất bản</label>
            <select
              v-model="formData.publisher"
              class="w-full px-3 py-2 border rounded"
              id="publisher"
            >
              <option
                v-for="publisher in publishers"
                :key="publisher._id"
                :value="publisher._id"
              >
                {{ publisher.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="cover" class="block text-gray-700">Ảnh bìa</label>
            <file-pond
              ref="pond"
              name="cover"
              label-idle="Kéo và thả ảnh bìa hoặc nhấp để chọn"
              allow-multiple="false"
              accepted-file-types="image/*"
              @updatefiles="handleFileChange"
            />
            <button
              type="button"
              @click="uploadCover"
              class="w-20 bg-green-500 text-white py-2 rounded"
            >
              Chọn ảnh
            </button>
          </div>
          <button type="submit" class="w-full bg-green-500 text-white py-2 rounded">
            {{ isEdit ? "Cập nhật" : "Tạo" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useBookStore, type Book } from '../../stores/book';
import { usePublisherStore, type Publisher } from '../../stores/publisher';
import { useAuthorStore, type Author } from '../../stores/author';
import { reactive, ref, onMounted, computed } from 'vue';
import vueFilePond from "vue-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { registerPlugin } from 'filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import axios from 'axios'; // Import axios for making HTTP requests
import { toast, type ToastOptions } from 'vue3-toastify';

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);
registerPlugin(FilePondPluginImagePreview);

const router = useRouter();
const route = useRoute();
const bookStore = useBookStore();
const authorStore = useAuthorStore()
const publisherStore = usePublisherStore()

const formData = reactive<Book>({
  id:"",
  name: "",
  unitCost: 0,
  number: 0,
  publishYear: 0,
  author: "",
  publisher: "",
  cover:""
});

const errorMessage = ref<string>("");

const isEdit = computed(() => !!route.params.id);
const file = ref<File | null>(null);
const coverImageUrl = ref<string | null>(null);

const authors = ref<Author[]>([]);
const publishers = ref<Publisher[]>([]);

onMounted(async () => {
  try {
    authors.value = await authorStore.getAllAuthors(); // Lấy danh sách tác giả từ cơ sở dữ liệu
    publishers.value = await publisherStore.getAllPublishers(); // Lấy danh sách nhà xuất bản từ cơ sở dữ liệu

    if (isEdit.value) {
      const book = await bookStore.getBookById(route.params.id);
      formData.name = book.name;
      formData.unitCost = book.unitCost;
      formData.number = book.number;
      formData.publishYear = book.publishYear;
      formData.author = book.author.id;
      formData.publisher = book.publisher.id;
      coverImageUrl.value = book.cover; // Gán URL ảnh bìa nếu có
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

let coverPath = ''
const handleFileChange = async (files: File[]) => {
  try {
    if (files.length > 0) {
      const fileData = files[0].file;
      formData.cover = fileData
      console.log( formData.cover )

      coverPath =  formData.cover
      // const response = await bookStore.uploadCover(formData.cover)
      // coverImageUrl.value = response.imageUrl;
      // console.log("Uploaded image URL:", coverImageUrl.value);
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }

};

const uploadCover = async () => {
  try{
   console.log(coverPath)
     const response = await bookStore.uploadCover(coverPath)
      coverImageUrl.value = response.imageUrl;
      toast.success("upload ảnh thành công!", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
   } as ToastOptions)
      console.log("Uploaded image URL:", coverImageUrl.value);
  }catch(error){
    console.error("Error fetching data:", error);
  }

}

async function submit() {
  try {
    const formDataToSend = {
      name: formData.name,
      unitCost: formData.unitCost,
      number: formData.number,
      publishYear: formData.publishYear,
      author: formData.author,
      publisher: formData.publisher,
      cover: coverImageUrl.value // Thêm đường dẫn hình ảnh vào dữ liệu gửi đi
    };
    console.log(formDataToSend.cover)

    if (isEdit.value) {
       bookStore.updateBook(route.params.id, formDataToSend);
       toast.success("Tạo sách thành công!", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
   } as ToastOptions)
    } else {
      const response = await bookStore.createBook(formDataToSend);
       toast.success("Sửa thành công!", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
   } as ToastOptions)
    }
    setTimeout(()=>{
      router.replace({ name: "book" });
    },2000)

  } catch (err:any) {
    toast.error("Lỗi tạo sách!", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
   } as ToastOptions)
    errorMessage.value = err.message;
  }
}
</script>
