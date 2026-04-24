import { supabase } from '../lib/supabase'
import type { TourPrice, PriceType, Currency } from '../lib/types/database'

export type CreatePricePayload = {
  tour_id: string
  label: string
  type: PriceType
  currency: Currency
  amount: number
  min_pax?: number
  valid_from?: string
  valid_to?: string
}

export const pricingService = {
  async getByTour(tour_id: string, activeOnly = true) {
    let query = supabase
      .from('tour_prices')
      .select('*')
      .eq('tour_id', tour_id)
      .order('type')
    if (activeOnly) query = query.eq('is_active', true)
    const { data, error } = await query
    if (error) throw error
    return data as TourPrice[]
  },

  async getAll(activeOnly = false) {
    let query = supabase
      .from('tour_prices')
      .select('*, tour:tours(id, title, slug)')
      .order('created_at', { ascending: false })
    if (activeOnly) query = query.eq('is_active', true)
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async create(payload: CreatePricePayload) {
    const { data, error } = await supabase
      .from('tour_prices')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data as TourPrice
  },

  async update(id: string, payload: Partial<CreatePricePayload & { is_active: boolean }>) {
    const { data, error } = await supabase
      .from('tour_prices')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as TourPrice
  },

  async delete(id: string) {
    const { error } = await supabase.from('tour_prices').delete().eq('id', id)
    if (error) throw error
  },

  async toggleActive(id: string, is_active: boolean) {
    const { data, error } = await supabase
      .from('tour_prices')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as TourPrice
  },

  // Calculate total for a reservation
  calculateTotal(
    prices: TourPrice[],
    adults: number,
    children: number,
    currency: Currency = 'USD'
  ) {
    const filtered = prices.filter(p => p.currency === currency && p.is_active)
    const adultPrice = filtered.find(p => p.type === 'adult')?.amount ?? 0
    const childPrice = filtered.find(p => p.type === 'child')?.amount ?? 0
    return adultPrice * adults + childPrice * children
  },
}
