<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- Stats Cards -->
    <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Total User</p>
        <p class="mt-2 text-3xl font-bold text-gray-800 dark:text-white">{{ stats.total }}</p>
      </div>
      <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Aktif</p>
        <p class="mt-2 text-3xl font-bold text-green-500">{{ stats.active }}</p>
      </div>
      <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Nonaktif</p>
        <p class="mt-2 text-3xl font-bold text-gray-400 dark:text-gray-500">{{ stats.inactive }}</p>
      </div>
      <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Admin</p>
        <p class="mt-2 text-3xl font-bold text-brand-500">{{ stats.admin }}</p>
      </div>
    </div>

    <!-- Table Card -->
    <div class="rounded-2xl border border-gray-100 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">

      <!-- Header -->
      <div class="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <div>
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">Daftar User</h3>
          <p class="mt-0.5 text-sm text-gray-400">Kelola akun pengguna sistem</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Filter Role -->
          <div class="relative">
            <select
              v-model="filterRole"
              class="h-9 appearance-none rounded-lg border border-gray-200 bg-transparent pl-3 pr-8 text-sm text-gray-600 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:text-gray-400"
            >
              <option value="">Semua Role</option>
              <option value="ADMIN">Admin</option>
              <option value="QC">QC</option>
              <option value="MANAGER">Manager</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <!-- Filter Status -->
          <div class="relative">
            <select
              v-model="filterStatus"
              class="h-9 appearance-none rounded-lg border border-gray-200 bg-transparent pl-3 pr-8 text-sm text-gray-600 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:text-gray-400"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <button
            @click="openAddModal"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 4.167v11.666M4.167 10h11.666" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            Tambah User
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span class="ml-3 text-sm text-gray-400">Memuat data...</span>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredUsers.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Belum ada user</p>
        <p class="mt-1 text-xs text-gray-400">Mulai dengan menambahkan user baru</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Nama / Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Nomor HP</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 text-sm font-semibold dark:bg-brand-900/20 dark:text-brand-400">
                    {{ getInitials(user.name) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-700 dark:text-gray-300">{{ user.name }}</p>
                    <p class="text-xs text-gray-400">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-gray-600 dark:text-gray-400">{{ user.phone || '—' }}</p>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="getRoleBadgeClass(user.role)"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="user.is_active
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="user.is_active ? 'bg-green-500' : 'bg-gray-400'"></span>
                  {{ user.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(user)"
                    class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-yellow-300 hover:text-yellow-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  >
                    Edit
                  </button>
                  <button
                    @click="openDeleteConfirm(user)"
                    class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ─── Toast ─────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toast.show"
          class="fixed bottom-6 right-6 z-[70] flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-xl"
          :class="toast.type === 'success'
            ? 'bg-white border-green-100 dark:bg-gray-900 dark:border-green-900/40'
            : 'bg-white border-red-100 dark:bg-gray-900 dark:border-red-900/40'"
        >
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            :class="toast.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'">
            <svg v-if="toast.type === 'success'" class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-800 dark:text-white">{{ toast.title }}</p>
            <p v-if="toast.body" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ toast.body }}</p>
          </div>
          <button @click="toast.show = false" class="ml-2 shrink-0 text-gray-300 hover:text-gray-500 transition-colors">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── User Modal (Add / Edit) ───────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showUserModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeUserModal"></div>
          <div class="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden">
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-white">
                  {{ isEdit ? 'Edit User' : 'Tambah User' }}
                </h3>
                <p v-if="isEdit" class="mt-0.5 text-xs text-gray-400">{{ selectedUser?.email }}</p>
              </div>
              <button @click="closeUserModal" class="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="space-y-4 px-6 py-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nama <span class="text-red-500">*</span></label>
                <input v-model="userForm.name" type="text" placeholder="Nama lengkap"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email <span class="text-red-500">*</span></label>
                <input v-model="userForm.email" type="email" placeholder="email@domain.com"
                  :disabled="isEdit"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 disabled:opacity-60 disabled:cursor-not-allowed" />
              </div>
              <div v-if="!isEdit">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input
                    v-model="userForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Minimal 8 karakter"
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg v-if="showPassword" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                    <svg v-else width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nomor HP</label>
                <input v-model="userForm.phone" type="text" placeholder="08xxxxxxxx"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Role <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select v-model="userForm.role"
                    class="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 pr-8 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300">
                    <option value="">Pilih role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="QC">QC</option>
                    <option value="MANAGER">Manager</option>
                  </select>
                  <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div v-if="isEdit">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Status</label>
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    @click="userForm.is_active = true"
                    :class="[
                      'flex-1 rounded-lg border py-2 text-sm font-medium transition-colors',
                      userForm.is_active
                        ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-green-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    ]"
                  >
                    Aktif
                  </button>
                  <button
                    type="button"
                    @click="userForm.is_active = false"
                    :class="[
                      'flex-1 rounded-lg border py-2 text-sm font-medium transition-colors',
                      !userForm.is_active
                        ? 'border-gray-400 bg-gray-100 text-gray-700 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    ]"
                  >
                    Nonaktif
                  </button>
                </div>
              </div>
              <div v-if="modalError" class="rounded-lg bg-red-50 px-4 py-3 dark:bg-red-900/20">
                <p class="text-sm text-red-600 dark:text-red-400">⚠️ {{ modalError }}</p>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button @click="closeUserModal"
                class="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                Batal
              </button>
              <button @click="handleSaveUser" :disabled="isSaving"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60 transition-colors">
                <svg v-if="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Delete Confirm Modal ──────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteModal = false"></div>
          <div class="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl dark:bg-gray-900 p-6 text-center">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-gray-800 dark:text-white">Hapus User</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Yakin ingin menghapus <span class="font-medium">{{ selectedUser?.name }}</span>? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div class="mt-5 flex gap-3">
              <button @click="showDeleteModal = false"
                class="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                Batal
              </button>
              <button @click="handleDeleteUser" :disabled="isDeleting"
                class="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60 transition-colors">
                <svg v-if="isDeleting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { getUsers, updateUser, deleteUser } from '@/services/userService'
import { registerUser } from '@/services/authService'
import type { UserRole } from '@/services/authService'

interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string | null
  is_active: boolean
}

interface UserFormData {
  name: string
  email: string
  password: string
  phone: string
  role: UserRole | ''
  is_active: boolean
}

const currentPageTitle = ref('Manajemen User')
const isLoading = ref(false)
const users = ref<AppUser[]>([])
const filterStatus = ref('')
const filterRole = ref('')
const showPassword = ref(false)

const stats = computed(() => ({
  total: users.value.length,
  active: users.value.filter(u => u.is_active).length,
  inactive: users.value.filter(u => !u.is_active).length,
  admin: users.value.filter(u => u.role === 'ADMIN').length,
}))

const filteredUsers = computed(() => {
  let result = users.value
  if (filterStatus.value === 'active') result = result.filter(u => u.is_active)
  else if (filterStatus.value === 'inactive') result = result.filter(u => !u.is_active)
  if (filterRole.value) result = result.filter(u => u.role === filterRole.value)
  return result
})

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

const getRoleBadgeClass = (role: UserRole) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'QC':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'MANAGER':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  }
}

// ─── Toast ────────────────────────────────────────────────
const toast = reactive({ show: false, type: 'success' as 'success' | 'error', title: '', body: '' })
let toastTimer: ReturnType<typeof setTimeout> | null = null
const showToast = (type: 'success' | 'error', title: string, body = '') => {
  if (toastTimer) clearTimeout(toastTimer)
  Object.assign(toast, { show: true, type, title, body })
  toastTimer = setTimeout(() => { toast.show = false }, 4000)
}
onUnmounted(() => { if (toastTimer) clearTimeout(toastTimer) })

// ─── User Modal ───────────────────────────────────────────
const showUserModal = ref(false)
const isEdit = ref(false)
const isSaving = ref(false)
const modalError = ref('')
const selectedUser = ref<AppUser | null>(null)
const userForm = reactive<UserFormData>({
  name: '', email: '', password: '', phone: '', role: '', is_active: true,
})

const openAddModal = () => {
  isEdit.value = false
  selectedUser.value = null
  showPassword.value = false
  Object.assign(userForm, { name: '', email: '', password: '', phone: '', role: '', is_active: true })
  modalError.value = ''
  showUserModal.value = true
}

const openEditModal = (user: AppUser) => {
  isEdit.value = true
  selectedUser.value = user
  showPassword.value = false
  Object.assign(userForm, {
    name: user.name,
    email: user.email,
    password: '',
    phone: user.phone ?? '',
    role: user.role,
    is_active: user.is_active,
  })
  modalError.value = ''
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  modalError.value = ''
}

const handleSaveUser = async () => {
  if (!userForm.name.trim()) { modalError.value = 'Nama wajib diisi.'; return }
  if (!userForm.email.trim()) { modalError.value = 'Email wajib diisi.'; return }
  if (!isEdit.value && !userForm.password.trim()) { modalError.value = 'Password wajib diisi.'; return }
  if (!isEdit.value && userForm.password.trim().length < 8) { modalError.value = 'Password minimal 8 karakter.'; return }
  if (!userForm.role) { modalError.value = 'Role wajib dipilih.'; return }

  isSaving.value = true
  modalError.value = ''
  try {
    if (isEdit.value && selectedUser.value) {
      // Edit: update name, phone, role, is_active
      const payload: Record<string, unknown> = {
        name: userForm.name,
        phone: userForm.phone || null,
        role: userForm.role,
        is_active: userForm.is_active,
      }
      await updateUser(selectedUser.value.id, payload)
      showToast('success', 'User berhasil diperbarui', userForm.name)
    } else {
      // Create: gunakan /api/auth/register (tanpa overwrite session admin)
      await registerUser({
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        phone: userForm.phone || undefined,
        role: userForm.role as UserRole,
      })
      showToast('success', 'User berhasil ditambahkan', userForm.name)
    }
    closeUserModal()
    await loadUsers()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    modalError.value = e.response?.data?.message || e.message || 'Gagal menyimpan data.'
  } finally {
    isSaving.value = false
  }
}

// ─── Delete ───────────────────────────────────────────────
const showDeleteModal = ref(false)
const isDeleting = ref(false)

const openDeleteConfirm = (user: AppUser) => {
  selectedUser.value = user
  showDeleteModal.value = true
}

const handleDeleteUser = async () => {
  if (!selectedUser.value) return
  isDeleting.value = true
  try {
    await deleteUser(selectedUser.value.id)
    showToast('success', 'User berhasil dihapus', selectedUser.value.name)
    showDeleteModal.value = false
    selectedUser.value = null
    await loadUsers()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    showToast('error', 'Gagal menghapus', e.response?.data?.message || e.message || '')
  } finally {
    isDeleting.value = false
  }
}

// ─── Data ─────────────────────────────────────────────────
const loadUsers = async () => {
  isLoading.value = true
  try {
    const res = await getUsers()
    // handle both { data: [...] } and direct array responses
    users.value = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
  } catch (err) {
    console.error(err)
    showToast('error', 'Gagal memuat data user')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadUsers)
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateY(16px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
