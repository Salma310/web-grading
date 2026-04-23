<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="farmer?.name || 'Detail Petani'" />

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

    <!-- Loading -->
    <div v-if="isLoadingFarmer" class="flex items-center justify-center py-20">
      <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>

    <template v-else-if="farmer">

      <!-- ─── Farmer Info Header ─────────────────────────── -->
      <div class="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-bold text-gray-800 dark:text-white">{{ farmer.name }}</h2>
              <span class="font-mono text-sm text-gray-400">{{ farmer.farmer_code }}</span>
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                :class="farmer.is_active
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="farmer.is_active ? 'bg-green-500' : 'bg-gray-400'"></span>
                {{ farmer.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
            <p v-if="farmer.phone" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ farmer.phone }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="openEditFarmerModal"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:border-yellow-300 hover:text-yellow-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              Edit Petani
            </button>
            <button @click="showDeleteFarmerModal = true"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              Hapus Petani
            </button>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-4 dark:border-gray-800">
          <div>
            <p class="text-xs text-gray-400">Alamat</p>
            <p class="mt-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">{{ farmer.address || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Desa / Kecamatan</p>
            <p class="mt-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ farmer.village || '—' }}
              <span v-if="farmer.district" class="text-gray-400"> · {{ farmer.district }}</span>
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Kota</p>
            <p class="mt-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">{{ farmer.city || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Terdaftar</p>
            <p class="mt-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatDate(farmer.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- ─── Land Stats ──────────────────────────────────── -->
      <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Total Lahan</p>
          <p class="mt-2 text-3xl font-bold text-gray-800 dark:text-white">{{ farmer.lands?.length || 0 }}</p>
        </div>
        <div class="rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
          <p class="text-xs font-medium uppercase tracking-wider text-blue-500">Lahan Aktif</p>
          <p class="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{{ activeLands }}</p>
        </div>
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Total Batch</p>
          <p class="mt-2 text-3xl font-bold text-brand-500">{{ farmer.batches?.length || 0 }}</p>
        </div>
      </div>

      <!-- ─── Land Table ──────────────────────────────────── -->
      <div class="rounded-2xl border border-gray-100 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">

        <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 class="text-base font-semibold text-gray-800 dark:text-white">Data Lahan</h3>
            <p class="mt-0.5 text-sm text-gray-400">{{ farmer.lands?.length || 0 }} lahan terdaftar</p>
          </div>
          <button @click="openAddLandModal"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 4.167v11.666M4.167 10h11.666" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            Tambah Lahan
          </button>
        </div>

        <!-- Empty -->
        <div v-if="!farmer.lands || farmer.lands.length === 0" class="flex flex-col items-center justify-center py-14 text-center">
          <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Belum ada lahan</p>
          <p class="mt-1 text-xs text-gray-400">Klik "Tambah Lahan" untuk mulai</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Kode / Nama</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Lokasi</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Luas (Ha)</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Jenis Buah</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="land in farmer.lands" :key="land.id"
                class="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td class="px-6 py-4">
                  <p class="font-medium text-gray-700 dark:text-gray-300">{{ land.land_name || '—' }}</p>
                  <span class="font-mono text-xs text-gray-400">{{ land.land_code }}</span>
                </td>
                <td class="px-6 py-4">
                  <p class="text-gray-600 dark:text-gray-400">{{ land.location || '—' }}</p>
                  <p v-if="land.latitude && land.longitude" class="text-xs text-gray-400 font-mono">
                    {{ land.latitude.toFixed(5) }}, {{ land.longitude.toFixed(5) }}
                  </p>
                </td>
                <td class="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {{ land.area_size != null ? land.area_size : '—' }}
                </td>
                <td class="px-6 py-4">
                  <span v-if="land.fruit_type" class="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                    {{ land.fruit_type }}
                  </span>
                  <span v-else class="text-gray-400 text-xs">—</span>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="land.is_active
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="land.is_active ? 'bg-green-500' : 'bg-gray-400'"></span>
                    {{ land.is_active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openEditLandModal(land)"
                      class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-yellow-300 hover:text-yellow-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      Edit
                    </button>
                    <button @click="openDeleteLandConfirm(land)"
                      class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </template>

    <!-- ─── Edit Farmer Modal ─────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showFarmerModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeFarmerModal"></div>
          <div class="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden">
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-white">Edit Petani</h3>
                <p class="mt-0.5 text-xs text-gray-400 font-mono">{{ farmer?.farmer_code }}</p>
              </div>
              <button @click="closeFarmerModal" class="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="space-y-4 px-6 py-5 max-h-[70vh] overflow-y-auto">
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
              <div v-if="farmerModalError" class="rounded-lg bg-red-50 px-4 py-3 dark:bg-red-900/20">
                <p class="text-sm text-red-600 dark:text-red-400">⚠️ {{ farmerModalError }}</p>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button @click="closeFarmerModal"
                class="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                Batal
              </button>
              <button @click="handleSaveFarmer" :disabled="isSavingFarmer"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60 transition-colors">
                <svg v-if="isSavingFarmer" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ isSavingFarmer ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Land Modal (Add / Edit) ──────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showLandModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeLandModal"></div>
          <div class="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden">
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-white">
                  {{ isEditLand ? 'Edit Lahan' : 'Tambah Lahan' }}
                </h3>
                <p v-if="isEditLand" class="mt-0.5 text-xs text-gray-400 font-mono">{{ selectedLand?.land_code }}</p>
              </div>
              <button @click="closeLandModal" class="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="space-y-4 px-6 py-5 max-h-[70vh] overflow-y-auto">
              <div v-if="!isEditLand">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Kode Lahan <span class="text-red-500">*</span></label>
                <input v-model="landForm.land_code" type="text" placeholder="e.g. LHN-001"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nama Lahan</label>
                <input v-model="landForm.land_name" type="text" placeholder="Nama lahan"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Lokasi</label>
                <input v-model="landForm.location" type="text" placeholder="Deskripsi lokasi"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Latitude</label>
                  <input v-model.number="landForm.latitude" type="number" step="any" placeholder="-7.983908"
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Longitude</label>
                  <input v-model.number="landForm.longitude" type="number" step="any" placeholder="112.621391"
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Luas (Ha)</label>
                  <input v-model.number="landForm.area_size" type="number" step="any" placeholder="0.5"
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Jenis Buah</label>
                  <input v-model="landForm.fruit_type" type="text" placeholder="Mangga, Apel, dll"
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300" />
                </div>
              </div>
              <div v-if="landModalError" class="rounded-lg bg-red-50 px-4 py-3 dark:bg-red-900/20">
                <p class="text-sm text-red-600 dark:text-red-400">⚠️ {{ landModalError }}</p>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button @click="closeLandModal"
                class="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                Batal
              </button>
              <button @click="handleSaveLand" :disabled="isSavingLand"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60 transition-colors">
                <svg v-if="isSavingLand" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ isSavingLand ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Delete Farmer Confirm ─────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteFarmerModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteFarmerModal = false"></div>
          <div class="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl dark:bg-gray-900 p-6 text-center">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-gray-800 dark:text-white">Hapus Petani</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Yakin ingin menghapus <span class="font-medium">{{ farmer?.name }}</span>? Semua data terkait akan ikut terhapus.
            </p>
            <div class="mt-5 flex gap-3">
              <button @click="showDeleteFarmerModal = false"
                class="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                Batal
              </button>
              <button @click="handleDeleteFarmer" :disabled="isDeletingFarmer"
                class="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60 transition-colors">
                <svg v-if="isDeletingFarmer" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ isDeletingFarmer ? 'Menghapus...' : 'Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Delete Land Confirm ───────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteLandModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteLandModal = false"></div>
          <div class="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl dark:bg-gray-900 p-6 text-center">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-gray-800 dark:text-white">Hapus Lahan</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Yakin ingin menghapus lahan <span class="font-mono font-medium">{{ selectedLand?.land_code }}</span>?
            </p>
            <div class="mt-5 flex gap-3">
              <button @click="showDeleteLandModal = false"
                class="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                Batal
              </button>
              <button @click="handleDeleteLand" :disabled="isDeletingLand"
                class="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60 transition-colors">
                <svg v-if="isDeletingLand" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ isDeletingLand ? 'Menghapus...' : 'Hapus' }}
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
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

import type { Farmer, Land,  UpdateFarmerPayload } from '@/types/farmertypes'
import type { CreateLandPayload, UpdateLandPayload } from '@/types/landtypes'
import { getFarmerById, updateFarmer, deleteFarmer } from '@/services/farmerService'
import { createLand, updateLand, deleteLand } from '@/services/landService'

const route = useRoute()
const router = useRouter()
const farmerId = computed(() => route.params.id as string)

const isLoadingFarmer = ref(false)
const farmer = ref<Farmer | null>(null)

const activeLands = computed(() => farmer.value?.lands?.filter(l => l.is_active).length || 0)

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

// ─── Toast ────────────────────────────────────────────────
const toast = reactive({ show: false, type: 'success' as 'success' | 'error', title: '', body: '' })
let toastTimer: ReturnType<typeof setTimeout> | null = null
const showToast = (type: 'success' | 'error', title: string, body = '') => {
  if (toastTimer) clearTimeout(toastTimer)
  Object.assign(toast, { show: true, type, title, body })
  toastTimer = setTimeout(() => { toast.show = false }, 4000)
}
onUnmounted(() => { if (toastTimer) clearTimeout(toastTimer) })

// ─── Edit Farmer Modal ────────────────────────────────────
const showFarmerModal = ref(false)
const isSavingFarmer = ref(false)
const farmerModalError = ref('')
const farmerForm = reactive<UpdateFarmerPayload>({
  name: '', phone: '', address: '', village: '', district: '', city: '',
})

const openEditFarmerModal = () => {
  if (!farmer.value) return
  Object.assign(farmerForm, {
    name: farmer.value.name, phone: farmer.value.phone ?? '',
    address: farmer.value.address ?? '', village: farmer.value.village ?? '',
    district: farmer.value.district ?? '', city: farmer.value.city ?? '',
  })
  farmerModalError.value = ''
  showFarmerModal.value = true
}
const closeFarmerModal = () => { showFarmerModal.value = false; farmerModalError.value = '' }

const handleSaveFarmer = async () => {
  if (!farmerForm.name?.trim()) { farmerModalError.value = 'Nama wajib diisi.'; return }
  isSavingFarmer.value = true; farmerModalError.value = ''
  try {
    await updateFarmer(farmerId.value, { ...farmerForm })
    showToast('success', 'Petani berhasil diperbarui', farmerForm.name)
    closeFarmerModal()
    await loadFarmer()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    farmerModalError.value = e.response?.data?.message || e.message || 'Gagal menyimpan.'
  } finally {
    isSavingFarmer.value = false
  }
}

// ─── Delete Farmer ────────────────────────────────────────
const showDeleteFarmerModal = ref(false)
const isDeletingFarmer = ref(false)

const handleDeleteFarmer = async () => {
  isDeletingFarmer.value = true
  try {
    await deleteFarmer(farmerId.value)
    router.push('/farmer')
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    showToast('error', 'Gagal menghapus', e.response?.data?.message || e.message || '')
    showDeleteFarmerModal.value = false
  } finally {
    isDeletingFarmer.value = false
  }
}

// ─── Land Modal ───────────────────────────────────────────
const showLandModal = ref(false)
const isEditLand = ref(false)
const isSavingLand = ref(false)
const landModalError = ref('')
const selectedLand = ref<Land | null>(null)
const landForm = reactive<CreateLandPayload>({
  farmer_id: '', land_code: '', land_name: '', location: '',
  latitude: undefined, longitude: undefined, area_size: undefined, fruit_type: '',
})

const openAddLandModal = () => {
  isEditLand.value = false
  selectedLand.value = null
  Object.assign(landForm, {
    farmer_id: farmerId.value, land_code: '', land_name: '', location: '',
    latitude: undefined, longitude: undefined, area_size: undefined, fruit_type: '',
  })
  landModalError.value = ''
  showLandModal.value = true
}

const openEditLandModal = (land: Land) => {
  isEditLand.value = true
  selectedLand.value = land
  Object.assign(landForm, {
    farmer_id: farmerId.value, land_code: land.land_code,
    land_name: land.land_name ?? '', location: land.location ?? '',
    latitude: land.latitude, longitude: land.longitude,
    area_size: land.area_size, fruit_type: land.fruit_type ?? '',
  })
  landModalError.value = ''
  showLandModal.value = true
}

const closeLandModal = () => { showLandModal.value = false; landModalError.value = ''; selectedLand.value = null }

const handleSaveLand = async () => {
  if (!isEditLand.value && !landForm.land_code.trim()) { landModalError.value = 'Kode lahan wajib diisi.'; return }
  isSavingLand.value = true; landModalError.value = ''
  try {
    if (isEditLand.value && selectedLand.value) {
      const payload: UpdateLandPayload = {
        land_name: landForm.land_name, location: landForm.location,
        latitude: landForm.latitude, longitude: landForm.longitude,
        area_size: landForm.area_size, fruit_type: landForm.fruit_type,
      }
      await updateLand(selectedLand.value.id, payload)
      showToast('success', 'Lahan berhasil diperbarui', landForm.land_code)
    } else {
      landForm.farmer_id = farmerId.value
      await createLand({ ...landForm })
      showToast('success', 'Lahan berhasil ditambahkan', landForm.land_code)
    }
    closeLandModal()
    await loadFarmer()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    landModalError.value = e.response?.data?.message || e.message || 'Gagal menyimpan.'
  } finally {
    isSavingLand.value = false
  }
}

// ─── Delete Land ──────────────────────────────────────────
const showDeleteLandModal = ref(false)
const isDeletingLand = ref(false)

const openDeleteLandConfirm = (land: Land) => { selectedLand.value = land; showDeleteLandModal.value = true }

const handleDeleteLand = async () => {
  if (!selectedLand.value) return
  isDeletingLand.value = true
  try {
    await deleteLand(selectedLand.value.id)
    showToast('success', 'Lahan berhasil dihapus', selectedLand.value.land_code)
    showDeleteLandModal.value = false
    selectedLand.value = null
    await loadFarmer()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    showToast('error', 'Gagal menghapus', e.response?.data?.message || e.message || '')
  } finally {
    isDeletingLand.value = false
  }
}

// ─── Data ─────────────────────────────────────────────────
const loadFarmer = async () => {
  isLoadingFarmer.value = true
  try { const res = await getFarmerById(farmerId.value); farmer.value = res.data }
  catch (err) { console.error(err) }
  finally { isLoadingFarmer.value = false }
}

onMounted(loadFarmer)
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateY(16px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>