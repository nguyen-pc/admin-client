<template>
  <div id="user">
    <div class="flex justify-center items-center bg-gray-800">
      <Suspense>
        <template #default>
          <div class="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <div class="flex flex-col items-center">
              <div
                class="bg-green-400 text-lg font-semibold py-2 px-4 rounded-md text-center mt-3"
              >
                {{ user.full_name }}
              </div>
              <div
                class="bg-red-100 text-black w-16 h-16 text-sm text-center flex items-center justify-center rounded-full mt-4"
              >
                N
              </div>
              <div class="font-medium mt-4">
                {{ user.email }}
              </div>
              <div class="font-medium mt-2">Admin</div>
              <hr class="my-4 border-gray-600 w-full" />
              <button
                @click="editUser(user)"
                class="w-full text-center px-4 py-2 text-red-600 hover:bg-gray-200 rounded-md transition-colors"
              >
                Edit
              </button>
              <button
                @click="logout"
                class="w-full text-center px-4 py-2 text-red-600 hover:bg-gray-200 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </template>

        <template #fallback>
          <p>Loading...</p>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { useAuthStore } from "../stores/auth";
import { computed, onMounted } from "vue";

const authStore = useAuthStore();

const user = computed(() => {
  return authStore.userDetail;
});
console.log(user);
async function getUser() {
  await authStore.getUser();
}
const editUser = (user: any) => {
  console.log(user._id);
  router.push({ name: "authUser:edit", params: { id: user._id } });
};

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

onMounted(async () => {
  await getUser();
});
</script>

<style scoped>
/* No custom styles needed since Tailwind handles everything */
</style>
