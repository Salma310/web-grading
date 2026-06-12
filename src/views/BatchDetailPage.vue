<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="batch?.lot_code || 'Detail Batch'" />

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

    <!-- ─── Popup setelah Close Batch ─────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="closedModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div class="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden">

            <!-- Header sukses -->
            <div class="px-6 pt-7 pb-4 text-center">
              <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg class="h-7 w-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 class="text-base font-semibold text-gray-800 dark:text-white">Batch Berhasil Ditutup!</h3>
              <p class="mt-1.5 text-sm text-gray-400">
                {{ closedModal.bundles.length }} keranjang QR telah dibuat secara otomatis.
                Apakah ingin melihat QR sekarang?
              </p>
            </div>

            <!-- Daftar bundle per grade -->
            <div class="mx-6 mb-5 space-y-2">
              <div
                v-for="bundle in closedModal.bundles" :key="bundle.id"
                class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    :class="gradeBadgeClass(bundle.grade)"
                  >
                    {{ bundle.grade === 'REJECT' ? 'R' : bundle.grade }}
                  </span>
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ bundle.total_fruits }} buah
                      <span v-if="bundle.total_weight" class="font-normal text-gray-400">
                        · {{ bundle.total_weight.toFixed(1) }} kg
                      </span>
                    </p>
                    <p class="mt-0.5 text-xs font-mono text-gray-400">{{ bundle.qr_token?.slice(0, 24) }}…</p>
                  </div>
                </div>
                <!-- Preview QR langsung dari modal ini -->
                <button
                  @click="previewQRInModal(bundle.qr_token)"
                  class="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                    <path d="M3 4h5v5H3V4zM3 11h5v5H3v-5zM11 4h5v5h-5V4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                    <path d="M11 11h2v2h-2v-2zM13 13h2v2h-2v-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  </svg>
                  QR
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button
                @click="closedModal.show = false"
                class="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-colors"
              >
                Nanti
              </button>
              <router-link
                to="/qr"
                class="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M3 4h5v5H3V4zM3 11h5v5H3v-5zM11 4h5v5h-5V4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  <path d="M11 11h2v2h-2v-2zM13 13h2v2h-2v-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
                Kelola QR
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── QR Preview Modal (dari tombol QR di popup) ────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="qrPreview.show"
          class="fixed inset-0 z-[60] flex items-center justify-center p-4"
          @click="qrPreview.show = false"
        >
          <div class="absolute inset-0 bg-black/70"></div>
          <div class="relative rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 text-center" @click.stop>
            <p class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              QR Code · Grade {{ qrPreview.grade }}
            </p>
            <div v-if="qrPreview.loading" class="flex h-48 w-48 items-center justify-center mx-auto">
              <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <img
              v-else-if="qrPreview.imageUrl"
              :src="qrPreview.imageUrl"
              class="h-48 w-48 mx-auto rounded-xl object-contain border border-gray-200 dark:border-gray-700"
            />
            <div class="mt-4 flex gap-2 justify-center">
              <a
                v-if="qrPreview.imageUrl"
                :href="qrPreview.imageUrl"
                download
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v10M5 13l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Download PNG
              </a>
              <button
                @click="qrPreview.show = false"
                class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Loading -->
    <div v-if="isLoadingBatch" class="flex items-center justify-center py-20">
      <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>

    <template v-else-if="batch">

      <!-- Batch Info Header -->
      <div class="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h2 class="font-mono text-xl font-bold text-gray-800 dark:text-white">{{ batch.lot_code }}</h2>
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                :class="batch.status === 'OPEN'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="batch.status === 'OPEN' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"></span>
                {{ batch.status === 'OPEN' ? 'Open' : 'Closed' }}
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ batch.fruit_type }}</p>
          </div>
          <div class="flex gap-2">
            <button v-if="batch.status === 'OPEN'" @click="showAddModal = true"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 4.167v11.666M4.167 10h11.666" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              Tambah Grading
            </button>
            <button v-if="batch.status === 'OPEN'" @click="handleCloseBatch"
              :disabled="isClosing"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <svg v-if="isClosing" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ isClosing ? 'Menutup...' : 'Tutup Batch' }}
            </button>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-4 dark:border-gray-800">
          <div>
            <p class="text-xs text-gray-400">Petani</p>
            <p class="mt-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">{{ batch.farmer?.name }}</p>
            <p class="text-xs text-gray-400">{{ batch.farmer?.farmer_code }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Lahan</p>
            <p class="mt-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">{{ batch.land?.land_name }}</p>
            <p class="text-xs text-gray-400">{{ batch.land?.location }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Tanggal Panen</p>
            <p class="mt-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatDate(batch.harvest_date) }}</p>
            <p class="text-xs text-gray-400">{{ formatTime(batch.harvest_date) }}</p>
          </div>  
        </div>
        <div class="mt-5 grid grid-cols-2 gap-4 pt-5 sm:grid-cols-4 ">
          <div>
            <p class="text-xs text-gray-400">Perlakuan</p>
            <p class="mt-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">{{ batch.treatment || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Keterangan</p>
            <p class="mt-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">{{ batch.notes || '—' }}</p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Total Buah</p>
          <p class="mt-2 text-3xl font-bold text-gray-800 dark:text-white">{{ batch.total_fruits }}</p>
        </div>
        <div class="rounded-2xl border border-green-100 bg-green-50 p-5 dark:border-green-900/30 dark:bg-green-900/10">
          <p class="text-xs font-medium uppercase tracking-wider text-green-500">Grade A</p>
          <p class="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{{ batch.total_grade_a }}</p>
          <p class="mt-1 text-xs text-green-400">{{ gradePercent(batch.total_grade_a) }}</p>
        </div>
        <div class="rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
          <p class="text-xs font-medium uppercase tracking-wider text-blue-500">Grade B</p>
          <p class="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{{ batch.total_grade_b }}</p>
          <p class="mt-1 text-xs text-blue-400">{{ gradePercent(batch.total_grade_b) }}</p>
        </div>
        <div class="rounded-2xl border border-yellow-100 bg-yellow-50 p-5 dark:border-yellow-900/30 dark:bg-yellow-900/10">
          <p class="text-xs font-medium uppercase tracking-wider text-yellow-500">Grade C</p>
          <p class="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">{{ batch.total_grade_c }}</p>
          <p class="mt-1 text-xs text-yellow-400">{{ gradePercent(batch.total_grade_c) }}</p>
        </div>
        <div class="rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-900/30 dark:bg-red-900/10">
          <p class="text-xs font-medium uppercase tracking-wider text-red-400">Reject</p>
          <p class="mt-2 text-3xl font-bold text-red-500 dark:text-red-400">{{ batch.total_reject }}</p>
          <p class="mt-1 text-xs text-red-400">{{ gradePercent(batch.total_reject) }}</p>
        </div>
      </div>

      <!-- Grading Table -->
      <div class="rounded-2xl border border-gray-100 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 class="text-base font-semibold text-gray-800 dark:text-white">Data Grading</h3>
            <p class="mt-0.5 text-sm text-gray-400">{{ gradings.length }} buah tercatat</p>
          </div>
        </div>

        <div v-if="isLoadingGradings" class="flex items-center justify-center py-12">
          <svg class="animate-spin h-5 w-5 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>

        <div v-else-if="gradings.length === 0" class="flex flex-col items-center justify-center py-14 text-center">
          <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Belum ada data grading</p>
          <p class="mt-1 text-xs text-gray-400">Klik "Tambah Grading" untuk mulai</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">#</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Kode Grading</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Foto</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Grade</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Confidence</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Metode</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Waktu</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="(grading, index) in gradings" :key="grading.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td class="px-6 py-4 text-gray-400 text-xs">{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <span class="font-mono text-xs text-gray-600 dark:text-gray-400">{{ grading.grading_code }}</span>
                </td>
                <td class="px-6 py-4">
                  <div v-if="grading.image_urls?.length" class="flex gap-1">
                    <img
                      v-for="(url, i) in grading.image_urls.slice(0, 2)" :key="i"
                      :src="url"
                      class="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                      @click="openImagePreview(grading.image_urls, i)"
                    />
                    <div v-if="grading.image_urls.length > 2"
                      class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 cursor-pointer"
                      @click="openImagePreview(grading.image_urls, 0)">
                      +{{ grading.image_urls.length - 2 }}
                    </div>
                  </div>
                  <span v-else class="text-xs text-gray-400">—</span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold" :class="gradeClass(grading.grade)">
                    {{ grading.grade || '—' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div v-if="grading.confidence != null" class="flex items-center gap-2">
                    <div class="h-1.5 w-16 rounded-full bg-gray-100 dark:bg-gray-700">
                      <div class="h-1.5 rounded-full bg-brand-500" :style="{ width: `${Math.round(grading.confidence * 100)}%` }"></div>
                    </div>
                    <span class="text-xs text-gray-500">{{ Math.round(grading.confidence * 100) }}%</span>
                  </div>
                  <span v-else class="text-xs text-gray-400">—</span>
                </td>
                <td class="px-6 py-4">
                  <span class="rounded px-2 py-0.5 text-xs"
                    :class="grading.grading_method === 'AI'
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800'">
                    {{ grading.grading_method || 'AI' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="rounded px-2 py-0.5 text-xs"
                    :class="{
                      'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400': grading.status === 'ERROR',
                      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400': grading.status === 'PENDING',                      
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': grading.status === 'PROCESSING',
                      'bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400': grading.status === 'DONE'
                    }">
                    {{ grading.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs text-gray-400">
                  {{ formatDate(grading.createdAt) }}<br/>{{ formatTime(grading.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- ─── Add Grading Modal ─────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
          <div class="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden">

            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-white">Tambah Grading</h3>
                <p class="mt-0.5 text-xs text-gray-400 font-mono">{{ batch?.lot_code }}</p>
              </div>
              <button @click="closeModal" class="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <div class="space-y-5 px-6 py-5 max-h-[70vh] overflow-y-auto">
              <!-- Upload Foto -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Foto Buah <span class="text-red-500">*</span>
                </label>
                <div
                  class="relative rounded-xl border-2 border-dashed transition-colors"
                  :class="isDragging
                    ? 'border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-900/10'
                    : 'border-gray-200 hover:border-brand-300 dark:border-gray-700'"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                >
                  <input ref="fileInput" type="file" accept="image/*" multiple
                    class="absolute inset-0 cursor-pointer opacity-0" @change="handleFileSelect"/>
                  <div class="flex flex-col items-center justify-center py-8 text-center">
                    <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Klik atau drag foto buah di sini</p>
                    <p class="mt-1 text-xs text-gray-400">JPG, PNG, WEBP · Maks. 5MB per file</p>
                  </div>
                </div>
                <div v-if="selectedFiles.length > 0" class="mt-3 flex flex-wrap gap-2">
                  <div v-for="(file, i) in selectedFiles" :key="i"
                    class="group relative h-20 w-20 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    <img :src="file.preview" class="h-full w-full object-cover" />
                    <button @click="removeFile(i)"
                      class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Grade Mode -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Grade</label>
                  <span class="text-xs text-gray-400">{{ gradingMode === 'ai' ? '🤖 Akan di-detect AI' : '✍️ Override manual' }}</span>
                </div>
                <div class="flex gap-2">
                  <button type="button" @click="gradingMode = 'ai'; modalForm.grade = ''"
                    class="flex-1 rounded-lg border py-2 text-sm font-medium transition-colors"
                    :class="gradingMode === 'ai'
                      ? 'border-brand-400 bg-brand-50 text-brand-600 dark:border-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'">
                    Auto (AI)
                  </button>
                  <button type="button" @click="gradingMode = 'manual'"
                    class="flex-1 rounded-lg border py-2 text-sm font-medium transition-colors"
                    :class="gradingMode === 'manual'
                      ? 'border-brand-400 bg-brand-50 text-brand-600 dark:border-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'">
                    Manual
                  </button>
                </div>
                <div v-if="gradingMode === 'manual'" class="mt-3 flex gap-2">
                  <button v-for="g in ['A', 'B', 'C', 'REJECT']" :key="g" type="button" @click="modalForm.grade = g"
                    class="flex-1 rounded-lg border py-2 text-sm font-bold transition-colors"
                    :class="modalForm.grade === g ? gradeActiveClass(g) : 'border-gray-200 text-gray-400 hover:border-gray-300 dark:border-gray-700'">
                    {{ g }}
                  </button>
                </div>
              </div>

              <div v-if="modalError" class="rounded-lg bg-red-50 px-4 py-3 dark:bg-red-900/20">
                <p class="text-sm text-red-600 dark:text-red-400">⚠️ {{ modalError }}</p>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button type="button" @click="closeModal"
                class="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                Batal
              </button>
              <button type="button" @click="handleSubmitGrading"
                :disabled="isSubmittingGrading || selectedFiles.length === 0 || (gradingMode === 'manual' && !modalForm.grade)"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 transition-colors">
                <svg v-if="isSubmittingGrading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ isSubmittingGrading ? 'Memproses...' : 'Simpan Grading' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Image Preview ─────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="imagePreview.show"
          class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
          @click="imagePreview.show = false">
          <img :src="imagePreview.urls[imagePreview.index]"
            class="max-h-[90vh] max-w-[90vw] rounded-xl object-contain" @click.stop/>
          <button class="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            @click="imagePreview.show = false">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>

  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { getBatchById, closeBatch } from '@/services/batchService'
import { getGradingsByBatch, createGrading } from '@/services/gradingService'
import { getQRImage } from '@/services/qrService'
import { useGradingPoller } from '@/composables/useGradingPoller'

const route  = useRoute()
const batchId = route.params.id

// ─── State ────────────────────────────────────────────────
const isLoadingBatch    = ref(false)
const isLoadingGradings = ref(false)
const isClosing         = ref(false)
const batch             = ref(null)
const gradings          = ref([])

const showAddModal       = ref(false)
const isSubmittingGrading = ref(false)
const modalError         = ref('')
const gradingMode        = ref('ai')
const isDragging         = ref(false)
const fileInput          = ref(null)
const selectedFiles      = ref([])
const modalForm          = reactive({ grade: '' })
const imagePreview       = reactive({ show: false, urls: [], index: 0 })

const { startPolling } = useGradingPoller()

// ─── Close Batch Popup ────────────────────────────────────
const closedModal = reactive({
  show: false,
  bundles: [],
})

// ─── QR Preview (dari popup close batch) ─────────────────
const qrPreview = reactive({
  show: false,
  loading: false,
  imageUrl: '',
  grade: '',
})

// ─── Toast ────────────────────────────────────────────────
const toast = reactive({ show: false, type: 'success', title: '', body: '' })
let toastTimer = null
const showToast = (type, title, body = '') => {
  if (toastTimer) clearTimeout(toastTimer)
  Object.assign(toast, { show: true, type, title, body })
  toastTimer = setTimeout(() => { toast.show = false }, 4000)
}
onUnmounted(() => { if (toastTimer) clearTimeout(toastTimer) })

// ─── Helpers ──────────────────────────────────────────────
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const formatTime = (d) =>
  d ? new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''
const gradePercent = (count) =>
  !batch.value?.total_fruits ? '0%' : `${Math.round((count / batch.value.total_fruits) * 100)}%`

const gradeClass = (grade) => ({
  A:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  B:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  C:      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  REJECT: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}[grade] || 'bg-gray-100 text-gray-500')

const gradeBadgeClass = (grade) => ({
  A:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  B:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  C:      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  REJECT: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}[grade] || 'bg-gray-100 text-gray-500')

const gradeActiveClass = (grade) => ({
  A:      'border-green-400 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:text-green-400',
  B:      'border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  C:      'border-yellow-400 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  REJECT: 'border-red-400 bg-red-50 text-red-600 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400',
}[grade] || '')

// ─── File handling ────────────────────────────────────────
const addFiles = (files) => Array.from(files).forEach(file => {
  if (!file.type.startsWith('image/')) return
  selectedFiles.value.push({ file, name: file.name, preview: URL.createObjectURL(file) })
})
const handleFileSelect = (e) => addFiles(e.target.files)
const handleDrop = (e) => { isDragging.value = false; addFiles(e.dataTransfer.files) }
const removeFile = (i) => { URL.revokeObjectURL(selectedFiles.value[i].preview); selectedFiles.value.splice(i, 1) }
const openImagePreview = (urls, index) => { imagePreview.urls = urls; imagePreview.index = index; imagePreview.show = true }

// ─── Modal ────────────────────────────────────────────────
const closeModal = () => {
  showAddModal.value = false
  selectedFiles.value.forEach(f => URL.revokeObjectURL(f.preview))
  selectedFiles.value = []
  modalForm.grade  = ''
  gradingMode.value = 'ai'
  modalError.value  = ''
}

// ─── Submit Grading ───────────────────────────────────────
const handleSubmitGrading = async () => {
  modalError.value = ''
  if (selectedFiles.value.length === 0) {
    modalError.value = 'Upload minimal 1 foto buah.'
    return
  }

  isSubmittingGrading.value = true
  try {
    const formData = new FormData()
    formData.append('batch_id', batchId)
    formData.append('grading_method', gradingMode.value === 'ai' ? 'AI' : 'MANUAL')
    if (gradingMode.value === 'manual') formData.append('grade', modalForm.grade)
    selectedFiles.value.forEach(f => formData.append('images', f.file))

    const res  = await createGrading(formData)
    const data = res.data

    closeModal()

    if (gradingMode.value === 'manual') {
      showToast('success', 'Grading tersimpan', `${data.grading_code} · Grade ${data.grade}`)
      await Promise.all([loadBatch(), loadGradings()])
    } else {
      showToast('success', 'Foto dikirim, AI sedang menganalisis...', data.grading_code)
      startPolling(
        data.grading_id,
        (result) => {
          showToast('success', 'Grading selesai!', `${data.grading_code} · Grade ${result.grade}`)
          loadBatch()
          loadGradings()
        },
        (errMsg) => {
          showToast('error', 'Foto tidak terdeteksi', errMsg || 'Pastikan foto berisi buah dan tidak blur')
          loadGradings()
        }
      )
    }
  } catch (err) {
    modalError.value = err.response?.data?.error || err.message || 'Gagal menyimpan grading.'
  } finally {
    isSubmittingGrading.value = false
  }
}

// ─── Close Batch ──────────────────────────────────────────
const handleCloseBatch = async () => {
  if (!confirm(`Tutup batch ${batch.value?.lot_code}? Grading tidak bisa ditambahkan setelah ditutup.`)) return

  isClosing.value = true
  try {
    const res = await closeBatch(batchId)
    await loadBatch()

    // Tampilkan popup QR
    closedModal.bundles = res.data?.bundles || []
    closedModal.show    = true
  } catch (err) {
    showToast('error', 'Gagal menutup batch', err.response?.data?.message || err.message)
  } finally {
    isClosing.value = false
  }
}

// ─── Preview QR dari popup ────────────────────────────────
const previewQRInModal = async (token) => {
  const bundle = closedModal.bundles.find(b => b.qr_token === token)
  qrPreview.grade    = bundle?.grade || ''
  qrPreview.imageUrl = ''
  qrPreview.loading  = true
  qrPreview.show     = true

  try {
    const res = await getQRImage(token)
    qrPreview.imageUrl = res.data.image_url
  } catch (err) {
    console.error('Gagal load QR:', err)
  } finally {
    qrPreview.loading = false
  }
}

// ─── Load Data ────────────────────────────────────────────
const loadBatch = async () => {
  const res = await getBatchById(batchId)
  batch.value = res.data
}

const loadGradings = async () => {
  isLoadingGradings.value = true
  try {
    const res = await getGradingsByBatch(batchId)
    gradings.value = res.data
  } finally {
    isLoadingGradings.value = false
  }
}

onMounted(async () => {
  isLoadingBatch.value = true
  try { await Promise.all([loadBatch(), loadGradings()]) }
  finally { isLoadingBatch.value = false }
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateY(16px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>