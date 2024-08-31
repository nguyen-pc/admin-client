<template>
  <div class="p-2 mt-10">
    <router-link :to="{ name: 'home' }">
      <div class="mb-2 ml-4 text-lg font-semibold cursor-pointer hover:text-gray-500">
        Trang chủ
      </div>
    </router-link>
    <h5 class="mb-1 t ml-4 text-xl font-bold">
      {{ isEdit ? "Sửa Nhà xuất bản" : "Tạo Nhà xuất bản" }}
    </h5>
  </div>
  <div id="register" class="flex justify-center items-center">
    <div class="container mx-auto max-w-md">
      <div class="bg-white shadow-md rounded px-8 py-6 mt-4">
        <form @submit.prevent="submit">
          <p v-if="errorMessage" class="text-red-500 mb-4">
            {{ errorMessage }}
          </p>
          <div class="">
            <label for="username" class="block text-gray-700">Tên nhà xuất bản</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border rounded"
              id="username"
              autocomplete="off"
            />
          </div>
          <div class="mb-4">
            <label for="first_name" class="block text-gray-700">Địa chỉ</label>
            <input
              v-model="formData.address"
              type="text"
              class="w-full px-3 py-2 border rounded"
              id="first_name"
              autocomplete="off"
            />
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
import { usePublisherStore, type Publisher } from '../../stores/publisher';
import { reactive, ref, onMounted, computed } from 'vue';
import { toast, type ToastOptions } from 'vue3-toastify';
const router = useRouter();
const route = useRoute();
const publisherStore = usePublisherStore();

const formData = reactive<Publisher>({
  id:"",
  name:"",
  address:""
});

const errorMessage = ref<string>("");

const isEdit = computed(() => !!route.params.id);

onMounted(async () => {
  if (isEdit.value) {
    const publishers = await publisherStore.getAllPublisherById(route.params.id);
    formData.name = publishers.name;
    formData.address = publishers.address;
  }
});


async function submit() {
  try {
    if (isEdit.value) {
      await publisherStore.updatePublisher(route.params.id, formData);
      toast.success("Sửa nhà xuất bản thành công!", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
   } as ToastOptions)
    } else {
      // console.log(formData)
      await publisherStore.createPublisher(formData);
      toast.success("Tạo nhà xuất bản thành công", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
   } as ToastOptions)
    }
    setTimeout(()=>{
      router.replace({ name: "publisher" });
    },2000)

  } catch (err) {
    toast.error("Lỗi!", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
   } as ToastOptions)
    errorMessage.value = err.message;
  }
}
</script>
