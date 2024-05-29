<template>
  <div class="p-2 mt-10">
    <router-link :to="{ name: 'home' }">
      <div class="mb-2 text-lg font-semibold cursor-pointer hover:text-gray-500">
        Trang chủ
      </div>
    </router-link>
    <h5 class="mb-1 text-xl font-bold">
      {{ isEdit ? "Sửa người dùng" : "Tạo người dùng mới" }}
    </h5>
  </div>
  <div id="register" class="flex justify-center items-center min-h-screen">
    <div class="container mx-auto max-w-md">
      <div class="bg-white shadow-md rounded px-8 py-6 mt-4">
        <form @submit.prevent="submit">
          <p v-if="errorMessage" class="text-red-500 mb-4">
            {{ errorMessage }}
          </p>
          <div class="mb-4">
            <label for="username" class="block text-gray-700">Username</label>
            <input
              v-model="formData.username"
              type="text"
              class="w-full px-3 py-2 border rounded"
              id="username"
              autocomplete="off"
            />
          </div>
          <div class="mb-4">
            <label for="first_name" class="block text-gray-700">First Name</label>
            <input
              v-model="formData.first_name"
              type="text"
              class="w-full px-3 py-2 border rounded"
              id="first_name"
              autocomplete="off"
            />
          </div>
          <div class="mb-4">
            <label for="last_name" class="block text-gray-700">Last Name</label>
            <input
              v-model="formData.last_name"
              type="text"
              class="w-full px-3 py-2 border rounded"
              id="last_name"
              autocomplete="off"
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-gray-700">Email address</label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 border rounded"
              id="email"
              autocomplete="off"
            />
          </div>
          <div v-if="!isEdit" class="mb-4">
            <label for="password" class="block text-gray-700">Password</label>
            <input
              v-model="formData.password"
              type="password"
              class="w-full px-3 py-2 border rounded"
              id="password"
            />
          </div>
          <div v-if="!isEdit" class="mb-4">
            <label for="password_confirm" class="block text-gray-700"
              >Confirm Password</label
            >
            <input
              v-model="formData.password_confirm"
              type="password"
              class="w-full px-3 py-2 border rounded"
              id="password_confirm"
            />
          </div>
          <div class="mb-4">
            <label for="phoneNumber" class="block text-gray-700">Phone number</label>
            <input
              v-model="formData.phoneNumber"
              type="text"
              class="w-full px-3 py-2 border rounded"
              id="phoneNumber"
              autocomplete="off"
            />
          </div>
          <div class="mb-4">
            <label for="address" class="block text-gray-700">Address</label>
            <input
              v-model="formData.address"
              type="text"
              class="w-full px-3 py-2 border rounded"
              id="address"
              autocomplete="off"
            />
          </div>
          <div class="flex justify-between mb-4">
            <div class="mr-4">
              <label for="isStaff" class="block text-gray-700">Nhân viên:</label>
              <input
                type="checkbox"
                id="isStaff"
                class="w-5 h-5"
                v-model="formData.isStaff"
              />
            </div>
            <div>
              <label for="gender" class="block text-gray-700">Giới tính:</label>
              <select
                id="gender"
                v-model="formData.gender"
                class="w-full px-3 py-2 border rounded"
              >
                <option value="1">Nam</option>
                <option value="0">Nữ</option>
                <option value="2">Unkown</option>
              </select>
            </div>
            <div class="mr-4">
              <label for="birthday" class="block text-gray-700">Ngày sinh:</label>
              <input
                type="date"
                id="birthday"
                class="w-30 h-5"
                v-model="formData.birthday"
              />
            </div>
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
import { useAuthStore, type CreateUserData } from '../../stores/auth';
import { reactive, ref, onMounted, computed } from 'vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formData = reactive<CreateUserData>({
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  password_confirm: "",
  phoneNumber: "",
  gender: "1",
  isStaff: false,
  address: "",
  birthday: '1974-03-12'
});

const errorMessage = ref<string>("");

const isEdit = computed(() => !!route.params.id);

onMounted(async () => {
  if (isEdit.value) {
    const user = await authStore.getUserById(route.params.id);
    formData.username = user.username;
    formData.email = user.email;
    formData.first_name = user.first_name;
    formData.last_name = user.last_name;
    formData.phoneNumber = user.phoneNumber;
    formData.gender = user.gender;
    formData.isStaff = user.isStaff;
    formData.address = user.address;
    formData.birthday = user.birthday;
  }
});

async function submit() {
  try {
    if (isEdit.value) {
      await authStore.updateUser(route.params.id, formData);
    } else {
      await authStore.createUser(formData);
    }
    router.replace({ name: "users" });
  } catch (err:any) {
    errorMessage.value = err.message;
  }
}
</script>
