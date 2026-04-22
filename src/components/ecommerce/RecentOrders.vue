<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
    <div class="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Batch Terbaru</h3>
      <button
        @click="$emit('refresh')"
        class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
      >
        <svg class="stroke-current fill-white dark:fill-gray-800" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Refresh
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-10">
      <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>

    <div v-else-if="error" class="py-6 text-center text-sm text-error-500">
      Gagal memuat data. <button class="underline" @click="$emit('refresh')">Coba lagi</button>
    </div>

    <div v-else class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-t border-gray-100 dark:border-gray-800">
            <th class="py-3 text-left pr-4"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Lot / Petani</p></th>
            <th class="py-3 text-left pr-4"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Lahan</p></th>
            <th class="py-3 text-left pr-4"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Grading</p></th>
            <th class="py-3 text-left pr-4"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Grade A</p></th>
            <th class="py-3 text-left">    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="batch in batches" :key="batch.id" class="border-t border-gray-100 dark:border-gray-800">
            <td class="py-3 whitespace-nowrap pr-4">
              <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">{{ batch.lot_code }}</p>
              <span class="text-gray-500 text-theme-xs dark:text-gray-400">{{ batch.farmer?.name ?? '-' }}</span>
            </td>
            <td class="py-3 whitespace-nowrap pr-4">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ batch.land?.land_name ?? '-' }}</p>
              <span class="text-gray-400 text-theme-xs dark:text-gray-500">{{ batch.land?.land_code ?? '' }}</span>
            </td>
            <td class="py-3 whitespace-nowrap pr-4">
              <p class="text-gray-600 text-theme-sm dark:text-gray-300 font-medium">{{ batch.grading_count }}x</p>
              <span class="text-gray-400 text-theme-xs dark:text-gray-500">{{ batch.total_fruits ?? 0 }} buah</span>
            </td>
            <td class="py-3 whitespace-nowrap pr-4">
              <span class="text-sm font-semibold text-success-600 dark:text-success-400">{{ batch.total_grade_a ?? 0 }}</span>
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-1">
                / B:{{ batch.total_grade_b ?? 0 }} / C:{{ batch.total_grade_c ?? 0 }}
              </span>
            </td>
            <td class="py-3 whitespace-nowrap">
              <span
                :class="{
                  'rounded-full px-2 py-0.5 text-theme-xs font-medium': true,
                  'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500': batch.status === 'CLOSED',
                  'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400': batch.status === 'OPEN',
                  'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400': !['OPEN', 'CLOSED'].includes(batch.status),
                }"
              >
                {{ batch.status }}
              </span>
            </td>
          </tr>
          <tr v-if="batches.length === 0">
            <td colspan="5" class="py-8 text-center text-sm text-gray-400 dark:text-gray-500">Tidak ada data batch.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { BatchItem } from '../../types/dashboardtypes'

export default defineComponent({
  name: 'RecentOrders',
  props: {
    batches: {
      type: Array as PropType<BatchItem[]>,
      default: (): BatchItem[] => [],
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
})
</script>