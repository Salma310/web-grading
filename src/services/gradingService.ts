import { api } from './api'

export const getGradings        = ()                                  => api.get('/gradings')
export const getGradingsByBatch = (batchId: string)                   => api.get(`/gradings?batch_id=${batchId}`)
export const getGradingById     = (id: string)                        => api.get(`/gradings/${id}`)
export const getGradingStatus   = (id: string)                        => api.get(`/gradings/${id}/status`)
export const getGradingByQr     = (qrToken: string)                   => api.get(`/gradings/qr/${qrToken}`)
export const createGrading      = (formData: FormData)                => api.post('/gradings', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateGrading      = (id: string, payload: object)       => api.put(`/gradings/${id}`, payload)
export const deleteGrading      = (id: string)                        => api.delete(`/gradings/${id}`)