<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">

        <!-- LEFT COLUMN -->
        <div class="space-y-6">

          <!-- Informasi Batch -->
          <ComponentCard title="Informasi Batch">
            <div class="space-y-5">

              <!-- Kode Batch (auto-generate info) -->
              <div class="rounded-lg bg-blue-50 px-4 py-3 dark:bg-blue-900/20">
                <p class="text-xs text-blue-600 dark:text-blue-400">
                  💡 Kode batch akan di-generate otomatis setelah form disimpan
                  berdasarkan kode lahan dan tanggal panen.
                </p>
              </div>

              <!-- Jenis Buah -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Jenis Buah <span class="text-error-500">*</span>
                </label>
                <div class="relative z-20 bg-transparent">
                  <select
                    v-model="form.fruit_type"
                    required
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800"
                    :class="form.fruit_type ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-white/30'"
                  >
                    <option value="" disabled selected>Pilih Jenis Buah</option>
                    <option value="Jambu Kristal">Jambu Kristal</option>
                  </select>
                  <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                    <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>

              <!-- Berat Panen -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Berat Panen (kg)
                </label>
                <input
                  type="number"
                  v-model="form.harvest_weight"
                  placeholder="Contoh: 50.5"
                  min="0"
                  step="0.1"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

            </div>
          </ComponentCard>

          <!-- Waktu Panen -->
          <ComponentCard title="Waktu Panen">
            <div class="space-y-5">

              <!-- Tanggal Panen -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Tanggal Panen <span class="text-error-500">*</span>
                </label>
                <div class="relative">
                  <flat-pickr
                    v-model="form.harvest_date"
                    :config="dateConfig"
                    placeholder="Pilih tanggal panen"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z" fill=""/>
                    </svg>
                  </span>
                </div>
              </div>

              <!-- Jam Panen -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Jam Panen <span class="text-error-500">*</span>
                </label>
                <div class="relative">
                  <flat-pickr
                    v-model="form.harvest_time"
                    :config="timeConfig"
                    placeholder="Pilih jam panen"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.04175 9.99984C3.04175 6.15686 6.1571 3.0415 10.0001 3.0415C13.8431 3.0415 16.9584 6.15686 16.9584 9.99984C16.9584 13.8428 13.8431 16.9582 10.0001 16.9582C6.1571 16.9582 3.04175 13.8428 3.04175 9.99984ZM10.0001 1.5415C5.32867 1.5415 1.54175 5.32843 1.54175 9.99984C1.54175 14.6712 5.32867 18.4582 10.0001 18.4582C14.6715 18.4582 18.4584 14.6712 18.4584 9.99984C18.4584 5.32843 14.6715 1.5415 10.0001 1.5415ZM9.99998 10.7498C9.58577 10.7498 9.24998 10.4141 9.24998 9.99984V5.4165C9.24998 5.00229 9.58577 4.6665 9.99998 4.6665C10.4142 4.6665 10.75 5.00229 10.75 5.4165V9.24984H13.3334C13.7476 9.24984 14.0834 9.58562 14.0834 9.99984C14.0834 10.4141 13.7476 10.7498 13.3334 10.7498H10.0001H9.99998Z" fill=""/>
                    </svg>
                  </span>
                </div>
              </div>

            </div>
          </ComponentCard>

        </div>

        <!-- RIGHT COLUMN -->
        <div class="space-y-6">

          <!-- Petani & Lahan -->
          <ComponentCard title="Petani & Lahan">
            <div class="space-y-5">

              <!-- Loading state -->
              <div v-if="isLoadingData" class="flex items-center justify-center py-6">
                <svg class="animate-spin h-5 w-5 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span class="ml-2 text-sm text-gray-500">Memuat data...</span>
              </div>

              <template v-else>
                <!-- Pilih Petani -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Petani <span class="text-error-500">*</span>
                  </label>
                  <div class="relative z-20 bg-transparent">
                    <select
                      v-model="form.farmer_id"
                      required
                      @change="onFarmerChange"
                      class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800"
                      :class="form.farmer_id ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-white/30'"
                    >
                      <option value="" disabled selected>Pilih Petani</option>
                      <option v-for="farmer in farmers" :key="farmer.id" :value="farmer.id">
                        {{ farmer.farmer_code }} — {{ farmer.name }} ({{ farmer.district }}, {{ farmer.city }})
                      </option>
                    </select>
                    <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                      <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                  </div>
                  <div v-if="selectedFarmer" class="mt-2 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800">
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      📍 {{ [selectedFarmer.address, selectedFarmer.village, selectedFarmer.district, selectedFarmer.city].filter(Boolean).join(', ') }}
                    </p>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      📞 {{ selectedFarmer.phone || '-' }}
                    </p>
                  </div>
                </div>

                <!-- Pilih Lahan -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Lahan <span class="text-error-500">*</span>
                  </label>
                  <div class="relative z-10 bg-transparent">
                    <select
                      v-model="form.land_id"
                      required
                      :disabled="!form.farmer_id || filteredLands.length === 0"
                      class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
                      :class="form.land_id ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-white/30'"
                    >
                      <option value="" disabled selected>
                        {{ !form.farmer_id ? 'Pilih petani dulu' : filteredLands.length === 0 ? 'Tidak ada lahan tersedia' : 'Pilih Lahan' }}
                      </option>
                      <option v-for="land in filteredLands" :key="land.id" :value="land.id">
                        {{ land.land_code }} — {{ land.land_name }} ({{ land.location }}, {{ land.area_size }} ha)
                      </option>
                    </select>
                    <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                      <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                  </div>
                  <div v-if="selectedLand" class="mt-2 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800">
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      🌿 Jenis buah: <span class="font-medium">{{ selectedLand.fruit_type || '-' }}</span>
                    </p>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      📐 Luas lahan: <span class="font-medium">{{ selectedLand.area_size }} ha</span>
                    </p>
                  </div>
                </div>
              </template>

            </div>
          </ComponentCard>

          <!-- Perlakuan & Catatan -->
          <ComponentCard title="Perlakuan & Catatan">
            <div class="space-y-5">

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Perlakuan Pasca Panen
                </label>
                <div class="relative z-20 bg-transparent">
                  <select
                    v-model="form.treatment"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800"
                    :class="form.treatment ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-white/30'"
                  >
                    <option value="" disabled selected>Pilih Perlakuan</option>
                    <option value="Tanpa perlakuan">Tanpa perlakuan</option>
                    <option value="Sortir">Sortir</option>
                    <option value="Cuci">Cuci</option>
                    <option value="Sortir + cuci">Sortir + cuci</option>
                    <option value="Sortir + cuci + waxing">Sortir + cuci + waxing</option>
                    <option value="Pendinginan">Pendinginan</option>
                    <option value="Sortir + pendinginan">Sortir + pendinginan</option>
                  </select>
                  <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                    <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Catatan
                </label>
                <textarea
                  v-model="form.notes"
                  rows="4"
                  placeholder="Catatan tambahan tentang batch ini..."
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                ></textarea>
              </div>

            </div>
          </ComponentCard>

          <!-- Error -->
          <div v-if="errorMsg" class="rounded-lg bg-red-50 px-4 py-3 dark:bg-red-900/20">
            <p class="text-sm text-red-600 dark:text-red-400">⚠️ {{ errorMsg }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3">
            <button
              type="button"
              @click="handleReset"
              class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
            >
              Reset
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || isLoadingData"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ isSubmitting ? 'Menyimpan...' : 'Buat Batch' }}
            </button>
          </div>

        </div>
      </div>
    </form>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

// ✅ Semua API call lewat service
import { getFarmers } from '@/services/farmerService'
import { getLands } from '@/services/landService'
import { createBatch } from '@/services/batchService'

const router = useRouter()
const currentPageTitle = ref('Tambah Batch')

// ─── State ────────────────────────────────────────────────
const isSubmitting = ref(false)
const isLoadingData = ref(false)
const errorMsg = ref('')
const farmers = ref([])
const lands = ref([])

const form = reactive({
  fruit_type: '',
  harvest_weight: null,
  harvest_date: null,
  harvest_time: null,
  farmer_id: '',
  land_id: '',
  treatment: '',
  notes: '',
})

// ─── Computed ─────────────────────────────────────────────
const selectedFarmer = computed(() =>
  farmers.value.find(f => f.id === form.farmer_id) || null
)

const selectedLand = computed(() =>
  lands.value.find(l => l.id === form.land_id) || null
)

// Lahan difilter client-side by farmer_id — tidak perlu request ulang ke API
const filteredLands = computed(() =>
  form.farmer_id
    ? lands.value.filter(l => l.farmer_id === form.farmer_id && l.is_active)
    : []
)

// ─── Flatpickr Config ─────────────────────────────────────
const dateConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'j F Y',
  maxDate: 'today',
}

const timeConfig = {
  enableTime: true,
  noCalendar: true,
  dateFormat: 'H:i',
  time_24hr: true,
  minuteIncrement: 5,
}

// ─── Methods ──────────────────────────────────────────────
const onFarmerChange = () => {
  form.land_id = ''
}

const loadData = async () => {
  isLoadingData.value = true
  errorMsg.value = ''
  try {
    // Promise.all → fetch paralel, lebih cepat dari await satu-satu
    const [farmersRes, landsRes] = await Promise.all([
      getFarmers(),
      getLands(),
    ])
    farmers.value = farmersRes.data
    lands.value = landsRes.data
  } catch (err) {
    errorMsg.value = 'Gagal memuat data petani/lahan. Coba refresh halaman.'
    console.error(err)
  } finally {
    isLoadingData.value = false
  }
}

const handleSubmit = async () => {
  errorMsg.value = ''

  // flatpickr tidak support HTML required, validasi manual
  if (!form.harvest_date || !form.harvest_time) {
    errorMsg.value = 'Tanggal dan jam panen wajib diisi.'
    return
  }

  isSubmitting.value = true
  try {
    const harvestDateTime = new Date(`${form.harvest_date}T${form.harvest_time}:00`).toISOString()

    const payload = {
      farmer_id: form.farmer_id,
      land_id: form.land_id,
      fruit_type: form.fruit_type,
      harvest_date: harvestDateTime,
      harvest_time: harvestDateTime,
      harvest_weight: form.harvest_weight ? parseFloat(form.harvest_weight) : null,
      treatment: form.treatment || null,
      notes: form.notes || null,
    }

    await createBatch(payload)
    router.push('/batches')
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message || 'Gagal membuat batch.'
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

const handleReset = () => {
  Object.assign(form, {
    fruit_type: '',
    harvest_weight: null,
    harvest_date: null,
    harvest_time: null,
    farmer_id: '',
    land_id: '',
    treatment: '',
    notes: '',
  })
  errorMsg.value = ''
}

// ─── Lifecycle ────────────────────────────────────────────
onMounted(loadData)
</script>