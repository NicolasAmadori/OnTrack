<template>
  <BaseBanner title="User Management" imageType="station" admin/>

  <div class="container-fluid mt-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8">
        <SearchBar
            v-model="userQuery"
            placeholder="Search for a user"
            id="user-search"
            @search="handleSearch"
        />
      </div>
    </div>

    <div class="row mt-4 justify-content-center">
      <div class="col-12 col-md-8">

        <div v-if="isLoading" class="text-center py-5">
          <span class="spinner-border text-primary" role="status"></span>
        </div>

        <div v-else-if="filteredUsers.length > 0" class="flex flex-col w-full">
          <UserListItem
              v-for="user in filteredUsers"
              :key="user._id"
              :id="user._id"
              :email="user.email"
              :is-admin="user.is_admin"
              @toggle-admin="toggleAdmin(user)"
              @delete="handleDelete(user)"
          />
        </div>

        <div v-else class="text-center py-10 w-full bg-lighter rounded-lg border border-lesslight border-dashed">
          <p class="font-mono text-lessdark mb-0">No users found matching your search.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllUsers, updateUser, deleteUser } from '@/api/users';
import SearchBar from '@/components/SearchBar.vue';
import UserListItem from '@/components/UserListItem.vue';
import BaseBanner from "@/components/BaseBanner.vue";

const userQuery = ref('');
const users = ref([]);
const filteredUsers = ref([]);
const isLoading = ref(false);
const error = ref(null);

/**
 * Load users
 */
const loadUsers = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    users.value = await getAllUsers(localStorage.getItem('authToken'));
    handleSearch();
  } catch (e) {
    console.error("Error during users retrieval:", e);
    error.value = "Unable to retrieve users.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadUsers);

/**
 * Filtering logic
 */
const handleSearch = () => {
  if(!userQuery) {
    filteredUsers.value = users.value;
  } else {
    filteredUsers.value = users.value.filter(user => {
      return user.email ? user.email.toLowerCase().includes(userQuery.value.toLowerCase()) : false;
    });
  }
};

const toggleAdmin = async (user) => {
  await updateUser(localStorage.getItem('authToken'), user._id, {
    first_name: user.first_name,
    last_name: user.last_name,
    is_admin: !user.is_admin
  });
  loadUsers();
};

const handleDelete = async (user) => {
  if(confirm(`Are you sure that your want to delete this user (${user.email})?`)) {
    await deleteUser(localStorage.getItem('authToken'), user._id);
    loadUsers();
  }
};
</script>