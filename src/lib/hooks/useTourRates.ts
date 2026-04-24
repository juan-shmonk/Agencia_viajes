import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import type { TourRate } from '../database.types'

export type RateInput = {
  name: string
  description: string | null
  price: number
  currency: string
  display_order: number
  active: boolean
}

export function useTourRates(tourId: string | undefined) {
  const [data, setData] = useState<TourRate[]>([])
  const [loading, setLoading] = useState(!!tourId)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!tourId) { setLoading(false); return }

    let cancelled = false
    setLoading(true)
    setError(null)

    supabase
      .from('tour_rates')
      .select('*')
      .eq('tour_id', tourId)
      .order('display_order')
      .then(({ data: rows, error: err }) => {
        if (cancelled) return
        if (err) {
          console.error('useTourRates:', err)
          setError('No se pudieron cargar las tarifas.')
        } else {
          setData(rows ?? [])
        }
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [tourId, tick])

  return { data, loading, error, reload: () => setTick(t => t + 1) }
}

export async function createRate(tourId: string, input: RateInput): Promise<TourRate> {
  const { data, error } = await supabase
    .from('tour_rates')
    .insert({ ...input, tour_id: tourId })
    .select()
    .single()
  if (error) throw error
  return data as TourRate
}

export async function updateRate(id: string, input: Partial<RateInput>): Promise<TourRate> {
  const { data, error } = await supabase
    .from('tour_rates')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as TourRate
}

export async function deleteRate(id: string): Promise<void> {
  const { count, error: countErr } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('rate_id', id)

  if (countErr) throw countErr
  if (count && count > 0) throw new Error('TIENE_BOOKINGS')

  const { error } = await supabase.from('tour_rates').delete().eq('id', id)
  if (error) throw error
}

export async function toggleRateActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase
    .from('tour_rates')
    .update({ active })
    .eq('id', id)
  if (error) throw error
}
