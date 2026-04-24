import { supabase } from '../lib/supabase'
import type { Reservation, ReservationStatus, PaymentStatus } from '../lib/types/database'

export type CreateReservationPayload = {
  tour_id: string
  availability_id?: string
  guests_adult: number
  guests_child: number
  total_amount: number
  currency: 'USD' | 'MXN'
  contact_name: string
  contact_email: string
  contact_phone?: string
  special_requests?: string
  user_id?: string
}

export interface ReservationFilters {
  status?: ReservationStatus
  payment_status?: PaymentStatus
  tour_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

export const reservationsService = {
  async getAll(filters: ReservationFilters = {}) {
    let query = supabase
      .from('reservations')
      .select(`
        *,
        tour:tours(id, title, slug, category, location),
        profile:profiles(id, full_name, phone)
      `)
      .order('created_at', { ascending: false })

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.payment_status) query = query.eq('payment_status', filters.payment_status)
    if (filters.tour_id) query = query.eq('tour_id', filters.tour_id)
    if (filters.date_from) query = query.gte('created_at', filters.date_from)
    if (filters.date_to) query = query.lte('created_at', filters.date_to)
    if (filters.search) {
      query = query.or(
        `contact_name.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%,reservation_code.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query
    if (error) throw error
    return data as Reservation[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        tour:tours(*),
        profile:profiles(*)
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async getByCode(code: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select('*, tour:tours(*)')
      .eq('reservation_code', code)
      .single()
    if (error) throw error
    return data
  },

  async create(payload: CreateReservationPayload) {
    const { data, error } = await supabase
      .from('reservations')
      .insert(payload)
      .select('*, tour:tours(*)')
      .single()
    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: ReservationStatus) {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Reservation
  },

  async updatePaymentStatus(id: string, payment_status: PaymentStatus) {
    const { data, error } = await supabase
      .from('reservations')
      .update({ payment_status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Reservation
  },

  async addInternalNote(id: string, note: string) {
    const { data, error } = await supabase
      .from('reservations')
      .update({ internal_notes: note })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Reservation
  },

  async getDashboardStats() {
    const { data, error } = await supabase
      .from('reservations')
      .select('status, payment_status, total_amount, currency, created_at')
    if (error) throw error

    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    const monthRevenue = data
      .filter(r => {
        const d = new Date(r.created_at)
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear
          && r.payment_status === 'paid'
      })
      .reduce((sum, r) => sum + (r.total_amount ?? 0), 0)

    return {
      total: data.length,
      pending: data.filter(r => r.status === 'pending').length,
      confirmed: data.filter(r => r.status === 'confirmed').length,
      cancelled: data.filter(r => r.status === 'cancelled').length,
      completed: data.filter(r => r.status === 'completed').length,
      monthRevenue,
      totalRevenue: data
        .filter(r => r.payment_status === 'paid')
        .reduce((sum, r) => sum + (r.total_amount ?? 0), 0),
    }
  },
}
