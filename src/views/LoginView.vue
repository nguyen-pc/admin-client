<template>
  <div id="login">
    <div class="container">
      <div class="card card-body mt-4">
        <h5 class="card-title">Login</h5>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input
              v-model="loginData.email"
              type="email"
              class="form-control"
              id="email"
              autocomplete="off"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              v-model="loginData.password"
              type="password"
              class="form-control"
              id="password"
            />
          </div>
          <button type="submit" class="btn btn-success">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore, type LoginData } from '../stores/auth';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { toast, type ToastOptions } from 'vue3-toastify';

const authStore = useAuthStore()
const router = useRouter()

const loginData = reactive<LoginData>({
  email: "",
  password: "",
})

const errorMessage = ref<string>("")

async function submit(){
  if(!loginData.email ){
    toast.error("Bạn chưa nhập email!", {
    autoClose: 2000,
    position: toast.POSITION.BOTTOM_RIGHT,
  } as ToastOptions);
  }
  if(!loginData.password){
      toast.error("Bạn chưa nhập mật khẩu!", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
  } as ToastOptions);
    }
  await authStore.login(loginData)
    .then(res => {
      toast.success("Đăng nhập thành công!", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
      } as ToastOptions)
      router.replace({name: "user"})
    })
    .catch(err => {
      toast.error("Email hoặc mật khẩu chưa đúng!", {
    autoClose: 2000,
    position: toast.POSITION.BOTTOM_RIGHT,
  } as ToastOptions);
      errorMessage.value = err.message
    })
}
</script>

<style scoped>
#login .card {
  max-width: 40vw;
  margin: auto;
}
</style>
