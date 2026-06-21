<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- ─── Bundle Modal (muncul setelah batch di-close) ──── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="bundleModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="bundleModal.show = false"></div>
          <div class="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden">

            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-white">Batch Ditutup</h3>
                <p class="mt-0.5 text-xs text-gray-400">Keranjang per grade berhasil dibuat</p>
              </div>
              <button @click="bundleModal.show = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <div class="space-y-3 px-6 py-5">
              <div v-for="bundle in bundleModal.bundles" :key="bundle.id"
                class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                <div class="flex items-center gap-3">
                  <span class="inline-flex items-center justify-center h-9 w-9 rounded-full text-sm font-bold"
                    :class="gradeBadgeClass(bundle.grade)">
                    {{ bundle.grade }}
                  </span>
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ bundle.total_fruits }} buah
                      <span v-if="bundle.total_weight" class="text-gray-400 font-normal">
                        · {{ bundle.total_weight.toFixed(1) }} kg
                      </span>
                    </p>
                    <p class="text-xs text-gray-400 font-mono">{{ bundle.qr_token }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <!-- Preview QR -->
                  <button @click="previewQR(bundle.qr_token)"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M3 4h5v5H3V4zM3 11h5v5H3v-5zM11 4h5v5h-5V4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                      <path d="M11 11h2v2h-2v-2zM13 13h2v2h-2v-2zM11 15h2v2h-2v-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
                    Lihat QR
                  </button>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <p class="text-xs text-gray-400 text-center">Scan QR atau buka link untuk mencetak sticker</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── QR Preview Modal ───────────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="qrPreview.show" class="fixed inset-0 z-[60] flex items-center justify-center p-4"
          @click="qrPreview.show = false">
          <div class="absolute inset-0 bg-black/70"></div>
          <div class="relative rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 text-center" @click.stop>
            <p class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">QR Code · Grade {{ qrPreview.grade }}</p>
            <div v-if="qrPreview.loading" class="flex h-48 w-48 items-center justify-center mx-auto">
              <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <img v-else :src="qrPreview.imageUrl"
              class="h-48 w-48 mx-auto rounded-xl object-contain border border-gray-200 dark:border-gray-700"/>
            <a v-if="qrPreview.imageUrl" :href="qrPreview.imageUrl" download
              class="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M10 3v10M5 13l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Download PNG
            </a>
            <button @click="qrPreview.show = false"
              class="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              Tutup
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="space-y-5 sm:space-y-6">

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
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

        <div class="flex flex-col gap-4 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-gray-800 dark:text-white">Daftar Batch</h3>
              <p class="mt-0.5 text-sm text-gray-400">Semua sesi panen yang tercatat</p>
            </div>
            <div class="flex items-center gap-3">
              <router-link to="/batches/add"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4.167v11.666M4.167 10h11.666" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
                Tambah Batch
              </router-link>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <!-- Search -->
              <div class="relative w-full sm:w-64">
                <input v-model="searchQuery" type="text" placeholder="Cari kode, petani, lahan..."
                  class="w-full h-9 rounded-lg border border-gray-200 bg-transparent pl-9 pr-3 text-sm text-gray-600 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:text-gray-400">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
              <!-- Date Filter -->
              <div class="relative">
                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6 2V4M14 2V4M3 8H17M5 5H15C16.1046 5 17 5.89543 17 7V15C17 16.1046 16.1046 17 15 17H5C3.89543 17 3 16.1046 3 15V7C3 5.89543 3.89543 5 5 5Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>

                <FlatPickr
                  v-model="filterDate"
                  :config="{
                    dateFormat: 'Y-m-d',
                    allowInput: true
                  }"
                  placeholder="Semua Tanggal"
                  class="h-9 min-w-[170px] rounded-lg border border-gray-200 bg-transparent pl-9 pr-3 text-sm text-gray-600 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:text-gray-400"
                />
              </div>

              <!-- Status Filter -->
              <div class="relative">
                <select v-model="filterStatus"
                  class="h-9 appearance-none rounded-lg border border-gray-200 bg-transparent pl-3 pr-8 text-sm text-gray-600 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:text-gray-400">
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
            </div>
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
              <tr v-for="batch in paginatedBatches" :key="batch.id"
                class="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">

                <td class="px-6 py-4">
                  <span class="font-mono text-xs font-medium text-gray-700 dark:text-gray-300">{{ batch.lot_code }}</span>
                  <p class="mt-0.5 text-xs text-gray-400">{{ batch.fruit_type }}</p>
                </td>

                <td class="px-6 py-4">
                  <p class="font-medium text-gray-700 dark:text-gray-300">{{ batch.farmer?.name }}</p>
                  <p class="text-xs text-gray-400">{{ batch.land?.land_name }} · {{ batch.land?.location }}</p>
                </td>

                <td class="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {{ formatDate(batch.harvest_date) }}
                </td>

                <td class="px-6 py-4">
                  <span class="text-lg font-bold text-gray-700 dark:text-gray-300">{{ batch.total_fruits }}</span>
                  <span class="ml-1 text-xs text-gray-400">buah</span>
                </td>

                <td class="px-6 py-4">
                  <div v-if="batch.total_fruits > 0" class="flex items-center gap-1.5 flex-wrap">
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

                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="batch.status === 'OPEN'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'">
                    <span class="h-1.5 w-1.5 rounded-full"
                      :class="batch.status === 'OPEN' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"></span>
                    {{ batch.status === 'OPEN' ? 'Open' : 'Closed' }}
                  </span>
                </td>

                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <router-link :to="`/batches/${batch.id}`"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      Detail
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </router-link>

                    <!-- Tombol Tutup — hanya kalau OPEN -->
                    <button v-if="batch.status === 'OPEN'"
                      @click="handleCloseBatch(batch)"
                      :disabled="closingId === batch.id"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <svg v-if="closingId === batch.id" class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Tutup
                    </button>

                    <!-- Tombol Lihat Bundle — kalau sudah CLOSED -->
                    <button v-else
                      @click="loadAndShowBundles(batch.id)"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path d="M3 4h5v5H3V4zM3 11h5v5H3v-5zM11 4h5v5h-5V4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                        <path d="M11 11h2v2h-2v-2zM13 13h2v2h-2v-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                      </svg>
                      Lihat QR
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">Tampilkan</span>
            <div class="relative">
              <select v-model="itemsPerPage"
                class="h-8 appearance-none rounded border border-gray-200 bg-transparent pl-2 pr-6 text-sm text-gray-600 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:text-gray-400">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <span class="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                  <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">data</span>
          </div>
          
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Halaman <span class="font-medium text-gray-700 dark:text-gray-300">{{ currentPage }}</span> dari <span class="font-medium text-gray-700 dark:text-gray-300">{{ totalPages || 1 }}</span>
            </span>
            <div class="flex items-center gap-1">
              <button @click="prevPage" :disabled="currentPage <= 1"
                class="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button @click="nextPage" :disabled="currentPage >= totalPages"
                class="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { getBatches, closeBatch, getBatchBundles} from '@/services/batchService'
import { getQRImage } from '@/services/qrService'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const currentPageTitle = ref('Batch Panen')
const isLoading = ref(false)
const batches = ref([])
const filterStatus = ref('')
const filterDate = ref('')
const searchQuery = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)
const closingId = ref(null)

// ─── Bundle Modal ─────────────────────────────────────────
const bundleModal = reactive({ show: false, bundles: [] })

// ─── QR Preview Modal ─────────────────────────────────────
const qrPreview = reactive({ show: false, loading: false, imageUrl: '', grade: '' })

// ─── Stats ────────────────────────────────────────────────
const stats = computed(() => ({
  total: batches.value.length,
  open: batches.value.filter(b => b.status === 'OPEN').length,
  closed: batches.value.filter(b => b.status === 'CLOSED').length,
  totalFruits: batches.value.reduce((sum, b) => sum + (b.total_fruits || 0), 0),
}))

const filteredBatches = computed(() => {
  let result = batches.value

  if (filterStatus.value) {
    result = result.filter(b => b.status === filterStatus.value)
  }

  if (filterDate.value) {
    result = result.filter(b => b.harvest_date && b.harvest_date.startsWith(filterDate.value))
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(b => 
      (b.lot_code && b.lot_code.toLowerCase().includes(q)) ||
      (b.farmer?.name && b.farmer.name.toLowerCase().includes(q)) ||
      (b.land?.land_name && b.land.land_name.toLowerCase().includes(q)) ||
      (b.fruit_type && b.fruit_type.toLowerCase().includes(q))
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredBatches.value.length / itemsPerPage.value))

const paginatedBatches = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBatches.value.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

watch([filterStatus, filterDate, searchQuery, itemsPerPage], () => {
  currentPage.value = 1
})

// ─── Helpers ──────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const gradeBadgeClass = (grade) => ({
  A: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  B: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  C: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  REJECT: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}[grade] || 'bg-gray-100 text-gray-500')

// ─── Load Data ────────────────────────────────────────────
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

// ─── Close Batch ──────────────────────────────────────────
const handleCloseBatch = async (batch) => {
  if (!confirm(`Tutup batch ${batch.lot_code}? Grading tidak bisa ditambahkan setelah ditutup.`)) return

  closingId.value = batch.id
  try {
    const res = await closeBatch(batch.id)
    await loadBatches()

    // Tampilkan modal bundle hasil sortir
    bundleModal.bundles = res.data.bundles || []
    bundleModal.show = true
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menutup batch.')
  } finally {
    closingId.value = null
  }
}

// ─── Lihat Bundle (batch yang sudah CLOSED) ───────────────
const loadAndShowBundles = async (batchId) => {
  try {
    const res = await getBatchBundles(batchId)
    bundleModal.bundles = res.data || []
    bundleModal.show = true
  } catch (message) {
    alert(message || 'Gagal memuat bundle.')
  }
}

// ─── Preview QR Image ─────────────────────────────────────
const previewQR = async (token) => {
  const bundle = bundleModal.bundles.find(b => b.qr_token === token)
  qrPreview.grade = bundle?.grade || ''
  qrPreview.imageUrl = ''
  qrPreview.loading = true
  qrPreview.show = true

  try {
    const res = await getQRImage(token)
    qrPreview.imageUrl = res.data.image_url
  } catch (message) {
    console.error('Gagal load QR image:', message)
  } finally {
    qrPreview.loading = false
  }
}

onMounted(loadBatches)
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>