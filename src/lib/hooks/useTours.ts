import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import type { Tour, TourItineraryDay, Category } from '../database.types'

export interface TourListItem extends Tour {
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null
}

export interface TourWithRelations extends Tour {
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null
  tour_itinerary: TourItineraryDay[]
}

export type TourInsert = Omit<Tour, 'id' | 'created_at' | 'updated_at' | 'rating' | 'reviews_count'>
export type ItineraryDayInput = Omit<TourItineraryDay, 'id' | 'tour_id'>

export interface ToursFilter {
  active?: boolean
  category_id?: string
  limit?: number
}

export function useTours(filter?: ToursFilter) {
  const [data, setData] = useState<TourListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const filterActive = filter?.active
  const filterCategory = filter?.category_id
  const filterLimit = filter?.limit

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        let query = supabase
          .from('tours')
          .select('*, categories(id, name, slug)')
          .order('created_at', { ascending: false })

        if (filterActive !== undefined) query = query.eq('active', filterActive)
        if (filterCategory) query = query.eq('category_id', filterCategory)
        if (filterLimit) query = query.limit(filterLimit)

        const { data: rows, error: err } = await query
        if (err) throw err
        if (!cancelled) setData((rows ?? []) as unknown as TourListItem[])
      } catch (e) {
        console.error('useTours:', e)
        if (!cancelled) setError('No se pudieron cargar los tours.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [filterActive, filterCategory, filterLimit, tick])

  return { data, loading, error, reload: () => setTick(t => t + 1) }
}

export function useTour(id: string | undefined) {
  const [data, setData] = useState<TourWithRelations | null>(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) { setLoading(false); return }

    let cancelled = false
    setLoading(true)
    setError(null)

    supabase
      .from('tours')
      .select('*, categories(id, name, slug), tour_itinerary(*)')
      .eq('id', id)
      .single()
      .then(({ data: row, error: err }) => {
        if (cancelled) return
        if (err) {
          console.error('useTour:', err)
          setError('No se pudo cargar el tour.')
        } else {
          setData(row as unknown as TourWithRelations)
        }
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  return { data, loading, error }
}

export async function createTour(
  tour: TourInsert,
  itinerary: ItineraryDayInput[]
): Promise<Tour> {
  const { data, error } = await supabase
    .from('tours')
    .insert({ ...tour, rating: 0, reviews_count: 0 })
    .select()
    .single()
  if (error) throw error

  if (itinerary.length > 0) {
    const { error: itErr } = await supabase
      .from('tour_itinerary')
      .insert(itinerary.map(d => ({ ...d, tour_id: data.id })))
    if (itErr) throw itErr
  }

  return data as Tour
}

export async function updateTour(
  id: string,
  tour: Partial<TourInsert>,
  itinerary?: ItineraryDayInput[]
): Promise<Tour> {
  const { data, error } = await supabase
    .from('tours')
    .update(tour)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error

  if (itinerary !== undefined) {
    await supabase.from('tour_itinerary').delete().eq('tour_id', id)
    if (itinerary.length > 0) {
      const { error: insErr } = await supabase
        .from('tour_itinerary')
        .insert(itinerary.map(d => ({ ...d, tour_id: id })))
      if (insErr) throw insErr
    }
  }

  return data as Tour
}

export async function toggleTourActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase
    .from('tours')
    .update({ active })
    .eq('id', id)
  if (error) throw error
}
