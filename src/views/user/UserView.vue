<template>
  <div class="p-4 mt-10">
    <div class="mb-2 text-lg font-semibold">Trang chủ</div>
    <h5 class="mb-3 text-xl font-bold">Quản lí người dùng</h5>
    <div class="flex justify-between mb-4">
      <div class="flex">
        <input
          placeholder="Nhập thông tin cần tìm"
          :value="query"
          @input="updateQuery"
          class="outline-none w-60 p-2 border-2 border-gray-500 rounded-l-lg"
        />
        <span class="p-2 bg-blue-500 text-white rounded-r-lg">
          <font-awesome-icon :icon="faSearch" />
        </span>
      </div>
      <router-link :to="{ name: 'authUser:create' }" class="no-underline">
        <div class="bg-blue-500 p-2 text-white rounded-lg text-center no-underline">
          <font-awesome-icon :icon="faUserPlus" />
          Tạo người dùng mới
        </div>
      </router-link>
    </div>

    <div v-if="array.length === 0">Không có người dùng nào</div>
    <table v-else class="min-w-full border-collapse block md:table">
      <thead class="block md:table-header-group">
        <tr class="bg-gray-200 p-2 text-gray-600 font-bold block md:table-row">
          <th v-for="column in columns" :key="column.key" class="p-2">{{ column.title }}</th>
          <th class="p-2">Hành động</th>
        </tr>
      </thead>
      <tbody class="block md:table-row-group">
        <tr v-for="row in filteredData" :key="row._id" class="bg-gray-100 p-2">
          <td v-for="column in columns" :key="column.key">{{ renderCell(row, column) }}</td>
          <td>
            <button @click="editUser(row)" class="mr-2 text-blue-500">Sửa</button>
            <button @click="deleteUser(row)" class="text-red-500">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { toast, type ToastOptions } from 'vue3-toastify';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const query = ref("");
const columns = [
  { title: "Họ", dataIndex: "last_name", key: "last_name" },
  { title: "Tên", dataIndex: "first_name", key: "first_name" },
  { title: "Số điện thoại", key: "phoneNumber", dataIndex: "phoneNumber" },
  { title: "Địa chỉ", dataIndex: "address", key: "address" },
  { title: "Giới tính", dataIndex: "gender", key: "gender" },
  { title: "Loại tài khoản", dataIndex: "isStaff", key: "isStaff" },
];

// Fetch data on route query changes
const pageNumber = computed(() => Number(route.query.pageNumber) || 1);
const limit = 5;

const fetchUser = async () => {
  try {
    await authStore.getAllUser(pageNumber.value-1, limit); // Assuming `getAllUser` accepts page and limit (pageNumber.value, limit)
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

onMounted(fetchUser);
watch(() => route.query, fetchUser, { immediate: true });

// Users data and pagination
const users = computed(() => authStore.allUser);
const array = computed(() => users.value.data || []);
const totalPage = computed(() => users.value.totalPage || 1);

// Filter data based on search query
const filteredData = computed(() => {
  if (!query.value) return array.value;
  return array.value.filter((item: any) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(query.value.toLowerCase())
    )
  );
});

// Handle page change
const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPage.value) {
    router.push({ path: 'users', query: { pageNumber: newPage, limit } });
  }
};

// Handle edit and delete
const editUser = (user: any) => {
  router.push({ name: "authUser:edit", params: { id: user._id } });
};

const deleteUser = async (user: any) => {
  const confirmed = confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.first_name} ${user.last_name}?`);
  if (confirmed) {
    try {
      await authStore.deleteUser(user._id);
      toast.success("Xóa người dùng thành công!", { autoClose: 2000, position: toast.POSITION.BOTTOM_RIGHT });
      fetchUser();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Xóa người dùng thất bại!", { autoClose: 2000, position: toast.POSITION.BOTTOM_RIGHT });
    }
  }
};

const updateQuery = (event: any) => {
  query.value = event.target.value;
};

const renderCell = (row: any, column: any) => {
  if (column.dataIndex === "isStaff") return row.isStaff ? "Admin" : "Khách";
  if (column.dataIndex === "gender") return row.gender === "1" ? "Nam" : "Nữ";
  return row[column.dataIndex];
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
