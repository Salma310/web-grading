<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- Stats Cards -->
    <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Total Petani</p>
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
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Total Lahan</p>
        <p class="mt-2 text-3xl font-bold text-brand-500">{{ stats.totalLands }}</p>
      </div>
    </div>

    <!-- Table Card -->
    <div class="rounded-2xl border border-gray-100 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">

      <!-- Header -->
      <div class="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <div>
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">Daftar Petani</h3>
          <p class="mt-0.5 text-sm text-gray-400">Data petani yang terdaftar di sistem</p>
        </div>
        <div class="flex items-center gap-3">
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
            Tambah Petani
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
      <div v-else-if="filteredFarmers.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Belum ada petani</p>
        <p class="mt-1 text-xs text-gray-400">Mulai dengan menambahkan petani baru</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Kode / Nama</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Kontak</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Wilayah</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Lahan</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
            <tr
              v-for="farmer in filteredFarmers"
              :key="farmer.id"
              class="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4">
                <p class="font-medium text-gray-700 dark:text-gray-300">{{ farmer.name }}</p>
                <span class="font-mono text-xs text-gray-400">{{ farmer.farmer_code }}</span>
              </td>
              <td class="px-6 py-4">
                <p class="text-gray-600 dark:text-gray-400">{{ farmer.phone || '—' }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-gray-600 dark:text-gray-400">{{ farmer.city || '—' }}</p>
                <p v-if="farmer.district" class="text-xs text-gray-400">{{ farmer.district }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  {{ farmer.lands?.length || 0 }} lahan
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="farmer.is_active
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="farmer.is_active ? 'bg-green-500' : 'bg-gray-400'"></span>
                  {{ farmer.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    :to="`/farmer/${farmer.id}`"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  >
                    Detail
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </router-link>
                  <button
                    @click="openEditModal(farmer)"
                    class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-yellow-300 hover:text-yellow-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  >
                    Edit
                  </button>
                  <button
                    @click="openDeleteConfirm(farmer)"
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

    <!-- ─── Farmer Modal (Add / Edit) ─────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showFarmerModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeFarmerModal"></div>
          <div class="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden">
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-white">
                  {{ isEdit ? 'Edit Petani' : 'Tambah Petani' }}
                </h3>
                <p v-if="isEdit" class="mt-0.5 text-xs text-gray-400 font-mono">{{ selectedFarmer?.farmer_code }}</p>
              </div>
              <button @click="closeFarmerModal" class="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="space-y-4 px-6 py-5 max-h-[70vh] overflow-y-auto">
              <div v-if="!isEdit">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Kode Petani <span class="text-red-500">*</span></label>
                <input v-model="farmerForm.farmer_code" type="text" placeholder="e.g. PTN-001"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nama <span class="text-red-500">*</span></label>
                <input v-model="farmerForm.name" type="text" placeholder="Nama petani"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nomor HP</label>
                <input v-model="farmerForm.phone" type="text" placeholder="08xxxxxxxx"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Alamat</label>
                <textarea v-model="farmerForm.address" rows="2" placeholder="Alamat lengkap"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 resize-none" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Desa</label>
                  <input v-model="farmerForm.village" type="text" placeholder="Nama desa"
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Kecamatan</label>
                  <input v-model="farmerForm.district" type="text" placeholder="Nama kecamatan"
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Kota/Kabupaten</label>
                <input v-model="farmerForm.city" type="text" placeholder="Nama kota"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
              </div>
              <div v-if="modalError" class="rounded-lg bg-red-50 px-4 py-3 dark:bg-red-900/20">
                <p class="text-sm text-red-600 dark:text-red-400">⚠️ {{ modalError }}</p>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button @click="closeFarmerModal"
                class="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                Batal
              </button>
              <button @click="handleSaveFarmer" :disabled="isSaving"
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
            <h3 class="text-base font-semibold text-gray-800 dark:text-white">Hapus Petani</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Yakin ingin menghapus <span class="font-medium">{{ selectedFarmer?.name }}</span>? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div class="mt-5 flex gap-3">
              <button @click="showDeleteModal = false"
                class="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                Batal
              </button>
              <button @click="handleDeleteFarmer" :disabled="isDeleting"
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

import type { Farmer, CreateFarmerPayload, UpdateFarmerPayload } from '@/types/farmertypes'
import { getFarmers, createFarmer, updateFarmer, deleteFarmer } from '@/services/farmerService'

const currentPageTitle = ref('Data Petani')
const isLoading = ref(false)
const farmers = ref<Farmer[]>([])
const filterStatus = ref('')

const stats = computed(() => ({
  total: farmers.value.length,
  active: farmers.value.filter(f => f.is_active).length,
  inactive: farmers.value.filter(f => !f.is_active).length,
  totalLands: farmers.value.reduce((sum, f) => sum + (f.lands?.length || 0), 0),
}))

const filteredFarmers = computed(() => {
  if (filterStatus.value === 'active') return farmers.value.filter(f => f.is_active)
  if (filterStatus.value === 'inactive') return farmers.value.filter(f => !f.is_active)
  return farmers.value
})

// ─── Toast ────────────────────────────────────────────────
const toast = reactive({ show: false, type: 'success' as 'success' | 'error', title: '', body: '' })
let toastTimer: ReturnType<typeof setTimeout> | null = null
const showToast = (type: 'success' | 'error', title: string, body = '') => {
  if (toastTimer) clearTimeout(toastTimer)
  Object.assign(toast, { show: true, type, title, body })
  toastTimer = setTimeout(() => { toast.show = false }, 4000)
}
onUnmounted(() => { if (toastTimer) clearTimeout(toastTimer) })

// ─── Farmer Modal ─────────────────────────────────────────
const showFarmerModal = ref(false)
const isEdit = ref(false)
const isSaving = ref(false)
const modalError = ref('')
const selectedFarmer = ref<Farmer | null>(null)
const farmerForm = reactive<CreateFarmerPayload>({
  farmer_code: '', name: '', phone: '', address: '', village: '', district: '', city: '',
})

const openAddModal = () => {
  isEdit.value = false
  selectedFarmer.value = null
  Object.assign(farmerForm, { farmer_code: '', name: '', phone: '', address: '', village: '', district: '', city: '' })
  modalError.value = ''
  showFarmerModal.value = true
}

const openEditModal = (farmer: Farmer) => {
  isEdit.value = true
  selectedFarmer.value = farmer
  Object.assign(farmerForm, {
    farmer_code: farmer.farmer_code, name: farmer.name,
    phone: farmer.phone ?? '', address: farmer.address ?? '',
    village: farmer.village ?? '', district: farmer.district ?? '', city: farmer.city ?? '',
  })
  modalError.value = ''
  showFarmerModal.value = true
}

const closeFarmerModal = () => { showFarmerModal.value = false; modalError.value = '' }

const handleSaveFarmer = async () => {
  if (!farmerForm.name.trim()) { modalError.value = 'Nama wajib diisi.'; return }
  if (!isEdit.value && !farmerForm.farmer_code.trim()) { modalError.value = 'Kode petani wajib diisi.'; return }
  isSaving.value = true; modalError.value = ''
  try {
    if (isEdit.value && selectedFarmer.value) {
      const payload: UpdateFarmerPayload = {
        name: farmerForm.name, phone: farmerForm.phone, address: farmerForm.address,
        village: farmerForm.village, district: farmerForm.district, city: farmerForm.city,
      }
      await updateFarmer(selectedFarmer.value.id, payload)
      showToast('success', 'Petani berhasil diperbarui', farmerForm.name)
    } else {
      await createFarmer({ ...farmerForm })
      showToast('success', 'Petani berhasil ditambahkan', farmerForm.name)
    }
    closeFarmerModal()
    await loadFarmers()
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

const openDeleteConfirm = (farmer: Farmer) => { selectedFarmer.value = farmer; showDeleteModal.value = true }

const handleDeleteFarmer = async () => {
  if (!selectedFarmer.value) return
  isDeleting.value = true
  try {
    await deleteFarmer(selectedFarmer.value.id)
    showToast('success', 'Petani berhasil dihapus', selectedFarmer.value.name)
    showDeleteModal.value = false
    selectedFarmer.value = null
    await loadFarmers()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    showToast('error', 'Gagal menghapus', e.response?.data?.message || e.message || '')
  } finally {
    isDeleting.value = false
  }
}

// ─── Data ─────────────────────────────────────────────────
const loadFarmers = async () => {
  isLoading.value = true
  try { const res = await getFarmers(); farmers.value = res.data }
  catch (err) { console.error(err) }
  finally { isLoading.value = false }
}

onMounted(loadFarmers)
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateY(16px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>