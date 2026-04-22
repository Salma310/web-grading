<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">

      <div class="col-span-12">
        <ecommerce-metrics :summary="summary" :loading="loadingSummary" />
      </div>

      <div class="col-span-12 xl:col-span-7">
        <monthly-sale
          :trend-data="trendData"
          :loading="loadingTrend"
          :error="errorTrend"
          @refresh="fetchTrend"
        />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-target
          :ai-data="aiData"
          :grading-growth="gradingGrowth"
          :loading="loadingStats"
          @refresh="fetchStats"
        />
      </div>

      <div class="col-span-12">
        <statistics-chart
          :trend-data="trendData"
          :loading="loadingTrend"
          :error="errorTrend"
          @refresh="fetchTrend"
        />
      </div>

      <div class="col-span-12 xl:col-span-5">
        <customer-demographic
          :farmers="topFarmers"
          :loading="loadingFarmers"
          :error="errorFarmers"
          @refresh="fetchTopFarmers"
        />
      </div>
      <div class="col-span-12 xl:col-span-7">
        <recent-orders
          :batches="recentBatches"
          :loading="loadingBatches"
          :error="errorBatches"
          @refresh="fetchRecentBatches"
        />
      </div>

    </div>
  </admin-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlySale from '../components/ecommerce/MonthlySale.vue'
import MonthlyTarget from '../components/ecommerce/MonthlyTarget.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'
import {
  getDashboardSummary,
  getMonthlyTrend,
  getDashboardStats,
  getTopFarmers,
  getRecentBatches,
} from '../services/dashboardService'
import type {
  DashboardSummary,
  MonthlyTrendItem,
  AiConfidenceData,
  TopFarmerItem,
  BatchItem,
} from '../types/dashboardtypes'

export default defineComponent({
  name: 'EcommercePage',
  components: {
    AdminLayout,
    EcommerceMetrics,
    MonthlySale,
    MonthlyTarget,
    StatisticsChart,
    CustomerDemographic,
    RecentOrders,
  },
  setup() {
    // ── Summary ──────────────────────────────────────────────────
    const summary = ref<DashboardSummary | null>(null)
    const loadingSummary = ref(false)

    async function fetchSummary(): Promise<void> {
      loadingSummary.value = true
      try {
        const res = await getDashboardSummary()
        summary.value = res.data.data as DashboardSummary
      } catch (err) {
        console.error('fetchSummary failed', err)
      } finally {
        loadingSummary.value = false
      }
    }

    // ── Monthly Trend ────────────────────────────────────────────
    const trendData = ref<MonthlyTrendItem[]>([])
    const loadingTrend = ref(false)
    const errorTrend = ref(false)

    async function fetchTrend(): Promise<void> {
      loadingTrend.value = true
      errorTrend.value = false
      try {
        const res = await getMonthlyTrend()
        trendData.value = res.data.data as MonthlyTrendItem[]
      } catch (err) {
        console.error('fetchTrend failed', err)
        errorTrend.value = true
      } finally {
        loadingTrend.value = false
      }
    }

    // ── AI Stats ─────────────────────────────────────────────────
    const aiData = ref<AiConfidenceData | null>(null)
    const gradingGrowth = ref(0)
    const loadingStats = ref(false)

    async function fetchStats(): Promise<void> {
  loadingStats.value = true
  try {
    const res = await getDashboardStats()
    console.log('📊 stats response:', res.data.data)  // ← tambah ini
    aiData.value = res.data.data.aiConfidence as AiConfidenceData
    gradingGrowth.value = (res.data.data.summary?.gradings?.growth as number) ?? 0
  } catch (err) {
    console.error('fetchStats failed', err)
  } finally {
    loadingStats.value = false
  }
}

    // ── Top Farmers ──────────────────────────────────────────────
    const topFarmers = ref<TopFarmerItem[]>([])
    const loadingFarmers = ref(false)
    const errorFarmers = ref(false)

    async function fetchTopFarmers(): Promise<void> {
      loadingFarmers.value = true
      errorFarmers.value = false
      try {
        const res = await getTopFarmers(5)
        topFarmers.value = res.data.data as TopFarmerItem[]
      } catch (err) {
        console.error('fetchTopFarmers failed', err)
        errorFarmers.value = true
      } finally {
        loadingFarmers.value = false
      }
    }

    // ── Recent Batches ───────────────────────────────────────────
    const recentBatches = ref<BatchItem[]>([])
    const loadingBatches = ref(false)
    const errorBatches = ref(false)

    async function fetchRecentBatches(): Promise<void> {
      loadingBatches.value = true
      errorBatches.value = false
      try {
        const res = await getRecentBatches(8)
        recentBatches.value = res.data.data as BatchItem[]
      } catch (err) {
        console.error('fetchRecentBatches failed', err)
        errorBatches.value = true
      } finally {
        loadingBatches.value = false
      }
    }

    onMounted(() => {
      fetchSummary()
      fetchTrend()
      fetchStats()
      fetchTopFarmers()
      fetchRecentBatches()
    })

    return {
      summary, loadingSummary,
      trendData, loadingTrend, errorTrend, fetchTrend,
      aiData, gradingGrowth, loadingStats, fetchStats,
      topFarmers, loadingFarmers, errorFarmers, fetchTopFarmers,
      recentBatches, loadingBatches, errorBatches, fetchRecentBatches,
    }
  },
})
</script>