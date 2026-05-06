<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

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
          <button @click="toast.show = false" class="ml-2 shrink-0 text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── QR Detail Modal ───────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="detailModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="detailModal.show = false"></div>
          <div class="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden max-h-[90vh] flex flex-col">

            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800 shrink-0">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center justify-center h-9 w-9 rounded-full text-sm font-bold"
                  :class="gradeBadgeClass(detailModal.data?.grade)">
                  {{ detailModal.data?.grade }}
                </span>
                <div>
                  <h3 class="text-base font-semibold text-gray-800 dark:text-white">Detail QR Bundle</h3>
                  <p class="mt-0.5 text-xs font-mono text-gray-400">{{ detailModal.data?.qr_token }}</p>
                </div>
              </div>
              <button @click="detailModal.show = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <div class="overflow-y-auto flex-1">
              <div v-if="detailModal.loading" class="flex items-center justify-center py-16">
                <svg class="animate-spin h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </div>

              <template v-else-if="detailModal.detail">
                <div class="px-6 py-5 space-y-5">

                  <!-- QR Image + Batch Info -->
                  <div class="flex gap-5 flex-col sm:flex-row">

                    <!-- QR Code image -->
                    <div class="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50 sm:w-48 shrink-0">
                      <div v-if="detailModal.qrLoading" class="flex h-36 w-36 items-center justify-center">
                        <svg class="animate-spin h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      </div>
                      <img v-else-if="detailModal.qrImageUrl"
                        :src="detailModal.qrImageUrl"
                        class="h-36 w-36 rounded-lg object-contain border border-gray-200 dark:border-gray-700" />
                      <div v-else class="flex h-36 w-36 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                        <svg class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                        </svg>
                      </div>
                      <p class="mt-2 text-xs font-medium text-center" :class="gradeTextClass(detailModal.detail.grade)">
                        Grade {{ detailModal.detail.grade }}
                      </p>
                      <span class="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                        :class="detailModal.detail.qr_is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'">
                        <span class="h-1.5 w-1.5 rounded-full"
                          :class="detailModal.detail.qr_is_active ? 'bg-green-500' : 'bg-red-500'"></span>
                        {{ detailModal.detail.qr_is_active ? 'Aktif' : 'Nonaktif' }}
                      </span>
                    </div>

                    <!-- Info Grid -->
                    <div class="flex-1 space-y-3">
                      <div class="grid grid-cols-2 gap-3">
                        <div class="rounded-xl border border-gray-100 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-800/50">
                          <p class="text-xs text-gray-400">Total Buah</p>
                          <p class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">{{ detailModal.detail.total_fruits }}</p>
                          <p class="text-xs text-gray-400">buah</p>
                        </div>
                        <div class="rounded-xl border border-gray-100 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-800/50">
                          <p class="text-xs text-gray-400">Total Berat</p>
                          <p class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">
                            {{ detailModal.detail.total_weight ? detailModal.detail.total_weight.toFixed(1) : '—' }}
                          </p>
                          <p class="text-xs text-gray-400">kg</p>
                        </div>
                      </div>

                      <!-- Batch info -->
                      <div class="rounded-xl border border-gray-100 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-800/50 space-y-2">
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Info Batch</p>
                        <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                          <div>
                            <span class="text-xs text-gray-400">Lot Code</span>
                            <p class="font-mono font-medium text-gray-700 dark:text-gray-300 text-xs mt-0.5">{{ detailModal.detail.batch?.lot_code }}</p>
                          </div>
                          <div>
                            <span class="text-xs text-gray-400">Jenis Buah</span>
                            <p class="font-medium text-gray-700 dark:text-gray-300 text-xs mt-0.5">{{ detailModal.detail.fruit_type || detailModal.detail.batch?.fruit_type || '—' }}</p>
                          </div>
                          <div>
                            <span class="text-xs text-gray-400">Petani</span>
                            <p class="font-medium text-gray-700 dark:text-gray-300 text-xs mt-0.5">{{ detailModal.detail.farmer_name || detailModal.detail.batch?.farmer?.name || '—' }}</p>
                          </div>
                          <div>
                            <span class="text-xs text-gray-400">Tanggal Panen</span>
                            <p class="font-medium text-gray-700 dark:text-gray-300 text-xs mt-0.5">{{ formatDate(detailModal.detail.harvest_date || detailModal.detail.batch?.harvest_date) }}</p>
                          </div>
                          <div>
                            <span class="text-xs text-gray-400">Asal Desa</span>
                            <p class="font-medium text-gray-700 dark:text-gray-300 text-xs mt-0.5">{{ detailModal.detail.origin_village || '—' }}</p>
                          </div>
                          <div>
                            <span class="text-xs text-gray-400">Kota</span>
                            <p class="font-medium text-gray-700 dark:text-gray-300 text-xs mt-0.5">{{ detailModal.detail.origin_city || '—' }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Print info -->
                      <div class="rounded-xl border border-gray-100 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-800/50">
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Status Print</p>
                        <div class="flex items-center justify-between">
                          <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                            :class="printStatusClass(detailModal.detail.print_status)">
                            {{ printStatusLabel(detailModal.detail.print_status) }}
                          </span>
                          <div v-if="detailModal.detail.print_count > 0" class="text-xs text-gray-400">
                            Dicetak {{ detailModal.detail.print_count }}×
                            <span v-if="detailModal.detail.printed_at">· {{ formatDate(detailModal.detail.printed_at) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Grading results -->
                  <div v-if="detailModal.detail.grading_results?.length > 0">
                    <p class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Grading dalam Bundle ({{ detailModal.detail.grading_results.length }} item)
                    </p>
                    <div class="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                      <table class="w-full text-xs">
                        <thead>
                          <tr class="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th class="px-4 py-2 text-left font-medium text-gray-400">#</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-400">Kode Grading</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-400">Grade</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-400">Confidence</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-400">Metode</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-400">Waktu</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
                          <tr v-for="(gr, i) in detailModal.detail.grading_results" :key="gr.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-4 py-2 text-gray-400">{{ i + 1 }}</td>
                            <td class="px-4 py-2 font-mono text-gray-600 dark:text-gray-400">{{ gr.grading_code }}</td>
                            <td class="px-4 py-2">
                              <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold" :class="gradeClass(gr.grade)">
                                {{ gr.grade }}
                              </span>
                            </td>
                            <td class="px-4 py-2 text-gray-500">
                              {{ gr.confidence != null ? Math.round(gr.confidence * 100) + '%' : '—' }}
                            </td>
                            <td class="px-4 py-2">
                              <span class="rounded px-1.5 py-0.5"
                                :class="gr.grading_method === 'AI'
                                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800'">
                                {{ gr.grading_method || 'AI' }}
                              </span>
                            </td>
                            <td class="px-4 py-2 text-gray-400">{{ formatDate(gr.createdAt) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Access logs -->
                  <div v-if="detailModal.logs?.length > 0">
                    <p class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Log Akses QR ({{ detailModal.logs.length }})
                    </p>
                    <div class="space-y-1.5 max-h-40 overflow-y-auto">
                      <div v-for="log in detailModal.logs.slice(0, 10)" :key="log.id"
                        class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/50">
                        <div class="flex items-center gap-2">
                          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                            <svg class="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                          </div>
                          <div>
                            <p class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ log.device_type || 'Unknown Device' }}</p>
                            <p class="text-xs text-gray-400">{{ log.ip_address || '—' }}</p>
                          </div>
                        </div>
                        <p class="text-xs text-gray-400">{{ formatDateTime(log.accessed_at) }}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </template>
            </div>

            <!-- Footer Actions -->
            <div class="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-gray-800 shrink-0 gap-3 flex-wrap">
              <div class="flex items-center gap-2">
                <!-- Deactivate -->
                <button v-if="detailModal.detail?.qr_is_active"
                  @click="handleDeactivate(detailModal.data)"
                  :disabled="detailModal.deactivating"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                    <path d="M10 10V4m0 12v-1m-6-5h1m12 0h-1M5.05 5.05l.707.707m9.193 9.193.707.707M5.05 14.95l.707-.707m9.193-9.193.707-.707" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  Nonaktifkan QR
                </button>
                <!-- Download QR image -->
                <a v-if="detailModal.qrImageUrl" :href="detailModal.qrImageUrl" download
                  class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3v10M5 13l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Download PNG
                </a>
              </div>

              <!-- Print Sticker — buka tab baru ke QRPrintView -->
              <button
                @click="openPrintTab(detailModal.data)"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7V4h10v3M5 16H3a1 1 0 01-1-1V9a1 1 0 011-1h14a1 1 0 011 1v6a1 1 0 01-1 1h-2M5 12h10v4H5v-4z"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Print Sticker
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Main Content ──────────────────────────────────── -->
    <div class="space-y-5 sm:space-y-6">

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Total QR Bundle</p>
          <p class="mt-2 text-3xl font-bold text-gray-800 dark:text-white">{{ stats.total }}</p>
        </div>
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Aktif</p>
          <p class="mt-2 text-3xl font-bold text-green-500">{{ stats.active }}</p>
        </div>
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Sudah Dicetak</p>
          <p class="mt-2 text-3xl font-bold text-brand-500">{{ stats.printed }}</p>
        </div>
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Belum Dicetak</p>
          <p class="mt-2 text-3xl font-bold text-yellow-500">{{ stats.notPrinted }}</p>
        </div>
      </div>

      <!-- Filter + Table -->
      <div class="rounded-2xl border border-gray-100 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">

        <!-- Toolbar -->
        <div class="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div>
            <h3 class="text-base font-semibold text-gray-800 dark:text-white">Daftar QR Bundle</h3>
            <p class="mt-0.5 text-sm text-gray-400">Keranjang per grade dari semua batch tertutup</p>
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            <!-- Search -->
            <div class="relative">
              <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 20 20">
                <path d="M9 17A8 8 0 109 1a8 8 0 000 16zm11 2l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <input v-model="searchQuery" type="text" placeholder="Cari lot code / token..."
                class="h-9 w-56 rounded-lg border border-gray-200 bg-transparent pl-9 pr-3 text-sm text-gray-600 placeholder:text-gray-300 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:text-gray-400" />
            </div>
            <!-- Grade filter -->
            <div class="relative">
              <select v-model="filterGrade"
                class="h-9 appearance-none rounded-lg border border-gray-200 bg-transparent pl-3 pr-8 text-sm text-gray-600 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-gray-400">
                <option value="">Semua Grade</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="REJECT">Reject</option>
              </select>
              <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
            <!-- Print status filter -->
            <div class="relative">
              <select v-model="filterPrint"
                class="h-9 appearance-none rounded-lg border border-gray-200 bg-transparent pl-3 pr-8 text-sm text-gray-600 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-gray-400">
                <option value="">Semua Status Print</option>
                <option value="NOT_PRINTED">Belum Cetak</option>
                <option value="PRINTED">Sudah Cetak</option>
                <option value="REPRINTED">Cetak Ulang</option>
              </select>
              <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex items-center justify-center py-16">
          <svg class="animate-spin h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="ml-3 text-sm text-gray-400">Memuat data QR...</span>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredBundles.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center">
          <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Belum ada QR bundle</p>
          <p class="mt-1 text-xs text-gray-400">QR dibuat otomatis saat batch ditutup</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Grade</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Batch / Lot Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Petani & Asal</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Buah</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">QR Token</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status QR</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status Print</th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="bundle in filteredBundles" :key="bundle.id"
                class="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">

                <td class="px-6 py-4">
                  <span class="inline-flex items-center justify-center h-9 w-9 rounded-full text-sm font-bold"
                    :class="gradeBadgeClass(bundle.grade)">
                    {{ bundle.grade === 'REJECT' ? 'R' : bundle.grade }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <p class="font-mono text-xs font-medium text-gray-700 dark:text-gray-300">{{ bundle.batch?.lot_code }}</p>
                  <p class="mt-0.5 text-xs text-gray-400">{{ bundle.fruit_type || bundle.batch?.fruit_type }}</p>
                </td>

                <td class="px-6 py-4">
                  <p class="font-medium text-gray-700 dark:text-gray-300 text-sm">{{ bundle.farmer_name || bundle.batch?.farmer?.name }}</p>
                  <p class="text-xs text-gray-400">
                    {{ bundle.origin_village || bundle.batch?.land?.location }}
                    <span v-if="bundle.origin_city"> · {{ bundle.origin_city }}</span>
                  </p>
                </td>

                <td class="px-6 py-4">
                  <span class="text-lg font-bold text-gray-700 dark:text-gray-300">{{ bundle.total_fruits }}</span>
                  <span class="ml-1 text-xs text-gray-400">buah</span>
                  <p v-if="bundle.total_weight" class="text-xs text-gray-400">{{ bundle.total_weight.toFixed(1) }} kg</p>
                </td>

                <td class="px-6 py-4">
                  <p class="font-mono text-xs text-gray-500 dark:text-gray-400">{{ bundle.qr_token?.slice(0, 16) }}…</p>
                  <p class="mt-0.5 text-xs text-gray-400">{{ formatDate(bundle.harvest_date || bundle.batch?.harvest_date) }}</p>
                </td>

                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="bundle.qr_is_active
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'">
                    <span class="h-1.5 w-1.5 rounded-full"
                      :class="bundle.qr_is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'"></span>
                    {{ bundle.qr_is_active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="printStatusClass(bundle.print_status)">
                    {{ printStatusLabel(bundle.print_status) }}
                  </span>
                  <p v-if="bundle.print_count > 0" class="mt-0.5 text-xs text-gray-400">{{ bundle.print_count }}× cetak</p>
                </td>

                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openDetail(bundle)"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/>
                        <path d="M2 10s3-7 8-7 8 7 8 7-3 7-8 7-8-7-8-7z" stroke="currentColor" stroke-width="1.5"/>
                      </svg>
                      Detail
                    </button>
                    <!-- Print → buka tab baru QRPrintView -->
                    <button @click="openPrintTab(bundle)"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path d="M5 7V4h10v3M5 16H3a1 1 0 01-1-1V9a1 1 0 011-1h14a1 1 0 011 1v6a1 1 0 01-1 1h-2M5 12h10v4H5v-4z"
                          stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Print
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { getQRImage, getQRDetail, getQRLogs, deactivateQR } from '@/services/qrService'
import { getAllBundles } from '@/services/batchService'

const currentPageTitle = ref('QR Management')
const isLoading        = ref(false)
const bundles          = ref([])
const searchQuery      = ref('')
const filterGrade      = ref('')
const filterPrint      = ref('')

// ─── Toast ────────────────────────────────────────────────
const toast = reactive({ show: false, type: 'success', title: '', body: '' })
let toastTimer = null
const showToast = (type, title, body = '') => {
  if (toastTimer) clearTimeout(toastTimer)
  Object.assign(toast, { show: true, type, title, body })
  toastTimer = setTimeout(() => { toast.show = false }, 4000)
}

// ─── Detail Modal ─────────────────────────────────────────
const detailModal = reactive({
  show: false,
  data: null,
  detail: null,
  logs: [],
  loading: false,
  qrLoading: false,
  qrImageUrl: '',
  deactivating: false,
})

// ─── Stats ────────────────────────────────────────────────
const stats = computed(() => ({
  total:      bundles.value.length,
  active:     bundles.value.filter(b => b.qr_is_active).length,
  printed:    bundles.value.filter(b => b.print_status !== 'NOT_PRINTED').length,
  notPrinted: bundles.value.filter(b => b.print_status === 'NOT_PRINTED').length,
}))

// ─── Filtered ─────────────────────────────────────────────
const filteredBundles = computed(() =>
  bundles.value.filter(b => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch = !q ||
      b.qr_token?.toLowerCase().includes(q) ||
      b.batch?.lot_code?.toLowerCase().includes(q) ||
      b.farmer_name?.toLowerCase().includes(q)
    const matchGrade = !filterGrade.value || b.grade === filterGrade.value
    const matchPrint = !filterPrint.value || b.print_status === filterPrint.value
    return matchSearch && matchGrade && matchPrint
  })
)

// ─── Helpers ──────────────────────────────────────────────
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

const gradeBadgeClass = (grade) => ({
  A:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  B:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  C:      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  REJECT: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}[grade] || 'bg-gray-100 text-gray-500')

const gradeTextClass = (grade) => ({
  A:      'text-green-600 dark:text-green-400',
  B:      'text-blue-600 dark:text-blue-400',
  C:      'text-yellow-600 dark:text-yellow-400',
  REJECT: 'text-red-600 dark:text-red-400',
}[grade] || 'text-gray-500')

const gradeClass = (grade) => ({
  A:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  B:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  C:      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  REJECT: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}[grade] || 'bg-gray-100 text-gray-500')

const printStatusClass = (status) => ({
  NOT_PRINTED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  PRINTED:     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  REPRINTED:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}[status] || 'bg-gray-100 text-gray-500')

const printStatusLabel = (status) => ({
  NOT_PRINTED: 'Belum Cetak',
  PRINTED:     'Sudah Cetak',
  REPRINTED:   'Cetak Ulang',
}[status] || status)

// ─── Load Data (silent = tidak tampil loading spinner) ────
const loadBundles = async (silent = false) => {
  if (!silent) isLoading.value = true
  try {
    const res = await getAllBundles()
    bundles.value = res.data

    // Sync detailModal jika sedang terbuka
    if (detailModal.show && detailModal.data) {
      const updated = res.data.find(b => b.id === detailModal.data.id)
      if (updated) {
        detailModal.data = updated
        if (detailModal.detail) {
          detailModal.detail.print_status = updated.print_status
          detailModal.detail.print_count  = updated.print_count
        }
      }
    }
  } catch (err) {
    if (!silent) showToast('error', 'Gagal memuat data', err.message)
  } finally {
    if (!silent) isLoading.value = false
  }
}

// ─── Refresh saat tab ini kembali aktif ───────────────────
const handleFocus = () => {
  loadBundles(true) // silent refresh, tidak tampil spinner
}

// ─── Polling setiap 15 detik ──────────────────────────────
let pollingTimer = null
const startPolling = () => {
  pollingTimer = setInterval(() => {
    loadBundles(true) // silent
  }, 15000)
}
const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

// ─── Buka halaman print di tab baru ───────────────────────
const openPrintTab = (bundle) => {
  window.open(`/qr/${bundle.qr_token}/print`, '_blank')
}

// ─── Open Detail Modal ────────────────────────────────────
const openDetail = async (bundle) => {
  detailModal.data       = bundle
  detailModal.detail     = null
  detailModal.logs       = []
  detailModal.qrImageUrl = ''
  detailModal.loading    = true
  detailModal.qrLoading  = true
  detailModal.show       = true

  try {
    const [detailRes, logsRes] = await Promise.all([
      getQRDetail(bundle.qr_token),
      getQRLogs(bundle.qr_token),
    ])
    detailModal.detail = detailRes.data
    detailModal.logs   = logsRes.data || []
  } catch (err) {
    console.error('Failed to load detail:', err)
  } finally {
    detailModal.loading = false
  }

  try {
    const qrRes = await getQRImage(bundle.qr_token)
    detailModal.qrImageUrl = qrRes.data.image_url
  } catch (err) {
    console.error('Failed to load QR image:', err)
  } finally {
    detailModal.qrLoading = false
  }
}

// ─── Deactivate QR ────────────────────────────────────────
const handleDeactivate = async (bundle) => {
  const reason = prompt('Alasan penonaktifan QR (opsional):')
  if (reason === null) return

  detailModal.deactivating = true
  try {
    await deactivateQR(bundle.qr_token, reason || undefined)
    if (detailModal.detail) detailModal.detail.qr_is_active = false
    const b = bundles.value.find(x => x.id === bundle.id)
    if (b) b.qr_is_active = false
    showToast('success', 'QR dinonaktifkan', bundle.qr_token)
  } catch (err) {
    showToast('error', 'Gagal menonaktifkan QR', err.response?.data?.message || err.message)
  } finally {
    detailModal.deactivating = false
  }
}

// ─── Lifecycle ────────────────────────────────────────────
onMounted(() => {
  loadBundles()
  startPolling()
  window.addEventListener('focus', handleFocus)
})

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer)
  stopPolling()
  window.removeEventListener('focus', handleFocus)
})
</script>
<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateY(16px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>