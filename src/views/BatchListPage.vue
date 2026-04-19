<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- Stats Cards -->
    <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Total Batch</p>
        <p class="mt-2 text-3xl font-bold text-gray-800 dark:text-white">{{ stats.total }}</p>
      </div>
      <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Sedang Berjalan</p>
        <p class="mt-2 text-3xl font-bold text-green-500">{{ stats.open }}</p>
      </div>
      <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Selesai</p>
        <p class="mt-2 text-3xl font-bold text-gray-500 dark:text-gray-400">{{ stats.closed }}</p>
      </div>
      <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Total Buah</p>
        <p class="mt-2 text-3xl font-bold text-brand-500">{{ stats.totalFruits }}</p>
      </div>
    </div>

    <!-- Table Card -->
    <div class="rounded-2xl border border-gray-100 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">

      <!-- Header -->
      <div class="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <div>
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">Daftar Batch</h3>
          <p class="mt-0.5 text-sm text-gray-400">Semua sesi panen yang tercatat</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Filter Status -->
          <div class="relative">
            <select
              v-model="filterStatus"
              class="h-9 appearance-none rounded-lg border border-gray-200 bg-transparent pl-3 pr-8 text-sm text-gray-600 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:text-gray-400"
            >
              <option value="">Semua Status</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
            <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <!-- Add Button -->
          <router-link
            to="/batches/add"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 4.167v11.666M4.167 10h11.666" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            Tambah Batch
          </router-link>
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
      <div v-else-if="filteredBatches.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Belum ada batch</p>
        <p class="mt-1 text-xs text-gray-400">Mulai dengan menambahkan batch panen baru</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Kode Batch</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Petani / Lahan</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Tanggal Panen</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Buah</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Grade</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
            <tr
              v-for="batch in filteredBatches"
              :key="batch.id"
              class="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <!-- Kode Batch -->
              <td class="px-6 py-4">
                <span class="font-mono text-xs font-medium text-gray-700 dark:text-gray-300">{{ batch.lot_code }}</span>
                <p class="mt-0.5 text-xs text-gray-400">{{ batch.fruit_type }}</p>
              </td>

              <!-- Petani / Lahan -->
              <td class="px-6 py-4">
                <p class="font-medium text-gray-700 dark:text-gray-300">{{ batch.farmer?.name }}</p>
                <p class="text-xs text-gray-400">{{ batch.land?.land_name }} · {{ batch.land?.location }}</p>
              </td>

              <!-- Tanggal -->
              <td class="px-6 py-4 text-gray-600 dark:text-gray-400">
                {{ formatDate(batch.harvest_date) }}
                <p class="text-xs text-gray-400">{{ formatTime(batch.harvest_time) }}</p>
              </td>

              <!-- Total Buah -->
              <td class="px-6 py-4">
                <span class="text-lg font-bold text-gray-700 dark:text-gray-300">{{ batch.total_fruits }}</span>
                <span class="ml-1 text-xs text-gray-400">buah</span>
              </td>

              <!-- Grade mini bar -->
              <td class="px-6 py-4">
                <div v-if="batch.total_fruits > 0" class="flex items-center gap-1.5">
                  <span class="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    A: {{ batch.total_grade_a }}
                  </span>
                  <span class="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    B: {{ batch.total_grade_b }}
                  </span>
                  <span class="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    C: {{ batch.total_grade_c }}
                  </span>
                  <span v-if="batch.total_reject > 0" class="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    R: {{ batch.total_reject }}
                  </span>
                </div>
                <span v-else class="text-xs text-gray-400">—</span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="batch.status === 'OPEN'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="batch.status === 'OPEN' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"
                  ></span>
                  {{ batch.status === 'OPEN' ? 'Open' : 'Closed' }}
                </span>
              </td>

              <!-- Aksi -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    :to="`/batches/${batch.id}`"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  >
                    Detail
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </router-link>
                  <button
                    v-if="batch.status === 'OPEN'"
                    @click="handleCloseBatch(batch)"
                    class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  >
                    Tutup
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { getBatches, closeBatch } from '@/services/batchService'

const currentPageTitle = ref('Batch Panen')
const isLoading = ref(false)
const batches = ref([])
const filterStatus = ref('')

// ─── Stats ────────────────────────────────────────────────
const stats = computed(() => ({
  total: batches.value.length,
  open: batches.value.filter(b => b.status === 'OPEN').length,
  closed: batches.value.filter(b => b.status === 'CLOSED').length,
  totalFruits: batches.value.reduce((sum, b) => sum + (b.total_fruits || 0), 0),
}))

const filteredBatches = computed(() =>
  filterStatus.value
    ? batches.value.filter(b => b.status === filterStatus.value)
    : batches.value
)

// ─── Format helpers ───────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

// ─── Methods ──────────────────────────────────────────────
const loadBatches = async () => {
  isLoading.value = true
  try {
    const res = await getBatches()
    batches.value = res.data
  } catch (err) {
    console.error('Gagal memuat batch:', err)
  } finally {
    isLoading.value = false
  }
}

const handleCloseBatch = async (batch) => {
  if (!confirm(`Tutup batch ${batch.lot_code}? Grading tidak bisa ditambahkan setelah ditutup.`)) return
  try {
    await closeBatch(batch.id)
    await loadBatches()
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menutup batch.')
  }
}

onMounted(loadBatches)
</script>