<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span
        class="mr-3 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
      >
        <UserCircleIcon class="h-6 w-6" />
      </span>

      <span class="mr-1 flex flex-col items-start max-w-[140px] truncate">
        <span class="block font-medium text-theme-sm">
          {{ displayName }}
        </span>
        <span class="block text-theme-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {{ displayRole }}
        </span>
      </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ displayName }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ displayEmail }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <!-- SVG icon would go here -->
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <button
        type="button"
        @click="signOut"
        :disabled="isSigningOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        {{ isSigningOut ? 'Signing out...' : 'Sign out' }}
      </button>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon, ChevronDownIcon, LogoutIcon } from '@/icons'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStoredUser, logout } from '@/services/authService'

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const isSigningOut = ref(false)
const router = useRouter()
const user = ref(getStoredUser())

const menuItems = [{ href: '/profile', icon: UserCircleIcon, text: 'Edit Profil' }]

const displayName = computed(() => user.value?.name || 'User')
const displayEmail = computed(() => user.value?.email || '-')
const displayRole = computed(() => user.value?.role || '-')

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = async () => {
  if (isSigningOut.value) return

  isSigningOut.value = true
  await logout()
  closeDropdown()
  router.push('/signin')
}

const refreshStoredUser = () => {
  user.value = getStoredUser()
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target

  if (target instanceof Node && dropdownRef.value && !dropdownRef.value.contains(target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('auth-user-updated', refreshStoredUser)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('auth-user-updated', refreshStoredUser)
})
</script>
