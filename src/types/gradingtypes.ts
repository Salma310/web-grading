// ── Types ─────────────────────────────────────────────────────────────
export type Grade         = 'A' | 'B' | 'C' | 'REJECT'
export type GradingMethod = 'AI' | 'MANUAL'
export type GradingStatus = 'DONE' | 'PROCESSING' | 'ERROR'

export interface BatchInfo {
  lot_code:   string
  fruit_type: string | null
}

export interface GradingItem {
  id:              string
  grading_code:    string
  batch_id:        string
  grade:           Grade | null
  grading_method:  GradingMethod
  confidence_avg:  number | null
  total_detected:  number | null
  consistency:     string | null
  defect_detected: boolean | null
  error_message:   string | null
  qr_token:        string
  image_urls:      string[]
  status:          GradingStatus
  createdAt:       string
  batch:           BatchInfo | null
}

export interface GradingForm {
  batch_id:       string
  grading_method: GradingMethod
  grade:          Grade | ''
}

export interface Toast {
  id:      number
  message: string
  type:    'success' | 'error' | 'info'
}