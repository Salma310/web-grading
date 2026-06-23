<template>
  <div class="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 mb-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Tren Grade Buah</h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Distribusi grade A, B, C, dan Reject per bulan
        </p>
      </div>

      <!-- Grade View Toggle -->
      <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900 self-start">
        <button
          v-for="opt in viewOptions"
          :key="opt.value"
          @click="selectedView = opt.value"
          :class="[
            selectedView === opt.value
              ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
              : 'text-gray-500 dark:text-gray-400',
            'px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white transition-colors',
          ]"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-wrap items-center gap-3 mb-5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
      <!-- Filter Mode Toggle -->
      <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
        <button
          v-for="opt in filterModeOptions"
          :key="opt.value"
          @click="filterMode = opt.value"
          :class="[
            filterMode === opt.value
              ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-700'
              : 'text-gray-500 dark:text-gray-400',
            'px-3 py-1.5 font-medium rounded-md text-xs hover:text-gray-900 dark:hover:text-white transition-colors',
          ]"
        >
          {{ opt.label }}
        </button>
      </div>

      <div class="w-px h-5 bg-gray-200 dark:bg-gray-700"></div>

      <!-- Month Filter -->
      <template v-if="filterMode === 'month'">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">Periode:</span>
          <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
            <button
              v-for="m in monthOptions"
              :key="m"
              @click="selectMonth(m)"
              :class="[
                selectedMonths === m
                  ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-700'
                  : 'text-gray-500 dark:text-gray-400',
                'px-3 py-1.5 font-medium rounded-md text-xs hover:text-gray-900 dark:hover:text-white transition-colors',
              ]"
            >
              {{ m }} Bulan
            </button>
          </div>
        </div>
      </template>

      <!-- Date Range Filter -->
      <template v-if="filterMode === 'range'">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">Dari:</span>
          <input
            type="date"
            v-model="dateFrom"
            :max="dateTo || undefined"
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <span class="text-xs text-gray-400 whitespace-nowrap">Hingga:</span>
          <input
            type="date"
            v-model="dateTo"
            :min="dateFrom || undefined"
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            @click="applyDateRange"
            :disabled="!dateFrom || !dateTo"
            class="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Terapkan
          </button>
        </div>
      </template>

      <!-- Active Filter Badge + Reset -->
      <div v-if="activeFilterLabel" class="ml-auto flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <circle cx="5" cy="5" r="5"/>
          </svg>
          {{ activeFilterLabel }}
        </span>
        <button
          @click="resetAllFilters"
          class="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
          title="Hapus filter"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Hapus Filter
        </button>
      </div>
    </div>

    <!-- Chart -->
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

    <!-- Legend -->
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

interface ViewOption { value: string; label: string }
interface LegendItem { label: string; color: string; total: number }
interface SeriesItem  { name: string; data: number[] }

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
    loading: { type: Boolean, default: false },
    error:   { type: Boolean, default: false },
  },
  emits: ['refresh', 'filter'],
  setup(props, { emit }) {

    // Grade view
    const viewOptions: ViewOption[] = [
      { value: 'all',     label: 'Semua Grade' },
      { value: 'quality', label: 'A & B' },
      { value: 'reject',  label: 'Reject' },
    ]
    const selectedView = ref('all')

    // Filter mode
    const filterModeOptions: { value: 'month' | 'range'; label: string }[] = [
      { value: 'month', label: 'Per Bulan' },
      { value: 'range', label: 'Rentang Tanggal' },
    ]
    const filterMode = ref<'month' | 'range'>('month')

    // Month filter
    const monthOptions   = [3, 6, 12]
    const selectedMonths = ref(12)

    const selectMonth = (m: number) => {
      selectedMonths.value = m
      emit('filter', { mode: 'month', months: m })
    }

    // Date range filter
    const dateFrom          = ref('')
    const dateTo            = ref('')
    const appliedDateFrom   = ref('')
    const appliedDateTo     = ref('')

    const applyDateRange = () => {
      if (!dateFrom.value || !dateTo.value) return
      appliedDateFrom.value = dateFrom.value
      appliedDateTo.value   = dateTo.value
      emit('filter', { mode: 'range', from: dateFrom.value, to: dateTo.value })
    }

    const resetAllFilters = () => {
      dateFrom.value        = ''
      dateTo.value          = ''
      appliedDateFrom.value = ''
      appliedDateTo.value   = ''
      selectedMonths.value  = 12
      filterMode.value      = 'month'
      emit('filter', { mode: 'month', months: 12 })
    }

    // Active filter label
    const activeFilterLabel = computed((): string => {
      if (filterMode.value === 'range' && appliedDateFrom.value && appliedDateTo.value) {
        const fmt = (d: string) =>
          new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
        return `${fmt(appliedDateFrom.value)} – ${fmt(appliedDateTo.value)}`
      }
      if (filterMode.value === 'month' && selectedMonths.value !== 12) {
        return `${selectedMonths.value} Bulan Terakhir`
      }
      return ''
    })

    // Filtered data (client-side)
    const filteredData = computed((): MonthlyTrendItem[] => {
      if (filterMode.value === 'range' && appliedDateFrom.value && appliedDateTo.value) {
        const from = new Date(appliedDateFrom.value).getTime()
        const to   = new Date(appliedDateTo.value).getTime()
        return props.trendData.filter((d) => {
          const t = new Date(d.label).getTime()
          return t >= from && t <= to
        })
      }
      return props.trendData.slice(-selectedMonths.value)
    })

    // Series
    const categories = computed(() => filteredData.value.map((d) => d.label))

    const allSeries = computed((): SeriesItem[] => [
      { name: 'Grade A', data: filteredData.value.map((d) => d.A) },
      { name: 'Grade B', data: filteredData.value.map((d) => d.B) },
      { name: 'Grade C', data: filteredData.value.map((d) => d.C) },
      { name: 'Reject',  data: filteredData.value.map((d) => d.REJECT) },
    ])

    const activeSeries = computed((): SeriesItem[] => {
      if (selectedView.value === 'quality') return allSeries.value.slice(0, 2)
      if (selectedView.value === 'reject')  return [allSeries.value[3]]
      return allSeries.value
    })

    const legendItems = computed((): LegendItem[] => [
      { label: 'Grade A', color: gradeColors.A,      total: filteredData.value.reduce((s, d) => s + d.A,      0) },
      { label: 'Grade B', color: gradeColors.B,      total: filteredData.value.reduce((s, d) => s + d.B,      0) },
      { label: 'Grade C', color: gradeColors.C,      total: filteredData.value.reduce((s, d) => s + d.C,      0) },
      { label: 'Reject',  color: gradeColors.REJECT, total: filteredData.value.reduce((s, d) => s + d.REJECT, 0) },
    ])

    const chartOptions = computed(() => ({
      colors: [gradeColors.A, gradeColors.B, gradeColors.C, gradeColors.REJECT],
      chart: { fontFamily: 'Outfit, sans-serif', type: 'area', toolbar: { show: false } },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.45, opacityTo: 0 } },
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

    return {
      viewOptions, selectedView,
      filterModeOptions, filterMode,
      monthOptions, selectedMonths, selectMonth,
      dateFrom, dateTo, applyDateRange, resetAllFilters,
      activeFilterLabel,
      activeSeries, legendItems, chartOptions,
    }
  },
})
</script>