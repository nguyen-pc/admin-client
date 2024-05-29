<template>
  <div class="flex">
    <!-- Sidebar component -->
    <SideBar class="w-64" />

    <div class="flex-1">
      <!-- Navbar component -->
      <NavBar />

      <main class="p-4">
        <router-view />
        <!-- <h1 class="text-4xl font-bold underline text-red-600">page</h1> -->
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import SideBar from "@/components/SideBar.vue";
</script>
