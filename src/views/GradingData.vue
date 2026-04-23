<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Data Grading" />

    <!-- Toast -->
    <Teleport to="body">
      <div class="fixed top-5 right-5 z-[100] flex flex-col gap-2">
        <transition-group name="toast">
          <div v-for="t in toasts" :key="t.id" :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-[260px]',
            t.type === 'success' ? 'bg-success-500 text-white' :
              t.type === 'error' ? 'bg-error-500 text-white' : 'bg-gray-800 text-white'
          ]">
            <svg v-if="t.type === 'success'" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <svg v-else-if="t.type === 'error'" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            {{ t.message }}
          </div>
        </transition-group>
      </div>
    </Teleport>

    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

      <!-- Header -->
      <div class="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Data Grading Jambu</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola semua hasil grading buah</p>
        </div>
        <button @click="openCreateModal"
          class="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3.333v9.334M3.333 8h9.334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          Tambah Grading
        </button>
      </div>

      <!-- Filter Bar -->
      <div
        class="flex flex-wrap items-center gap-3 mb-5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
        <div class="relative flex-1 min-w-[180px]">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 16 16"
            fill="none">
            <path d="M14 14l-3.867-3.867M10.667 6.667a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor"
              stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <input v-model="search" type="text" placeholder="Cari kode grading..."
            class="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
          <button v-for="g in gradeFilterOptions" :key="g.value" @click="filterGrade = g.value" :class="[
            filterGrade === g.value ? 'bg-white dark:bg-gray-700 shadow-theme-xs text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400',
            'px-3 py-1.5 text-xs font-medium rounded-md transition-colors'
          ]">{{ g.label }}</button>
        </div>

        <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
          <button v-for="s in statusFilterOptions" :key="s.value" @click="filterStatus = s.value" :class="[
            filterStatus === s.value ? 'bg-white dark:bg-gray-700 shadow-theme-xs text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400',
            'px-3 py-1.5 text-xs font-medium rounded-md transition-colors'
          ]">{{ s.label }}</button>
        </div>

        <select v-model="filterMethod"
          class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">Semua Metode</option>
          <option value="AI">AI</option>
          <option value="MANUAL">Manual</option>
        </select>

        <button v-if="hasActiveFilter" @click="resetFilters"
          class="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          Reset
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <svg class="animate-spin h-7 w-7 text-brand-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 pl-2">No</th>
              <th class="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Foto</th>
              <th class="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Kode Grading</th>
              <th class="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Grade</th>
              <th class="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Metode</th>
              <th class="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Confidence</th>
              <th class="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th class="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Tanggal</th>
              <th class="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="item.id"
              class="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
              <td class="py-3.5 pl-2 text-gray-500 dark:text-gray-400 text-xs">
                {{ (currentPage - 1) * perPage + index + 1 }}
              </td>

              <td class="py-3.5">
                <div class="flex -space-x-2">
                  <img v-for="(url, i) in item.image_urls.slice(0, 3)" :key="i" :src="getImageUrl(url)"
                    class="w-10 h-10 object-cover rounded-lg border-2 border-white dark:border-gray-900 cursor-pointer hover:scale-110 transition-transform"
                    @click="openDetailModal(item)" @error="onImgError" />
                  <div v-if="item.image_urls.length === 0"
                    class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" class="text-gray-400">
                      <path
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                  </div>
                </div>
              </td>

              <td class="py-3.5">
                <span class="font-mono text-xs text-gray-800 dark:text-white/80">{{ item.grading_code }}</span>
              </td>

              <td class="py-3.5">
                <span v-if="item.grade"
                  :class="[gradeClass(item.grade), 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold']">
                  {{ item.grade }}
                </span>
                <span v-else class="text-gray-400 text-xs">—</span>
              </td>

              <td class="py-3.5">
                <span :class="[
                  item.grading_method === 'AI'
                    ? 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium'
                ]">{{ item.grading_method }}</span>
              </td>

              <td class="py-3.5">
                <div v-if="item.confidence_avg != null" class="flex items-center gap-2">
                  <div class="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div class="h-1.5 rounded-full transition-all" :class="confidenceBarClass(item.confidence_avg)"
                      :style="{ width: (item.confidence_avg * 100) + '%' }"></div>
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-400">
                    {{ (item.confidence_avg * 100).toFixed(1) }}%
                  </span>
                </div>
                <span v-else class="text-gray-400 text-xs">—</span>
              </td>

              <td class="py-3.5">
                <span
                  :class="[statusClass(item.status), 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium']">
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(item.status)"></span>
                  {{ statusLabel(item.status) }}
                </span>
              </td>

              <td class="py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {{ formatDate(item.createdAt) }}
              </td>

              <td class="py-3.5">
                <div class="flex items-center gap-1.5">
                  <button @click="openDetailModal(item)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                    title="Detail">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="1.5" />
                      <path
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        stroke="currentColor" stroke-width="1.5" />
                    </svg>
                  </button>
                  <button @click="openEditModal(item)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-warning-500 hover:bg-warning-50 dark:hover:bg-warning-500/10 transition-colors"
                    title="Edit">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor"
                        stroke-width="1.5" stroke-linecap="round" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor"
                        stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(item)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                    title="Hapus">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredData.length === 0">
              <td colspan="9" class="text-center py-16 text-gray-400 dark:text-gray-500">
                <svg class="mx-auto mb-3 w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm">Tidak ada data grading</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && filteredData.length > 0"
        class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Menampilkan {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredData.length) }}
          dari {{ filteredData.length }} data
        </p>
        <div class="flex items-center gap-1">
          <button @click="currentPage--" :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">←
            Prev</button>
          <button v-for="p in totalPages" :key="p" @click="currentPage = p" :class="[
            currentPage === p ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
            'px-3 py-1.5 rounded-lg text-xs border transition-colors'
          ]">{{ p }}</button>
          <button @click="currentPage++" :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Next
            →</button>
        </div>
      </div>
    </div>

    <!-- MODAL: DETAIL -->
    <Teleport to="body">
      <div v-if="showDetailModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showDetailModal = false">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 class="font-semibold text-gray-800 dark:text-white">Detail Grading</h3>
            <button @click="showDetailModal = false"
              class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
          <div v-if="selectedItem" class="p-6 space-y-5">
            <div v-if="selectedItem.image_urls.length" class="flex flex-wrap gap-2">
              <img v-for="(url, i) in selectedItem.image_urls" :key="i" :src="getImageUrl(url)"
                class="w-28 h-28 object-cover rounded-xl border border-gray-100 dark:border-gray-800"
                @error="onImgError" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-400 mb-1">Kode Grading</p>
                <p class="text-sm font-mono font-medium text-gray-800 dark:text-white">{{ selectedItem.grading_code }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">Grade</p>
                <span v-if="selectedItem.grade"
                  :class="[gradeClass(selectedItem.grade), 'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold']">{{
                    selectedItem.grade }}</span>
                <span v-else class="text-gray-400 text-sm">—</span>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">Metode</p>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ selectedItem.grading_method }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">Status</p>
                <span
                  :class="[statusClass(selectedItem.status), 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium']">
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(selectedItem.status)"></span>
                  {{ statusLabel(selectedItem.status) }}
                </span>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">Confidence</p>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ selectedItem.confidence_avg != null ? (selectedItem.confidence_avg * 100).toFixed(2) + '%' : '—' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">Total Terdeteksi</p>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ selectedItem.total_detected ?? '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">Konsistensi</p>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ selectedItem.consistency ?? '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">Defect</p>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ selectedItem.defect_detected != null ?
                  (selectedItem.defect_detected ? 'Ya' : 'Tidak') : '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">QR Token</p>
                <p class="text-xs font-mono text-gray-500 break-all">{{ selectedItem.qr_token }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">Tanggal</p>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ formatDate(selectedItem.createdAt) }}</p>
              </div>
            </div>
            <div v-if="selectedItem.batch" class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Info Batch</p>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div><span class="text-gray-400 text-xs">Kode: </span><span class="text-gray-700 dark:text-gray-300">{{
                  selectedItem.batch.lot_code }}</span></div>
                <div><span class="text-gray-400 text-xs">Buah: </span><span class="text-gray-700 dark:text-gray-300">{{
                  selectedItem.batch.fruit_type ?? '—' }}</span></div>
              </div>
            </div>
            <div v-if="selectedItem.error_message" class="rounded-xl bg-error-50 dark:bg-error-500/10 p-4">
              <p class="text-xs font-medium text-error-600 dark:text-error-400 mb-1">Pesan Error</p>
              <p class="text-sm text-error-500">{{ selectedItem.error_message }}</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL: CREATE / EDIT -->
    <Teleport to="body">
      <div v-if="showFormModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showFormModal = false">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 class="font-semibold text-gray-800 dark:text-white">{{ isEditing ? 'Edit Grading' : 'Tambah Grading' }}
            </h3>
            <button @click="showFormModal = false"
              class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="submitForm" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Batch ID <span
                  class="text-error-500">*</span></label>
              <input v-model="form.batch_id" type="text" required :disabled="isEditing" placeholder="ID batch..."
                class="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Metode Grading <span
                  class="text-error-500">*</span></label>
              <div class="inline-flex items-center gap-0.5 rounded-xl bg-gray-100 p-1 dark:bg-gray-800 w-full">
                <button type="button" v-for="m in (['AI', 'MANUAL'] as GradingMethod[])" :key="m"
                  @click="form.grading_method = m" :class="[
                    form.grading_method === m ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400',
                    'flex-1 py-2 text-xs font-medium rounded-lg transition-all'
                  ]">{{ m }}</button>
              </div>
            </div>

            <div v-if="form.grading_method === 'MANUAL' || isEditing">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Grade</label>
              <div class="flex items-center gap-2">
                <button type="button" v-for="g in (['A', 'B', 'C', 'REJECT'] as Grade[])" :key="g"
                  @click="form.grade = g" :class="[
                    form.grade === g ? gradeClass(g) + ' ring-2 ring-offset-1 ring-current' : 'border border-gray-200 dark:border-gray-700 text-gray-500',
                    'flex-1 py-2 text-xs font-semibold rounded-xl transition-all'
                  ]">{{ g }}</button>
              </div>
            </div>

            <div v-if="!isEditing">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Foto Buah</label>
              <div
                class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-brand-400 transition-colors"
                @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
                <input ref="fileInputRef" type="file" accept="image/*" multiple class="hidden"
                  @change="handleFileChange" />
                <div v-if="previewImages.length === 0">
                  <svg class="mx-auto mb-2 text-gray-300 dark:text-gray-600" width="32" height="32" fill="none"
                    viewBox="0 0 24 24">
                    <path
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  <p class="text-xs text-gray-400">Klik atau drag foto ke sini</p>
                </div>
                <div v-else class="flex flex-wrap gap-2 justify-center">
                  <div v-for="(src, i) in previewImages" :key="i" class="relative">
                    <img :src="src" class="w-16 h-16 object-cover rounded-lg" />
                    <button type="button" @click.stop="removePreview(i)"
                      class="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" @click="showFormModal = false"
                class="flex-1 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Batal</button>
              <button type="submit" :disabled="formLoading"
                class="flex-1 py-2.5 text-sm rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                <svg v-if="formLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {{ isEditing ? 'Simpan Perubahan' : 'Buat Grading' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL: DELETE CONFIRM -->
    <Teleport to="body">
      <div v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showDeleteModal = false">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div
            class="flex items-center justify-center w-12 h-12 rounded-full bg-error-50 dark:bg-error-500/15 mx-auto mb-4">
            <svg width="22" height="22" fill="none" class="text-error-500" viewBox="0 0 24 24">
              <path
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <h3 class="text-center font-semibold text-gray-800 dark:text-white mb-2">Hapus Grading?</h3>
          <p class="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Data grading <span class="font-mono font-medium text-gray-700 dark:text-gray-300">{{
              itemToDelete?.grading_code }}</span> akan dihapus permanen.
          </p>
          <div class="flex gap-3">
            <button @click="showDeleteModal = false"
              class="flex-1 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Batal</button>
            <button @click="executeDelete" :disabled="deleteLoading"
              class="flex-1 py-2.5 text-sm rounded-xl bg-error-500 text-white font-medium hover:bg-error-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              <svg v-if="deleteLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import type {
  GradingItem,
  GradingForm,
  Grade,
  GradingStatus,
  GradingMethod,
  Toast
} from '@/types/gradingtypes'
import {
  getGradings,
  createGrading,
  updateGrading,
  deleteGrading,
} from '@/services/gradingService'


// ── Toast ─────────────────────────────────────────────────────────────
const toasts = ref<Toast[]>([])
let toastIdCounter = 0

const showToast = (message: string, type: Toast['type'] = 'info') => {
  const id = ++toastIdCounter
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3500)
}

// ── State ─────────────────────────────────────────────────────────────
const gradings = ref<GradingItem[]>([])
const loading = ref(false)
const formLoading = ref(false)
const deleteLoading = ref(false)

// ── Filter ────────────────────────────────────────────────────────────
const search = ref('')
const filterGrade = ref('')
const filterStatus = ref('')
const filterMethod = ref('')
const currentPage = ref(1)
const perPage = 10

const gradeFilterOptions = [
  { value: '', label: 'Semua' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'REJECT', label: 'Reject' },
]
const statusFilterOptions = [
  { value: '', label: 'Semua' },
  { value: 'DONE', label: 'Done' },
  { value: 'PROCESSING', label: 'Proses' },
  { value: 'ERROR', label: 'Error' },
]

const hasActiveFilter = computed(() =>
  !!search.value || !!filterGrade.value || !!filterStatus.value || !!filterMethod.value
)

const filteredData = computed(() =>
  gradings.value.filter(item => {
    const matchSearch = !search.value || item.grading_code.toLowerCase().includes(search.value.toLowerCase())
    const matchGrade = !filterGrade.value || item.grade === filterGrade.value
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    const matchMethod = !filterMethod.value || item.grading_method === filterMethod.value
    return matchSearch && matchGrade && matchStatus && matchMethod
  })
)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / perPage)))
const paginatedData = computed(() =>
  filteredData.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
)

const resetFilters = () => {
  search.value = filterGrade.value = filterStatus.value = filterMethod.value = ''
  currentPage.value = 1
}

// ── Modal state ───────────────────────────────────────────────────────
const showDetailModal = ref(false)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const selectedItem = ref<GradingItem | null>(null)
const itemToDelete = ref<GradingItem | null>(null)
const isEditing = ref(false)

const form = ref<GradingForm>({ batch_id: '', grading_method: 'AI', grade: '' })

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const previewImages = ref<string[]>([])

// ── Helpers ───────────────────────────────────────────────────────────
const getImageUrl = (url: string): string =>
  url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL ?? ''}${url}`

const onImgError = (e: Event) => {
  const el = e.target as HTMLImageElement
  el.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%23F3F4F6"/></svg>'
}

const formatDate = (d: string): string =>
  new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const gradeClass = (grade: Grade): string => ({
  A: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
  B: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  C: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500',
  REJECT: 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500',
}[grade])

const statusClass = (s: GradingStatus): string => ({
  DONE: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
  PROCESSING: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  ERROR: 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500',
}[s] ?? 'bg-gray-100 text-gray-600')

const statusDotClass = (s: GradingStatus): string => ({
  DONE: 'bg-success-500',
  PROCESSING: 'bg-blue-500 animate-pulse',
  ERROR: 'bg-error-500',
}[s] ?? 'bg-gray-400')

const statusLabel = (s: GradingStatus): string =>
  ({ DONE: 'Selesai', PROCESSING: 'Diproses', ERROR: 'Error' }[s] ?? s)

const confidenceBarClass = (v: number): string => {
  // Karena v rentangnya 0.0 - 1.0
  if (v >= 0.8) return 'bg-success-500'; // Hijau jika >= 80%
  if (v >= 0.6) return 'bg-warning-400'; // Kuning jika >= 60%
  return 'bg-error-400';                // Merah jika di bawah itu
}

// ── Fetch ─────────────────────────────────────────────────────────────
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getGradings()
    gradings.value = (Array.isArray(res) ? res : res.data ?? []) as GradingItem[]
  } catch {
    showToast('Gagal memuat data grading', 'error')
  } finally {
    loading.value = false
  }
}

// ── Modal openers ─────────────────────────────────────────────────────
const openDetailModal = (item: GradingItem) => {
  selectedItem.value = item
  showDetailModal.value = true
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = { batch_id: '', grading_method: 'AI', grade: '' }
  selectedFiles.value = []
  previewImages.value = []
  showFormModal.value = true
}

const openEditModal = (item: GradingItem) => {
  isEditing.value = true
  selectedItem.value = item
  form.value = { batch_id: item.batch_id, grading_method: item.grading_method, grade: item.grade ?? '' }
  showFormModal.value = true
}

const confirmDelete = (item: GradingItem) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

// ── File handling ─────────────────────────────────────────────────────
const triggerFileInput = () => fileInputRef.value?.click()

const handleFileChange = (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  addFiles(files)
}

const handleDrop = (e: DragEvent) => {
  const files = Array.from(e.dataTransfer?.files ?? []).filter(f => f.type.startsWith('image/'))
  addFiles(files)
}

const addFiles = (files: File[]) => {
  selectedFiles.value.push(...files)
  files.forEach(f => {
    const reader = new FileReader()
    reader.onload = (ev) => previewImages.value.push(ev.target?.result as string)
    reader.readAsDataURL(f)
  })
}

const removePreview = (index: number) => {
  selectedFiles.value.splice(index, 1)
  previewImages.value.splice(index, 1)
}

// ── Submit ────────────────────────────────────────────────────────────
const submitForm = async () => {
  formLoading.value = true
  try {
    if (isEditing.value && selectedItem.value) {
      const payload: Partial<Pick<GradingItem, 'grade'>> = {}
      if (form.value.grade) payload.grade = form.value.grade as Grade
      await updateGrading(selectedItem.value.id, payload)
      showToast('Grading berhasil diperbarui', 'success')
    } else {
      if (!form.value.batch_id) { showToast('Batch ID wajib diisi', 'error'); return }
      const fd = new FormData()
      fd.append('batch_id', form.value.batch_id)
      fd.append('grading_method', form.value.grading_method)
      if (form.value.grading_method === 'MANUAL' && form.value.grade) fd.append('grade', form.value.grade)
      selectedFiles.value.forEach(f => fd.append('images', f))
      await createGrading(fd)
      showToast(
        form.value.grading_method === 'AI' ? 'Grading dikirim ke AI, sedang diproses...' : 'Grading manual berhasil dibuat',
        'success'
      )
    }
    showFormModal.value = false
    fetchData()
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Terjadi kesalahan'
    showToast(msg, 'error')
  } finally {
    formLoading.value = false
  }
}

// ── Delete ────────────────────────────────────────────────────────────
const executeDelete = async () => {
  if (!itemToDelete.value) return
  deleteLoading.value = true
  try {
    await deleteGrading(itemToDelete.value.id)
    showToast('Grading berhasil dihapus', 'success')
    showDeleteModal.value = false
    gradings.value = gradings.value.filter(g => g.id !== itemToDelete.value!.id)
  } catch {
    showToast('Gagal menghapus grading', 'error')
  } finally {
    deleteLoading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>