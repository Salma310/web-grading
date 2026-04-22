<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Gradings</h3>
      <div class="relative h-fit">
        <DropdownMenu :menu-items="menuItems">
          <template #icon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z" fill="currentColor" />
            </svg>
          </template>
        </DropdownMenu>
      </div>
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
      <div id="chartOne" class="-ml-5 min-w-[650px] xl:min-w-full pl-2">
        <VueApexCharts type="bar" height="180" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import DropdownMenu from '../common/DropdownMenu.vue'
import type { MonthlyTrendItem } from '../../types/dashboardtypes'

export default defineComponent({
  name: 'MonthlySale',
  components: { VueApexCharts, DropdownMenu },
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
  setup(props, { emit }) {
    const menuItems = [{ label: 'Refresh', onClick: () => emit('refresh') }]

    const categories = computed((): string[] => props.trendData.map((d) => d.label))

    const series = computed(() => [
      {
        name: 'Total Grading',
        data: props.trendData.map((d) => d.total),
      },
    ])

    const chartOptions = computed(() => ({
      colors: ['#465fff'],
      chart: {
        fontFamily: 'Outfit, sans-serif',
        type: 'bar',
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '39%',
          borderRadius: 5,
          borderRadiusApplication: 'end',
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 4, colors: ['transparent'] },
      xaxis: {
        categories: categories.value,
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        fontFamily: 'Outfit',
        markers: { radius: 99 },
      },
      yaxis: { title: { text: '' } },
      grid: { yaxis: { lines: { show: true } } },
      fill: { opacity: 1 },
      tooltip: {
        x: { show: false },
        y: { formatter: (val: number) => `${val} grading` },
      },
    }))

    return { menuItems, series, chartOptions }
  },
})
</script>