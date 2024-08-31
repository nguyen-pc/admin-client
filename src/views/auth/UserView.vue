<template>
  <div id="user">
    <div class="container">
      <Suspense>
        <template #default>
          <div v-if="user" class="mt-10 p-5">
            <div class="text-[50px] font-bold">Welcome, Admin</div>
            <div class="text-[20px] font-semibold text-gray-500">
              Start the day with managing new book
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
import { useAuthStore } from "../../stores/auth";
import { computed, onMounted } from "vue";

const authStore = useAuthStore();

const user = computed(() => {
  console.log(authStore.userDetail);
  return authStore.userDetail;
});

async function getUser() {
  await authStore.getUser();
}

onMounted(async () => {
  await getUser();
});
console.log(user.value);
</script>

<style scoped>
#user .card {
  max-width: 40vw;
  margin: auto;
}
</style>
