<template>
  <div class="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
    <div class="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
      <div class="w-full">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Tren Grade Buah</h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Distribusi grade A, B, C, dan Reject per bulan (12 bulan terakhir)
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
          <button
            v-for="opt in viewOptions"
            :key="opt.value"
            @click="selectedView = opt.value"
            :class="[
              selectedView === opt.value
                ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
                : 'text-gray-500 dark:text-gray-400',
              'px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 hover:shadow-theme-xs dark:hover:bg-gray-800 dark:hover:text-white',
            ]"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-16">
      <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>

    <div v-else-if="error" class="py-8 text-center text-sm text-error-500">
      Gagal memuat data. <button class="underline" @click="$emit('refresh')">Coba lagi</button>
    </div>

    <div v-else class="max-w-full overflow-x-auto custom-scrollbar">
      <div class="-ml-4 min-w-[1000px] xl:min-w-full pl-2">
        <VueApexCharts type="area" height="310" :options="chartOptions" :series="activeSeries" />
      </div>
    </div>

    <div v-if="!loading && !error" class="mt-4 flex flex-wrap gap-4">
      <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full inline-block" :style="{ backgroundColor: item.color }"></span>
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.label }}</span>
        <span class="text-xs font-medium text-gray-800 dark:text-white/80">{{ item.total }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { PropType } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { MonthlyTrendItem } from '../../types/dashboardtypes'

interface ViewOption {
  value: string
  label: string
}

interface LegendItem {
  label: string
  color: string
  total: number
}

interface SeriesItem {
  name: string
  data: number[]
}

const gradeColors: Record<string, string> = {
  A:      '#22c55e',
  B:      '#3b82f6',
  C:      '#f59e0b',
  REJECT: '#ef4444',
}

export default defineComponent({
  name: 'StatisticsChart',
  components: { VueApexCharts },
  props: {
    trendData: {
      type: Array as PropType<MonthlyTrendItem[]>,
      default: (): MonthlyTrendItem[] => [],
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
    const viewOptions: ViewOption[] = [
      { value: 'all',     label: 'Semua Grade' },
      { value: 'quality', label: 'A & B' },
      { value: 'reject',  label: 'Reject' },
    ]
    const selectedView = ref('all')

    const categories = computed((): string[] => props.trendData.map((d) => d.label))

    const allSeries = computed((): SeriesItem[] => [
      { name: 'Grade A', data: props.trendData.map((d) => d.A) },
      { name: 'Grade B', data: props.trendData.map((d) => d.B) },
      { name: 'Grade C', data: props.trendData.map((d) => d.C) },
      { name: 'Reject',  data: props.trendData.map((d) => d.REJECT) },
    ])

    const activeSeries = computed((): SeriesItem[] => {
      if (selectedView.value === 'quality') return allSeries.value.slice(0, 2)
      if (selectedView.value === 'reject')  return [allSeries.value[3]]
      return allSeries.value
    })

    const legendItems = computed((): LegendItem[] => [
      { label: 'Grade A', color: gradeColors.A,      total: props.trendData.reduce((s, d) => s + d.A,      0) },
      { label: 'Grade B', color: gradeColors.B,      total: props.trendData.reduce((s, d) => s + d.B,      0) },
      { label: 'Grade C', color: gradeColors.C,      total: props.trendData.reduce((s, d) => s + d.C,      0) },
      { label: 'Reject',  color: gradeColors.REJECT, total: props.trendData.reduce((s, d) => s + d.REJECT, 0) },
    ])

    const chartOptions = computed(() => ({
      colors: [gradeColors.A, gradeColors.B, gradeColors.C, gradeColors.REJECT],
      chart: {
        fontFamily: 'Outfit, sans-serif',
        type: 'area',
        toolbar: { show: false },
      },
      fill: {
        type: 'gradient',
        gradient: { opacityFrom: 0.45, opacityTo: 0 },
      },
      stroke: { curve: 'smooth', width: 2 },
      markers: { size: 0 },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: {
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      tooltip: { x: { show: true } },
      xaxis: {
        type: 'category',
        categories: categories.value,
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: { title: { style: { fontSize: '0px' } } },
    }))

    return { viewOptions, selectedView, activeSeries, legendItems, chartOptions }
  },
})
</script>