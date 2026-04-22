export interface FarmerSummary {
  total: number
  active: number
}

export interface BatchSummary {
  total: number
  open: number
}

export interface GradingSummary {
  total: number
  thisMonth: number
  growth: number
}

export interface GradeDistribution {
  A: number
  B: number
  C: number
  REJECT: number
}

export interface DashboardSummary {
  farmers: FarmerSummary
  batches: BatchSummary
  gradings: GradingSummary
  gradeThisMonth: GradeDistribution
}

export interface MonthlyTrendItem {
  label: string
  total: number
  A: number
  B: number
  C: number
  REJECT: number
}

export interface AiMonthStats {
  count: number
  avg: number
}

export interface AiConfidenceData {
  thisMonth: AiMonthStats
  lastMonth: AiMonthStats
}

export interface TopFarmerItem {
  farmer: {
    id: number
    name: string
    farmer_code: string
  }
  gradeA: number
  totalGrading: number
}

export interface BatchItem {
  id: number
  lot_code: string
  status: string
  grading_count: number
  total_fruits: number
  total_grade_a: number
  total_grade_b: number
  total_grade_c: number
  farmer?: { name: string }
  land?: { land_name: string; land_code: string }
}