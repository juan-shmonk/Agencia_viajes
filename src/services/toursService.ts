import { supabase } from '../lib/supabase'
import type { Tour } from '../lib/types/database'

export type CreateTourPayload = Omit<Tour, 'id' | 'created_at' | 'updated_at'>
export type UpdateTourPayload = Partial<CreateTourPayload>

export const toursService = {
  async getAll(includeInactive = false) {
    let query = supabase.from('tours').select('*').order('sort_order').order('created_at')
    if (!includeInactive) query = query.eq('is_active', true)
    const { data, error } = await query
    if (error) throw error
    return data as Tour[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('tours')
      .select('*, tour_prices(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('tours')
      .select('*, tour_prices(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    if (error) throw error
    return data
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from('tours')
      .select('*, tour_prices(*)')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order')
    if (error) throw error
    return data
  },

  async getByCategory(category: Tour['category']) {
    const { data, error } = await supabase
      .from('tours')
      .select('*, tour_prices(*)')
      .eq('category', category)
      .eq('is_active', true)
    if (error) throw error
    return data
  },

  async create(payload: CreateTourPayload) {
    const { data, error } = await supabase.from('tours').insert(payload).select().single()
    if (error) throw error
    return data as Tour
  },

  async update(id: string, payload: UpdateTourPayload) {
    const { data, error } = await supabase
      .from('tours').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data as Tour
  },

  async toggleActive(id: string, is_active: boolean) {
    const { data, error } = await supabase
      .from('tours').update({ is_active }).eq('id', id).select().single()
    if (error) throw error
    return data as Tour
  },

  async delete(id: string) {
    const { error } = await supabase.from('tours').delete().eq('id', id)
    if (error) throw error
  },

  async getStats() {
    const { data, error } = await supabase
      .from('tours')
      .select('id, is_active, is_featured, category')
    if (error) throw error
    return {
      total: data.length,
      active: data.filter(t => t.is_active).length,
      featured: data.filter(t => t.is_featured).length,
      byCategory: data.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }
  },
}
