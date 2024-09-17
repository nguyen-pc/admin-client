<template>
  <div class="p-4 mt-10 mr-2">
    <div class="mb-2 text-lg font-semibold">Trang chủ</div>
    <h5 class="mb-3 text-xl font-bold">Quản lí Tác giả</h5>
    <div class="flex justify-between mb-4">
      <div class="flex">
        <input
          placeholder="Nhập thông tin cần tìm"
          v-model="query"
          class="outline-none w-60 p-2 border-2 border-gray-500 rounded-l-lg"
        />
        <span class="p-2 bg-blue-500 text-white rounded-r-lg">
          <font-awesome-icon :icon="faSearch" />
        </span>
      </div>
      <router-link :to="{ name: 'author:create' }" class="no-underline">
        <div class="bg-blue-500 p-2 text-white rounded-lg text-center no-underline">
          <font-awesome-icon :icon="faUserPlus" />
          Tạo Tác giả
        </div>
      </router-link>
    </div>
    <div>
      <template v-if="!filteredData.length">
        <div>Không có tác giả nào</div>
      </template>
      <template v-else>
        <table class="min-w-full border-collapse block md:table">
          <thead class="block md:table-header-group">
            <tr
              class="border border-gray-300 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative"
            >
              <th
                v-for="column in columns"
                :key="column.key"
                class="bg-gray-200 p-2 text-gray-600 font-bold block md:table-cell"
              >
                {{ column.title }}
              </th>
              <th class="bg-gray-200 p-2 text-gray-600 font-bold block md:table-cell">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody class="block md:table-row-group">
            <tr
              v-for="row in filteredData"
              :key="row.id"
              class="bg-gray-100 border border-gray-300 md:border-none block md:table-row"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="p-2 text-gray-800 block md:table-cell"
              >
                {{ renderCell(row, column) }}
              </td>
              <td class="p-2 text-gray-800 block md:table-cell">
                <button @click="editAuthor(row)" class="mr-2 text-blue-500">Sửa</button>
                <button @click="deleteAuthor(row)" class="text-red-500">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
      <!-- Pagination -->
      <nav aria-label="Pagination" class="mt-4 flex justify-center">
      <ul class="pagination flex gap-2">
        <li>
          <button
            :disabled="pageNumber === 1"
            @click="changePage(pageNumber - 1)"
            class="bg-gray-200 p-2 rounded"
          >
            Trước
          </button>
        </li>
        <li v-for="page in totalPage" :key="page" :class="{ 'font-bold': page === pageNumber }">
          <button @click="changePage(page)" class="p-2 bg-gray-200 rounded">{{ page }}</button>
        </li>
        <li>
          <button
            :disabled="pageNumber === totalPage"
            @click="changePage(pageNumber + 1)"
            class="bg-gray-200 p-2 rounded"
          >
            Sau
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useAuthorStore } from "../../stores/author";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { toast, type ToastOptions } from 'vue3-toastify';
import { watch } from "vue";
const router = useRouter();
const route = useRoute();
const authorStore = useAuthorStore();
const query = ref("");

const columns = [
  { title: "Tên Tác giả", dataIndex: "name", key: "name" },
  { title: "Địa chỉ", dataIndex: "address", key: "address" },
];

// Fetch data on route query changes
const pageNumber = computed(() => Number(route.query.pageNumber) || 1);
const limit = 5;

const fetchAuthor = async () => {
  try {
    await authorStore.getAllAuthors(pageNumber.value-1, limit);
  } catch (error) {
    console.error("Error fetching publishers:", error);
  }
};

onMounted(fetchAuthor);
watch(() => route.query, fetchAuthor, { immediate: true });

// Users data and pagination
const author = computed(() => authorStore.allAuthors);
const array = computed(() => author.value.data || []);
const totalPage = computed(() => author.value.totalPage || 1);

const filteredData = computed(() => {
  if (!query.value) {
    return array.value;
  }
  return array.value.filter((item: any) => {
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(query.value.toLowerCase())
    );
  });
});

// Handle page change
const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPage.value) {
    router.push({ path: 'author', query: { pageNumber: newPage, limit } });
  }
};

const renderCell = (row: any, column: any) => {
  return row[column.dataIndex];
};

const editAuthor = (author: any) => {
  router.push({ name: "author:edit", params: { id: author._id } });
};

const deleteAuthor = async (author: any) => {
  const confirmed = confirm(`Bạn có chắc chắn muốn xóa Tác giả ${author.name}?`);
  if (confirmed) {
    try {
      await authorStore.deleteAuthor(author._id);
      toast.success("Xóa tác giả thành công!", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
   } as ToastOptions)
      await fetchAuthor();
    } catch (error) {
      console.error("Error deleting publisher:", error);
      toast.error("Xóa tác giả thất bại!", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
   } as ToastOptions)
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid black;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
}
</style>
