<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
    <div class="flex justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Top Petani</h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Petani dengan Grade A terbanyak bulan ini
        </p>
      </div>
      <button
        @click="$emit('refresh')"
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        title="Refresh"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700" />
        <div class="flex-1 space-y-1">
          <div class="h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-2 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div class="h-3 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>

    <div v-else-if="error" class="py-6 text-center text-sm text-error-500">
      Gagal memuat data. <button class="underline" @click="$emit('refresh')">Coba lagi</button>
    </div>

    <div v-else-if="farmers.length === 0" class="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
      Belum ada data grading Grade A bulan ini.
    </div>

    <div v-else class="space-y-5">
      <div
        v-for="(item, index) in farmers"
        :key="item.farmer.id"
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
              index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
              : index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              : index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
              : 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500',
            ]"
          >
            {{ index + 1 }}
          </div>
          <div>
            <p class="font-semibold text-gray-800 text-theme-sm dark:text-white/90">{{ item.farmer.name }}</p>
            <span class="block text-gray-500 text-theme-xs dark:text-gray-400">{{ item.farmer.farmer_code }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end gap-1">
          <div class="flex w-full max-w-[140px] items-center gap-2">
            <div class="relative block h-2 w-full max-w-[90px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div
                class="absolute left-0 top-0 h-full rounded-sm bg-brand-500"
                :style="{ width: barWidth(item.gradeA) + '%' }"
              ></div>
            </div>
            <p class="text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">{{ item.gradeA }} A</p>
          </div>
          <span class="text-theme-xs text-gray-400 dark:text-gray-500">{{ item.totalGrading }} total grading</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import type { TopFarmerItem } from '../../types/dashboardtypes'

export default defineComponent({
  name: 'CustomerDemographic',
  props: {
    farmers: {
      type: Array as PropType<TopFarmerItem[]>,
      default: (): TopFarmerItem[] => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['refresh'],
  setup(props) {
    const maxGradeA = computed((): number =>
      Math.max(...props.farmers.map((f) => f.gradeA), 1)
    )

    const barWidth = (gradeA: number): number =>
      Math.round((gradeA / maxGradeA.value) * 100)

    return { barWidth }
  },
})
</script>