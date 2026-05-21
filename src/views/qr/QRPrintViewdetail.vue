<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Print QR Sticker" />

    <div class="print:hidden space-y-5">

      <div v-if="isLoadingBundle"
        class="flex items-center justify-center rounded-2xl border border-gray-100 bg-white p-16 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <svg class="animate-spin h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span class="ml-3 text-sm text-gray-400">Memuat data bundle…</span>
      </div>

      <div v-else-if="loadError"
        class="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-white p-16 shadow-theme-xs dark:border-red-900/30 dark:bg-gray-900 gap-3 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Gagal memuat bundle</p>
        <p class="text-xs text-gray-400">{{ loadError }}</p>
      </div>

      <template v-else-if="bundleData">

        <!-- Header card -->
        <div
          class="rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold"
                  :class="gradeBadgeClass(bundleData.grade)">
                  {{ bundleData.grade === 'REJECT' ? 'R' : bundleData.grade }}
                </span>
                <div>
                  <p class="text-lg font-bold text-gray-800 dark:text-white">
                    Grade {{ bundleData.grade }} · {{ bundleData.batch?.lot_code ?? '—' }}
                  </p>
                  <p class="text-sm text-gray-400">
                    {{ bundleData.farmer_name ?? bundleData.batch?.farmer?.name ?? '—' }}
                    <span v-if="bundleData.origin_village"> · {{ bundleData.origin_village }}</span>
                  </p>
                </div>
              </div>
              <div class="flex flex-wrap gap-4">
                <div class="flex flex-col">
                  <span class="text-xs text-gray-400 uppercase tracking-wider">Total Buah</span>
                  <span class="text-2xl font-bold text-gray-800 dark:text-white">{{ bundleData.total_fruits }}</span>
                </div>
                <div class="w-px bg-gray-100 dark:bg-gray-800 self-stretch hidden sm:block"></div>
                <div class="flex flex-col">
                  <span class="text-xs text-gray-400 uppercase tracking-wider">QR Diproses</span>
                  <span class="text-2xl font-bold"
                    :class="compositeUrls.length === bundleData.total_fruits ? 'text-green-500' : 'text-yellow-500'">
                    {{ compositeUrls.length }}
                  </span>
                </div>
                <div class="w-px bg-gray-100 dark:bg-gray-800 self-stretch hidden sm:block"></div>
                <div class="flex flex-col">
                  <span class="text-xs text-gray-400 uppercase tracking-wider">Jumlah Halaman</span>
                  <span class="text-2xl font-bold text-gray-800 dark:text-white">{{ pages.length || '—' }}</span>
                </div>
                <div class="w-px bg-gray-100 dark:bg-gray-800 self-stretch hidden sm:block"></div>
                <div class="flex flex-col">
                  <span class="text-xs text-gray-400 uppercase tracking-wider">Per Halaman</span>
                  <span class="text-2xl font-bold text-gray-800 dark:text-white">{{ QR_PER_PAGE }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <button @click="generateAll" :disabled="isGenerating"
                class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <svg v-if="isGenerating" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
                {{ isGenerating ? 'Memproses…' : 'Muat Ulang QR' }}
              </button>

              <button @click="doPrint" :disabled="!isReady || isGenerating"
                class="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7V4h10v3M5 16H3a1 1 0 01-1-1V9a1 1 0 011-1h14a1 1 0 01-1 1h-2M5 12h10v4H5v-4z"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Print Sticker ({{ bundleData.total_fruits }} pcs)
              </button>
            </div>
          </div>

          <div v-if="isGenerating" class="mt-4">
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Membuat QR + logo + badge…</span>
              <span>{{ generatedCount }} / {{ bundleData.total_fruits }}</span>
            </div>
            <div class="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div class="h-full rounded-full bg-brand-500 transition-all duration-300"
                :style="{ width: `${(generatedCount / bundleData.total_fruits) * 100}%` }">
              </div>
            </div>
          </div>

          <div v-if="!isReady && !isGenerating"
            class="mt-4 flex items-center gap-2 rounded-xl bg-yellow-50 border border-yellow-100 px-4 py-3 text-sm text-yellow-700 dark:bg-yellow-900/10 dark:border-yellow-900/30 dark:text-yellow-400">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" class="shrink-0">
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 4v4m0 4h.01" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" />
            </svg>
            Mengambil dan memproses gambar QR, mohon tunggu…
          </div>
        </div>

        <!-- ── Preview section ── -->
        <div v-if="isReady"
          class="rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p class="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Preview — {{ QR_COLS }}×{{ QR_ROWS }} per halaman · QR {{ QR_SIZE_MM }}×{{ QR_SIZE_MM }} mm · Gap {{ GAP_MM
            }} mm · Kertas {{ PAPER_W_MM / 10 }}×{{ PAPER_H_MM / 10 }} cm
          </p>
          <div class="flex flex-wrap gap-6">
            <div v-for="(page, pi) in pages" :key="pi"
              class="flex-shrink-0 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-3">
              <p class="mb-2 text-center text-xs text-gray-400">Hal. {{ pi + 1 }}</p>

              <!-- Paper container -->
              <div class="relative bg-white shadow-sm overflow-hidden" :style="{
                width: `${PAPER_W_MM * PREVIEW_SCALE}px`,
                height: `${PAPER_H_MM * PREVIEW_SCALE}px`
              }">
                <!-- QR cells -->
                <div v-for="(qr, qi) in page" :key="qi" class="absolute overflow-hidden" :style="qrPreviewStyle(qi)">
                  <img :src="qr.img" class="block w-full"
                    :style="{ height: `${QR_SIZE_MM * PREVIEW_SCALE}px`, objectFit: 'fill' }" />
                  <!-- Label teks di bawah QR -->
                  <div class="flex flex-col items-center justify-center bg-white"
                    :style="{ height: `${LABEL_H_MM * PREVIEW_SCALE}px`, lineHeight: '1.1' }">
                    <span
                      :style="{ fontSize: `${PREVIEW_SCALE * 1.2}px`, color: '#888', fontStyle: 'italic', fontFamily: 'Arial, sans-serif' }">·
                      Produk Olahan ·</span>
                    <span
                      :style="{ fontSize: `${PREVIEW_SCALE * 1.5}px`, color: '#555', letterSpacing: '0.3px', fontWeight: '600', fontFamily: 'Arial, sans-serif' }">PT
                      KREASI TANI</span>
                    <span
                      :style="{ fontSize: `${PREVIEW_SCALE * 2}px`, color: '#e8b84b', letterSpacing: '1px', fontWeight: '700', fontFamily: 'Georgia, serif' }">BUMIAJI</span>
                  </div>
                </div>

                <!-- Garis gunting vertikal (antara setiap kolom) -->
                <template v-for="c in QR_COLS - 1" :key="`cv-${c}`">
                  <div class="absolute pointer-events-none" :style="{
                    left: `${(MARGIN_H_MM + c * (QR_SIZE_MM + GAP_MM) - GAP_MM / 2) * PREVIEW_SCALE}px`,
                    top: `${MARGIN_V_MM * PREVIEW_SCALE}px`,
                    bottom: `${MARGIN_V_MM * PREVIEW_SCALE}px`,
                    width: '0px',
                    borderLeft: '1px dashed #9ca3af'
                  }">
                    <span class="absolute text-gray-400 select-none"
                      :style="{ fontSize: `${3 * PREVIEW_SCALE}px`, top: '-2px', left: '-7px' }">✂</span>
                  </div>
                </template>

                <!-- Garis gunting horizontal (antara setiap baris) -->
                <template v-for="r in QR_ROWS - 1" :key="`ch-${r}`">
                  <div class="absolute pointer-events-none" :style="{
                    top: `${(MARGIN_V_MM + r * (CELL_H_MM + GAP_MM) - GAP_MM / 2) * PREVIEW_SCALE}px`,
                    left: `${MARGIN_H_MM * PREVIEW_SCALE}px`,
                    right: `${MARGIN_H_MM * PREVIEW_SCALE}px`,
                    height: '0px',
                    borderTop: '1px dashed #9ca3af'
                  }">
                    <span class="absolute text-gray-400 select-none"
                      :style="{ fontSize: `${3 * PREVIEW_SCALE}px`, top: '-7px', left: '-4px' }">✂</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AdminLayout>

  <!-- ── PRINT AREA (Teleport) ── -->
  <Teleport to="body">
    <div class="print-area" style="display:none">
      <div v-for="(page, pi) in pages" :key="pi" class="thermal-page">
        <!-- Garis potong vertikal -->
        <template v-for="c in QR_COLS - 1" :key="`pv-${c}`">
          <div class="cut-v" :style="{ left: `${MARGIN_H_MM + c * (QR_SIZE_MM + GAP_MM) - GAP_MM / 2}mm` }"></div>
        </template>
        <!-- Garis potong horizontal -->
        <template v-for="r in QR_ROWS - 1" :key="`ph-${r}`">
          <div class="cut-h" :style="{ top: `${MARGIN_V_MM + r * (CELL_H_MM + GAP_MM) - GAP_MM / 2}mm` }"></div>
        </template>
        <!-- QR cells -->
        <div v-for="(qr, qi) in page" :key="qi" class="qr-cell">
          <img :src="qr.img" class="qr-img" alt="" />
          <div class="qr-label">
            <span class="label-company">PT KREASI TANI</span>
            <span class="label-brand">BUMIAJI</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import logoUrl from '../../../public/images/qr/bumiaji.png'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { getQRDetail, getQRImage, markAsPrinted } from '@/services/qrService'

// ── Design constants ──────────────────────────────────────────────────────────
const ACCENT_COLOR = '#e8b84b'
const BORDER_COLOR = '#1a1a2e'
const BORDER_WIDTH = 6        // px pada canvas
const BORDER_RADIUS = 16       // px pada canvas
const LOGO_SIZE = 40       // px pada canvas (lebih kecil karena QR kecil)

// ── Layout config (semua dalam mm) ───────────────────────────────────────────
// Kertas 100×80 mm, QR 20×20 mm, 3 kolom × 2 baris, gap 4 mm
const PAPER_W_MM = 100
const PAPER_H_MM = 80
const GAP_MM = 4
const QR_COLS = 3
const QR_ROWS = 2
const QR_PER_PAGE = QR_COLS * QR_ROWS   // = 6

const QR_SIZE_MM = 20   // lebar & tinggi area QR saja
const LABEL_H_MM = 5.5    // tinggi teks di bawah QR (di luar box QR)
const CELL_W_MM = QR_SIZE_MM          // lebar cell = lebar QR
const CELL_H_MM = QR_SIZE_MM + LABEL_H_MM  // tinggi cell = QR + label = 25 mm

// Total grid = 3*20 + 2*4 = 68 mm wide, 2*25 + 1*4 = 54 mm tall
// Margin: horizontal = (100-68)/2 = 16 mm, vertikal = (80-54)/2 = 13 mm
const MARGIN_H_MM = (PAPER_W_MM - QR_COLS * CELL_W_MM - (QR_COLS - 1) * GAP_MM) / 2   // 16 mm
const MARGIN_V_MM = (PAPER_H_MM - QR_ROWS * CELL_H_MM - (QR_ROWS - 1) * GAP_MM) / 2   // 13 mm

const PREVIEW_SCALE = 3.2   // px per mm untuk preview layar

// ── Canvas QR size (pixel) ───────────────────────────────────────────────────
// Render resolusi tinggi: 1 mm ≈ 11.8 px pada 300 dpi
// QR 20 mm → canvas 240 px (cukup untuk scan)
const CANVAS_QR_PX = 240

// ── Reactive state ────────────────────────────────────────────────────────────
interface QREntry { img: string }

interface BundleType {
  id: string
  grade: 'A' | 'B' | 'C' | 'REJECT'
  total_fruits: number
  total_weight?: number | null
  fruit_type?: string | null
  harvest_date?: string | null
  farmer_name?: string | null
  origin_village?: string | null
  origin_city?: string | null
  qr_token: string
  qr_url?: string | null
  qr_image_path?: string | null
  qr_is_active: boolean
  print_status: 'NOT_PRINTED' | 'PRINTED' | 'REPRINTED'
  print_count: number
  batch?: {
    lot_code: string
    fruit_type?: string | null
    harvest_date?: string | null
    farmer?: { name: string; city?: string | null } | null
    land?: { location?: string | null } | null
  } | null
}

const route = useRoute()
const bundleData = ref<BundleType | null>(null)
const isLoadingBundle = ref(false)
const loadError = ref<string | null>(null)
const compositeUrls = ref<QREntry[]>([])
const isGenerating = ref(false)
const generatedCount = ref(0)

const isReady = computed(() =>
  compositeUrls.value.length > 0 && bundleData.value !== null
)

const pages = computed(() => {
  const result: QREntry[][] = []
  const valid = compositeUrls.value.filter(e => e.img)
  for (let i = 0; i < valid.length; i += QR_PER_PAGE) {
    result.push(valid.slice(i, i + QR_PER_PAGE))
  }
  return result
})

// ── Helpers ───────────────────────────────────────────────────────────────────
const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

// ── Canvas composite: hanya QR + border + logo tengah
//    Teks label PT KREASI TANI / BUMIAJI di-render via HTML (di luar canvas)
const compositeQR = (
  qrBase64: string,
  logoImg: HTMLImageElement
): Promise<string> =>
  new Promise((resolve, reject) => {
    const qrImg = new Image()
    qrImg.onload = () => {
      const sz = CANVAS_QR_PX
      const bw = BORDER_WIDTH
      const br = BORDER_RADIUS

      const canvas = document.createElement('canvas')
      canvas.width = sz
      canvas.height = sz
      const ctx = canvas.getContext('2d')!

      // Background putih
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, sz, sz)

      const drawRR = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + r)
        ctx.lineTo(x + w, y + h - r)
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        ctx.lineTo(x + r, y + h)
        ctx.quadraticCurveTo(x, y + h, x, y + h - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()
      }

      // Outer border
      ctx.fillStyle = BORDER_COLOR
      drawRR(0, 0, sz, sz, br)
      ctx.fill()

      // Inner white
      ctx.fillStyle = '#ffffff'
      drawRR(bw, bw, sz - bw * 2, sz - bw * 2, br - bw)
      ctx.fill()

      // Clip & gambar QR
      ctx.save()
      drawRR(bw, bw, sz - bw * 2, sz - bw * 2, br - bw)
      ctx.clip()
      ctx.drawImage(qrImg, bw, bw, sz - bw * 2, sz - bw * 2)
      ctx.restore()

      // Kotak putih di belakang logo
      const logoPad = 5
      const logoBox = LOGO_SIZE + logoPad * 2
      const lbx = (sz - logoBox) / 2
      const lby = (sz - logoBox) / 2

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(lbx, lby, logoBox, logoBox, 8)
      ctx.fill()

      // Logo di tengah QR
      const lx = (sz - LOGO_SIZE) / 2
      const ly = (sz - LOGO_SIZE) / 2
      ctx.drawImage(logoImg, lx, ly, LOGO_SIZE, LOGO_SIZE)

      resolve(canvas.toDataURL('image/png'))
    }
    qrImg.onerror = reject
    qrImg.src = qrBase64
  })

// ── Fetch + komposit semua QR ─────────────────────────────────────────────────
const fetchAndComposite = async (token: string) => {
  if (!bundleData.value) return
  isGenerating.value = true
  generatedCount.value = 0
  compositeUrls.value = []

  try {
    const res = await getQRImage(token)
    const imagePath = res.data.image_url as string

    const imgRes = await fetch(imagePath)
    if (!imgRes.ok) throw new Error(`Gagal fetch gambar: ${imgRes.status}`)
    const blob = await imgRes.blob()
    const qrBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })

    const logoImg = await loadImage(logoUrl as string)
    const total = bundleData.value.total_fruits
    const results: QREntry[] = []

    for (let i = 0; i < total; i++) {
      const img = await compositeQR(qrBase64, logoImg)
      results.push({ img })
      generatedCount.value = i + 1
    }

    compositeUrls.value = results
  } catch (e: any) {
    loadError.value = e?.message ?? 'Gagal memproses gambar QR.'
  } finally {
    isGenerating.value = false
  }
}

onMounted(async () => {
  const token = route.params.token as string
  if (!token) { loadError.value = 'Token tidak ditemukan di URL.'; return }

  isLoadingBundle.value = true
  loadError.value = null
  try {
    const res = await getQRDetail(token)
    bundleData.value = res.data
    await fetchAndComposite(token)
  } catch (e: any) {
    loadError.value = e?.response?.data?.message ?? e?.message ?? 'Terjadi kesalahan.'
  } finally {
    isLoadingBundle.value = false
  }
})

const generateAll = async () => {
  if (!bundleData.value) return
  await fetchAndComposite(bundleData.value.qr_token)
}

// ── Preview: posisi cell dalam px ────────────────────────────────────────────
function qrPreviewStyle(index: number) {
  const col = index % QR_COLS
  const row = Math.floor(index / QR_COLS)
  return {
    left: `${(MARGIN_H_MM + col * (CELL_W_MM + GAP_MM)) * PREVIEW_SCALE}px`,
    top: `${(MARGIN_V_MM + row * (CELL_H_MM + GAP_MM)) * PREVIEW_SCALE}px`,
    width: `${CELL_W_MM * PREVIEW_SCALE}px`,
    height: `${CELL_H_MM * PREVIEW_SCALE}px`,
  }
}

// ── Print ─────────────────────────────────────────────────────────────────────
const doPrint = async () => {
  if (!isReady.value || !bundleData.value) return

  try {
    await markAsPrinted(bundleData.value.qr_token, '')
  } catch (e) {
    console.warn('markAsPrinted failed:', e)
  }

  const styleId = 'print-style-inject'
  let styleEl = document.getElementById(styleId) as HTMLStyleElement
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = styleId
    document.head.appendChild(styleEl)
  }

  const qrMM = QR_SIZE_MM.toFixed(4)
  const cellHmm = CELL_H_MM.toFixed(4)
  const labHmm = LABEL_H_MM.toFixed(4)
  const gapHalf = (GAP_MM / 2).toFixed(4)

  styleEl.textContent = `
    @media print {
      @page {
        size: ${PAPER_W_MM}mm ${PAPER_H_MM}mm;
        margin: 0;
      }

      body > *:not(#print-container) { display: none !important; }
      #print-container               { display: block !important; }

      .thermal-page {
        position: relative;
        width:  ${PAPER_W_MM}mm;
        height: ${PAPER_H_MM}mm;
        padding: ${MARGIN_V_MM}mm ${MARGIN_H_MM}mm;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(${QR_COLS}, ${qrMM}mm);
        grid-template-rows: repeat(${QR_ROWS}, ${cellHmm}mm);
        gap: ${GAP_MM}mm;
        background: white;
        page-break-after: always;
        break-after: page;
      }

      .thermal-page:last-child {
        page-break-after: avoid;
        break-after: avoid;
      }

      /* Garis potong vertikal */
      .cut-v {
        position: absolute;
        top:    ${MARGIN_V_MM}mm;
        bottom: ${MARGIN_V_MM}mm;
        width:  0;
        border-left: 0.3pt dashed #999999;
        pointer-events: none;
      }

      /* Garis potong horizontal */
      .cut-h {
        position: absolute;
        left:  ${MARGIN_H_MM}mm;
        right: ${MARGIN_H_MM}mm;
        height: 0;
        border-top: 0.3pt dashed #999999;
        pointer-events: none;
      }

      /* Cell = QR box + label teks */
      .qr-cell {
        display: flex;
        flex-direction: column;
        width:  ${qrMM}mm;
        height: ${cellHmm}mm;
        box-sizing: border-box;
        overflow: hidden;
      }

      .qr-img {
        display: block;
        width:  ${qrMM}mm;
        height: ${qrMM}mm;
        object-fit: fill;
        flex-shrink: 0;
      }

      /* Label teks di bawah QR box */
      .qr-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: ${labHmm}mm;
        background: white;
        line-height: 1.15;
      }

      .label-company {
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 3.2pt;
        color: #333333;
        letter-spacing: 0.3pt;
        text-transform: uppercase;
        display: block;
        text-align: center;
      }
      .label-product {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-style: italic;
  font-size: 2.8pt;
  color: #888888;
  letter-spacing: 0.2pt;
  display: block;
  text-align: center;
}

      .label-brand {
        font-family: Georgia, "Times New Roman", serif;
        font-weight: 700;
        font-size: 4.5pt;
        color: ${ACCENT_COLOR};
        letter-spacing: 1.5pt;
        text-transform: uppercase;
        display: block;
        text-align: center;
      }
    }
  `

  // ── Bangun DOM print container ────────────────────────────────────────────
  const existing = document.getElementById('print-container')
  if (existing) document.body.removeChild(existing)

  const container = document.createElement('div')
  container.id = 'print-container'
  container.style.cssText = 'display:none;'

  const valid = compositeUrls.value.filter(e => e.img)

  for (let pi = 0; pi < pages.value.length; pi++) {
    const pageEntries = valid.slice(pi * QR_PER_PAGE, (pi + 1) * QR_PER_PAGE)

    const pageDiv = document.createElement('div')
    pageDiv.className = 'thermal-page'

    // Garis potong vertikal (QR_COLS - 1)
    for (let c = 1; c < QR_COLS; c++) {
      const cutV = document.createElement('div')
      cutV.className = 'cut-v'
      const leftMM = MARGIN_H_MM + c * (QR_SIZE_MM + GAP_MM) - GAP_MM / 2
      cutV.style.left = `${leftMM.toFixed(4)}mm`
      pageDiv.appendChild(cutV)
    }

    // Garis potong horizontal (QR_ROWS - 1)
    for (let r = 1; r < QR_ROWS; r++) {
      const cutH = document.createElement('div')
      cutH.className = 'cut-h'
      const topMM = MARGIN_V_MM + r * (CELL_H_MM + GAP_MM) - GAP_MM / 2
      cutH.style.top = `${topMM.toFixed(4)}mm`
      pageDiv.appendChild(cutH)
    }

    // QR cells
    pageEntries.forEach(entry => {
      const cell = document.createElement('div')
      cell.className = 'qr-cell'

      const img = document.createElement('img')
      img.src = entry.img
      img.className = 'qr-img'
      img.alt = ''
      cell.appendChild(img)

      const label = document.createElement('div')
      label.className = 'qr-label'

      const company = document.createElement('span')
      company.className = 'label-company'
      company.textContent = 'PT KREASI TANI'

      const brand = document.createElement('span')
      brand.className = 'label-brand'
      brand.textContent = 'BUMIAJI'

      const product = document.createElement('span')
      product.className   = 'label-product'
      product.textContent = '· Produk Olahan ·'
      label.appendChild(product)

      label.appendChild(company)
      label.appendChild(brand)
      cell.appendChild(label)
      pageDiv.appendChild(cell)
    })

    container.appendChild(pageDiv)
  }

  document.body.appendChild(container)
  await new Promise(r => setTimeout(r, 600))
  window.print()

  setTimeout(() => {
    const el = document.getElementById('print-container')
    if (el) document.body.removeChild(el)
    styleEl.textContent = ''
  }, 2500)
}

const gradeBadgeClass = (grade?: string | null) =>
({
  A: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  B: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  C: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  REJECT: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}[grade ?? ''] ?? 'bg-gray-100 text-gray-500')
</script>

<style scoped>
.print-area {
  display: none;
}
</style>