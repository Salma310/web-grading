<template>
  <div class="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div class="flex justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">AI Confidence</h3>
          <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Rata-rata confidence AI grading bulan ini</p>
        </div>
        <DropdownMenu :menu-items="menuItems">
          <template #icon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z" fill="currentColor" />
            </svg>
          </template>
        </DropdownMenu>
      </div>

      <div class="relative">
        <div v-if="loading" class="flex items-center justify-center h-[195px]">
          <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
        <div v-else class="h-full">
          <div class="radial-bar-chart">
            <VueApexCharts type="radialBar" height="280" :options="chartOptions" :series="series" />
          </div>
        </div>
      </div>

      <div v-if="!loading" class="flex justify-center -mt-2 mb-3">
        <span
          :class="[
            'rounded-full px-3 py-1 text-xs font-medium',
            gradingGrowth >= 0
              ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
              : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500',
          ]"
        >
          {{ gradingGrowth >= 0 ? '+' : '' }}{{ gradingGrowth }}%
        </span>
      </div>

      <p v-if="!loading" class="mx-auto mt-1.5 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
        <template v-if="aiData?.thisMonth?.avg">
          AI confidence {{ aiData.thisMonth.avg }}% dari {{ aiData.thisMonth.count }} grading bulan ini.
        </template>
        <template v-else>Belum ada data AI grading bulan ini.</template>
      </p>
    </div>

    <div class="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
      <div>
        <p class="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Bulan Ini</p>
        <p class="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
          {{ aiData?.thisMonth?.count ?? 0 }}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z" fill="#039855" />
          </svg>
        </p>
      </div>
      <div class="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
      <div>
        <p class="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Bulan Lalu</p>
        <p class="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
          {{ aiData?.lastMonth?.count ?? 0 }}
        </p>
      </div>
      <div class="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
      <div>
        <p class="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Avg Conf.</p>
        <p class="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
          {{ aiData?.thisMonth?.avg ? aiData.thisMonth.avg + '%' : '-' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import DropdownMenu from '../common/DropdownMenu.vue'
import type { AiConfidenceData } from '../../types/dashboardtypes'

export default defineComponent({
  name: 'MonthlyTarget',
  components: { VueApexCharts, DropdownMenu },
  props: {
    aiData: {
      type: Object as PropType<AiConfidenceData | null>,
      default: null,
    },
    gradingGrowth: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const menuItems = [{ label: 'Refresh', onClick: () => emit('refresh') }]

    const series = computed((): number[] => {
      const avg = props.aiData?.thisMonth?.avg
      return [avg ? Math.min(Math.round(avg), 100) : 0]
    })

    const chartOptions = {
      colors: ['#465FFF'],
      chart: {
        fontFamily: 'Outfit, sans-serif',
        sparkline: { enabled: true },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: { size: '80%' },
          track: {
            background: '#E4E7EC',
            strokeWidth: '100%',
            margin: 5,
          },
          dataLabels: {
            name: { show: false },
            value: {
              fontSize: '36px',
              fontWeight: '600',
              offsetY: -10,
              color: '#1D2939',
              formatter: (val: number) => val.toFixed(1) + '%',
            },
          },
        },
      },
      fill: { type: 'solid', colors: ['#465FFF'] },
      stroke: { lineCap: 'round' },
      labels: ['AI Confidence'],
    }

    return { menuItems, series, chartOptions }
  },
})
</script>

<style scoped>
.radial-bar-chart {
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
}
</style>