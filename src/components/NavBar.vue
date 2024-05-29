<template>
  <nav class="bg-blue-500 h-16 fixed w-full top-0 z-50">
    <div class="container mx-auto flex justify-between items-center h-full">
      <router-link class="text-white text-lg font-bold" :to="{ name: 'home' }">
        Navbar
      </router-link>
      <button @click="toggleNavbar" class="text-white block lg:hidden">
        <span class="material-icons">menu</span>
      </button>
      <div
        :class="{ block: navbarOpen, hidden: !navbarOpen }"
        class="w-full lg:flex lg:items-center lg:w-auto"
      >
        <ul class="flex flex-col lg:flex-row lg:space-x-4 lg:mt-0">
          <!-- Home link placeholder -->
          <!-- <li class="nav-item">
            <router-link :to="{ name: 'home' }" class="text-white py-2 lg:py-0">Home</router-link>
          </li> -->
        </ul>
        <ul class="flex flex-col lg:flex-row lg:space-x-4 lg:mt-0 mr-64">
          <li v-if="isAuthenticated" class="relative">
            <button
              @click="toggleDropdown"
              class="text-black py-2 mt-1 bg-red-100 w-[50px] h-[50px] text-sm text-center rounded-full lg:py-0 flex items-center"
            >
              {{ user.username }}
              <!-- Arrow icon placeholder -->
              <!-- <span class="material-icons ml-1">arrow_drop_down</span> -->
            </button>
            <ul
              :class="{ block: dropdownOpen, hidden: !dropdownOpen }"
              class="absolute right-0 mt-2 bg-white shadow-md rounded-lg"
            >
              <li>
                <router-link
                  :to="{ name: 'user' }"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Profile
                </router-link>
              </li>
              <li><hr class="my-2" /></li>
              <li>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                >
                  Logout
                </button>
              </li>
            </ul>
          </li>
          <template v-else>
            <div class="flex items-center mt-2 gap-3">
              <li class="nav-item">
                <router-link
                  :to="{ name: 'login' }"
                  class="text-white py-2 lg:py-0 no-underline"
                >
                  Login
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'register' }"
                  class="text-white py-2 lg:py-0 no-underline"
                >
                  Register
                </router-link>
              </li>
            </div>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const navbarOpen = ref(false);
const dropdownOpen = ref(false);

function toggleNavbar() {
  navbarOpen.value = !navbarOpen.value;
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

async function logout() {
  await authStore
    .logout()
    .then(() => {
      router.replace({ name: "home" });
    })
    .catch((err) => {
      console.log(err.message);
    });
}
</script>
