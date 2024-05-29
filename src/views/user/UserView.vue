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
    <div>
      <template v-if="array.length == 0">
        <div>Không có người dùng nào</div>
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
              :key="row.key"
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
                <button @click="editUser(row)" class="mr-2 text-blue-500">Sửa</button>
                <button @click="deleteUser(row)" class="text-red-500">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
import { ref, computed, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../stores/auth";
import { toast, type ToastOptions } from 'vue3-toastify';
const authStore = useAuthStore();
const users = computed(() => {
  return authStore.userDetail;
});

// async function getAllUser() {
//   await authStore.getAllUser();
// }
// onMounted(async () => {
//   await getAllUser();
// });

const fetchUser = async () => {
  try {
    await authStore.getAllUser();
  } catch (error) {
    console.error("Error fetching publishers:", error);
  }
};

onMounted(fetchUser);
const array = users.value;

const query = ref("");
const columns = [
  {
    title: "Họ",
    dataIndex: "last_name",
    key: "last_name",
    width: 150,
  },
  {
    title: "Tên",
    dataIndex: "first_name",
    key: "first_name",
    width: 150,
  },
  {
    title: "Số điện thoại",
    key: "phoneNumber",
    dataIndex: "phoneNumber",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Loại tài khoản",
    dataIndex: "isStaff",
    key: "isStaff",
  },
];

const updateQuery = (event: any) => {
  query.value = event.target.value;
};

const filteredData = computed(() => {
  if (!query.value) {
    return array;
  }
  return array.filter((item: any) => {
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(query.value.toLowerCase())
    );
  });
});
// const filteredData = computed(() => {
//   if (!query.value) {
//     return authStore.allUser;
//   }
//   return authStore.allUser.filter((item: any) => {
//     return Object.values(item).some((value) =>
//       String(value).toLowerCase().includes(query.value.toLowerCase())
//     );
//   });
// });

const renderCell = (row: any, column: any) => {
  if (column.dataIndex === "isStaff") {
    return row.isStaff ? "Admin" : "Khách";
  }
  if (column.dataIndex === "gender") {
    if (row.gender === "1") {
      return (row.gender = "Nam");
    }
    if (row.gender === "2") {
      return (row.gender = "Nữ");
    }
  }
  return row[column.dataIndex];
};
const editUser = (user: any) => {
  console.log(user._id);
  router.push({ name: "authUser:edit", params: { id: user._id } });
};

// const deleteUser = (user: any) => {
//   if (
//     confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.first_name} ${user.last_name}?`)
//   ) {
//     authStore.deleteUser(user._id).then(() => {
//       router.replace({ name: "users" });
//       getAllUser();
//     });
//   }
// };
const deleteUser = async (user: any) => {
  const confirmed = confirm(
    `Bạn có chắc chắn muốn xóa người dùng ${user.first_name} ${user.last_name}?`
  );
  if (confirmed) {
    try {
      await authStore.deleteUser(user._id);
      toast.success("Xóa người dùng thành công!", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
   } as ToastOptions)
      // await authStore.getAllUser(); // Cập nhật lại danh sách người dùng sau khi xóa
      await fetchUser();
      // router.replace({ name: "users" }); // Điều hướng đến trang danh sách người dùng
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Xóa người dùng thành công!", {
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
