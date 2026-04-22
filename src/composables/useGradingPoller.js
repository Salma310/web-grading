import { ref, onUnmounted } from 'vue'
import { getGradingStatus } from '@/services/gradingService'

export function useGradingPoller() {
  const pollingStatus  = ref(null)   // null | 'PROCESSING' | 'DONE' | 'ERROR'
  const pollingResult  = ref(null)
  const pollingError   = ref(null)
  let intervalId = null

  const startPolling = (gradingId, onDone, onError) => {
    pollingStatus.value = 'PROCESSING'
    pollingError.value  = null

    intervalId = setInterval(async () => {
      try {
        const res  = await getGradingStatus(gradingId)
        const data = res.data

        if (data.status === 'DONE') {
          clearInterval(intervalId)
          pollingStatus.value = 'DONE'
          pollingResult.value = data
          onDone?.(data)

        } else if (data.status === 'ERROR') {
          clearInterval(intervalId)
          pollingStatus.value = 'ERROR'
          pollingError.value  = data.error_message || 'Foto tidak terdeteksi sebagai jambu'
          onError?.(data.error_message)
        }
        // kalau masih PROCESSING, lanjut poll

      } catch (err) {
        clearInterval(intervalId)
        pollingStatus.value = 'ERROR'
        pollingError.value  = 'Koneksi gagal, coba lagi'
        onError?.(err.message)
      }
    }, 2000)  // poll setiap 2 detik
  }

  const stopPolling = () => clearInterval(intervalId)

  onUnmounted(() => clearInterval(intervalId))

  return { pollingStatus, pollingResult, pollingError, startPolling, stopPolling }
}