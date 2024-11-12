<template>
  <div class="p-4 mt-10">
    <div class="mb-2 text-lg font-semibold">Trang chủ</div>
    <h5 class="mb-3 text-xl font-bold">Quản lí muợn sách</h5>
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
      <!-- <router-link :to="{ name: 'book:create' }" class="no-underline">
        <div class="bg-blue-500 p-2 text-white rounded-lg text-center no-underline">
          <font-awesome-icon :icon="faUserPlus" />
          Tạo sách
        </div>
      </router-link> -->
    </div>
    <div>
      <template v-if="!filteredData.length">
        <div>Không có người mượn nào</div>
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
              <!-- <th class="bg-gray-200 p-2 text-gray-600 font-bold block md:table-cell">
                Hành động
              </th> -->
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
              <!-- <td class="p-2 text-gray-800 block md:table-cell">
                <button @click="editBook(row)" class="mr-2 text-blue-500">Sửa</button>
                <button @click="deleteBook(row)" class="text-red-500">Xóa</button>
              </td> -->
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useBorrowStore } from "../../stores/borrow";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const router = useRouter();
const borrowStore = useBorrowStore();
const query = ref("");

const columns = [
  { title: "Tên username", dataIndex: "user.username", key: "user._id" },
  { title: "Tên sách", dataIndex: "book.name", key: "book" },
  { title: "Ngày mượn", dataIndex: "borrowedDay", key: "borrowedDay" },
  { title: "Hạn trả", dataIndex: "estimatedReturnDate", key: "estimatedReturnDate" },
  { title: "Ngày đã trả", dataIndex: "actualReturnDate", key: "actualReturnDate" },
];

const fetchBorrow = async () => {
  try {
    await borrowStore.getAllBorrows();
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

onMounted(fetchBorrow);

const filteredData = computed(() => {
  if (!query.value) {
    return borrowStore.allBorrow;
  }
  const searchQuery = query.value.toLowerCase();
  return borrowStore.allBorrow.filter((item: any) => {
    // Access the nested properties safely
    const bookName = item.book?.name?.toLowerCase() || "";
    const username = item.user?.username?.toLowerCase() || "";

    // Check if either the book name or the username matches the search query
    return bookName.includes(searchQuery) || username.includes(searchQuery);
  });
});

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const renderCell = (row: any, column: any) => {
  const keys = column.dataIndex.split(".");
  let value = row;
  try {
    keys.forEach((key: any) => {
      value = value[key];
    });
    if (["borrowedDay", "estimatedReturnDate", "actualReturnDate"].includes(column.key)) {
      return formatDate(value);
    }
  } catch (error) {
    console.error("Error accessing value for column:", column, "row:", row);
    value = ""; // Hoặc giá trị mặc định nào đó nếu cần thiết
  }
  return value !== undefined && value !== null ? value : "";
};

// const editBook = (book: any) => {
//   router.push({ name: "book:edit", params: { id: book._id } });
// };

// const deleteBook = async (book: any) => {
//   const confirmed = confirm(`Bạn có chắc chắn muốn xóa sách ${book.name}?`);
//   if (confirmed) {
//     try {
//       await borrowStore.deleteBook(book._id);
//       alert("Xóa sách thành công");
//       await fetchBorrow();
//     } catch (error) {
//       console.error("Error deleting book:", error);
//       alert("Xóa sách thất bại");
//     }
//   }
// };
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
